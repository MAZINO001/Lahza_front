# Deep Technical Review: Caching System

This document summarizes findings from a review of the React Query + Axios caching layer: `lib/api`, `CacheInvalidationManager.js`, `queryClient.js`, `axios.js`, `useAppInitialization.js`, and all `features/**/hooks` that touch cache.

---

## 1. Critical Bugs

### 1.1 `useUpdatePayment` — Wrong `onSuccess` signature (logical error)

**File:** `features/payments/hooks/usePayments/useUpdatePayment.js`

**Issue:** `onSuccess` is declared as `(response, id)` but React Query passes `(data, variables, context)`. The mutation variables are `{ id, data }`, so the second argument is the full variables object, not `id`. As a result:

- `QUERY_KEYS.payment(id)` is actually `QUERY_KEYS.payment({ id, data })` → key becomes `['payment', { id, data }]`, which never matches the real query key `['payment', 123]`.
- The single-payment cache is never invalidated; only the list is.
- Toast says "Payment canceled" (copy-paste from cancel flow).

**Impact:** Stale data when viewing a single payment after update; wrong toast; possible confusion in debugging.

**Fix:** Use `(response, variables)` and destructure `variables.id`; fix toast to "Payment updated".

---

### 1.2 `useCreateService` — Wrong replacement in `onSuccess`

**File:** `features/services/hooks/useCreateService.js`

**Issue:** In `onSuccess`, the list is updated with:

```js
old?.map(service =>
  service.id.toString().startsWith('temp-') ? response : service
)
```

This replaces **every** item whose `id` starts with `'temp-'` with the same `response`. If multiple creates were triggered (or a retry), more than one row could be replaced by the same server payload. The correct behavior is to replace only the item that matches `context.tempId`.

**Impact:** List corruption (duplicate or wrong data) if multiple temp items exist or if structure differs.

**Fix:** Match by `context?.tempId` and replace only that item with `response`.

---

### 1.3 `useUpdateDocument` — Uses `QUERY_KEYS.document(id)` vs list key

**File:** `features/documents/hooks/useDocuments/useUpdateDocument.js`

**Observation:** List cache uses `QUERY_KEYS.invoices` or `QUERY_KEYS.quotes`, while detail uses `QUERY_KEYS.document(id)` (`['document', id]`). The document hook uses `useDocument(id, type)` with `QUERY_KEYS.document(id)`, so this is consistent. No bug here, but `useUpdateDocument` does **not** use `CacheInvalidationManager`. Updating an invoice/quote can affect payments and dashboard; consider invalidating dependents (e.g. payments, dashboardStats) on success for consistency.

---

## 2. Invalidation and Redundant Refetches

### 2.1 Optimistic update + full entity invalidation

**Pattern:** Several mutations do:

1. Optimistic update (e.g. `setQueryData` for the primary list).
2. On success, update cache again with server response.
3. Then call `cacheInvalidator.invalidateByEntity(entityName)` or equivalent.

**Examples:** `useCreateDocument`, `useConfirmPayment`, `useCancelPayment`.

**Issue:** Step 3 marks the **primary** entity’s queries as stale and triggers refetches. The list was already updated in step 2, so refetching the same list is redundant and causes extra network requests and CPU.

**Impact:** More HTTP requests, more re-renders, higher server load (e.g. one document create can trigger refetches for quotes, invoices, projects, invoicesProjects, payments).

**Recommendation:**

- **Option A:** Invalidate only **dependent** keys, not the primary entity key you just updated. Extend `CacheInvalidationManager` with e.g. `invalidateDependentsOnly(primaryEntity)` that invalidates everything in `dependencies[primaryEntity]` **except** the key for `primaryEntity`.
- **Option B:** Skip invalidation for the primary list when you’ve already set it from the server response; only invalidate dependents (payments, dashboard, etc.).

---

### 2.2 Confirm/Cancel payment — Broad invalidation

**Files:** `useConfirmPayment.js`, `useCancelPayment.js`

**Current behavior:** Optimistic update for payments list and single payment; on success, `invalidateByEntity('payments')` runs, which invalidates: `clients`, `payments`, `invoices`, `dashboardStats`, `projects`.

**Issue:** Payments list was already updated optimistically and could be updated again from the server if desired. Invalidating `payments` forces another refetch. Invalidating `clients`, `invoices`, `projects`, `dashboardStats` is correct for consistency but multiplies requests.

**Recommendation:** Keep invalidating dependents (clients, invoices, dashboardStats, projects). For the `payments` key, either skip invalidation (you already updated cache) or use a single targeted refetch instead of full invalidation. Prefer not marking the payments list stale if the UI already shows the correct state.

---

### 2.3 `useCreateDocument` — Double update then full invalidation

**File:** `features/documents/hooks/useDocuments/useCreateDocument.js`

**Flow:** Optimistic add → on success `setQueryData` with server document → then `invalidateByEntity(entityName)` (quotes or invoices), which includes the same list key.

**Issue:** The list is correct after `setQueryData`, but then it’s marked stale and refetched. So you do an extra network call and re-render for data you already have.

**Recommendation:** Invalidate only dependents (e.g. invoices if you created a quote, or payments/projects/dashboard for invoices). Do not invalidate the list key you just wrote to.

---

## 3. Inconsistent Use of CacheInvalidationManager

**Uses CacheInvalidationManager:**

- `useCreateDocument` (invoices/quotes)
- `useConfirmPayment` / `useCancelPayment`
- `useCreateInvoiceFromQuote` (`invalidateMultiple(['quotes','invoices'])`)

**Do not use it (direct `invalidateQueries` or no invalidation):**

- `useUpdateDocument` — no dependent invalidation (payments, dashboard).
- `useDeleteDocument` — only removes `QUERY_KEYS.document(id)`; no invalidation of lists or dependents.
- `useCreatePayment` / `useUpdatePayment` / `useDeletePayment` / `useUpdatePaymentDate` / `useCreateAdditionalPayment` — no cross-entity invalidation (e.g. clients, invoices, dashboardStats).
- `useCreateClient` / `useUpdateClient` / `useDeleteClient` — no invalidation of projects, invoices, quotes (per `dependencies.clients`).
- `useCreateProject` / `useUpdateProject` / `useDeleteProject` — no invalidation of tasks, invoices, payments (per `dependencies.projects`).
- `useCreateOffer` / `useUpdateOffer` / `useDeleteOffer` — only local list/detail updates.
- `useCreateService` / `useUpdateService` / `useDeleteService` — no invalidation of invoices/quotes (per `dependencies.services`).

**Impact:** After mutations, some views (dashboard, client balances, project stats, document lists) can show stale data until the user triggers a refetch (e.g. by navigating) or until another mutation invalidates them.

**Recommendation:** Either use `CacheInvalidationManager` (or a shared helper) for all mutations that affect dependent entities, or document which flows intentionally skip cross-entity invalidation. Prefer centralizing dependency rules in one place.

---

## 4. Query Client and Defaults

**File:** `lib/queryClient.js`

**Current:**

- `staleTime: Infinity` → data never becomes stale by time.
- `gcTime: 24h` → unused cache kept for 24 hours.
- `refetchOnMount` / `refetchOnWindowFocus` / `refetchOnReconnect: false`.

**Observations:**

- **Memory:** With `staleTime: Infinity`, every list/detail stays in cache until gc. Many entities (clients, projects, invoices, quotes, payments, offers, services, etc.) can add up. Acceptable if usage is bounded; otherwise consider finite `staleTime` for heavy lists.
- **Staleness:** Relying only on invalidation is correct if invalidation is complete. Given the gaps above, some data can stay “fresh” in React Query terms but be logically stale.
- **Override:** `useProjects` uses `staleTime: 5 * 60 * 1000` and `refetchOnMount: true`. That’s a deliberate exception; document why (e.g. “projects change often”) so future changes don’t blindly align everything to Infinity.

**Recommendation:** Keep defaults as-is if you’re addressing invalidation coverage. Optionally add a short comment in `queryClient.js` that cache freshness is invalidation-driven and that mutations should invalidate dependents.

---

## 5. CacheInvalidationManager Design

**File:** `lib/CacheInvalidationManager.js`

**Issues:**

1. **Console logging in production:** `console.log` on every invalidation adds noise and slight overhead. Prefer a dev-only logger or remove.
2. **No “dependents only” option:** You can’t invalidate only dependents of an entity without also invalidating the entity key itself. Adding `invalidateDependentsOnly(entity)` would reduce redundant refetches (see §2.1).
3. **Parallel vs sequential:** `invalidateByEntity(..., { parallel: false })` is used to limit concurrency. React Query’s `invalidateQueries` already returns a promise; firing many invalidations in parallel can trigger many refetches at once. Sequential is safer for server load; consider making sequential the default and documenting it.
4. **Key shape:** `invalidateQueries({ queryKey })` with keys like `['payments']` correctly matches list queries. Detail keys like `['payment', id]` are not in the dependency arrays; that’s intentional (only list/dashboard-style keys are invalidated). No change needed if that’s the design.

**Suggestion:** Add a small helper that returns only dependent keys for an entity (e.g. `getDependentKeys(primaryEntity)` excluding the primary key) and use it for “invalidate dependents only” and for consistent logging/metrics.

---

## 6. useAppInitialization

**File:** `hooks/useAppInitialization.js`

**Behavior:** When `user` is set and not loading, it enables 8 queries in parallel (services, clients, invoices, quotes, projects, payments, offers, companyInfo). All hooks are called unconditionally (correct); `enabled: isEnabled` prevents running until auth is ready.

**Observations:**

- No caching bug: queries are standard and keyed correctly.
- **Load spike:** On first load after login, 8 requests fire at once. If the backend or network is a bottleneck, consider prefetching in a tree (e.g. companyInfo first, then the rest) or using `prefetchQuery` in a single place and letting components use `useQuery` with the same keys so they hit cache. This is an optimization, not a correctness issue.
- **Re-renders:** Each hook returns an object; the combined `isLoading` is derived from all of them. When any query transitions from loading to success, the hook re-renders. This is expected and not a memory leak.

**Recommendation:** Optional: prefetch critical data (e.g. companyInfo) before enabling the rest to smooth out the initial request burst.

---

## 7. Axios and API Layer

**File:** `lib/utils/axios.js`

- Single instance, interceptors only for 401/403 (no cache, no request deduplication). React Query handles deduplication via query keys.
- No logical error; no change required for caching. Adding request/response logging or retries is optional and unrelated to cache correctness.

**API modules (`lib/api/*.js`):** Thin wrappers around axios; no caching logic. No issues.

---

## 8. Anti-patterns and Small Fixes

1. **useDeleteClient:** In `onSuccess` it calls `invalidateQueries({ queryKey: QUERY_KEYS.clients })`. The list was already optimistically updated in `onMutate` (filtered). Invalidating triggers an extra refetch. Either keep invalidation to sync with server (and accept the refetch) or rely on optimistic update and invalidate only dependents (projects, invoices, quotes) via CacheInvalidationManager.
2. **useDeleteService:** Same idea: `onSuccess` invalidates `QUERY_KEYS.services` after optimistic remove. Optional: skip list invalidation and only invalidate dependents (invoices, quotes) if you trust the optimistic remove.
3. **useMarkAsComplete:** Uses both optimistic update and then invalidates projects, project(id), tasks. Reasonable to refetch tasks; consider not invalidating projects/project(id) if you’re confident the optimistic state is correct, to reduce requests.
4. **useCreateInvoiceFromQuote:** Correctly uses `invalidateMultiple(['quotes', 'invoices'])` and rolls back payments in context. No bug; consider adding payments to the invalidation set if the backend creates payment-related data when creating an invoice from a quote (already covered if payments are in the dependency union).

---

## 9. Summary of Recommended Changes

| Priority | Item | Action |
|----------|------|--------|
| High | useUpdatePayment `onSuccess` | Use `variables.id` and fix toast. |
| High | useCreateService `onSuccess` | Replace by `context.tempId` only. |
| Medium | Redundant refetches after optimistic update | Invalidate dependents only (or add `invalidateDependentsOnly`) and avoid invalidating the primary list you just set. |
| Medium | CacheInvalidationManager | Add dependents-only option; reduce or gate console.log. |
| Medium | Cross-entity invalidation | Use CacheInvalidationManager (or shared invalidation) for payment, client, project, document, service, offer mutations where dependencies apply. |
| Low | useDeleteClient / useDeleteService | Consider invalidating only dependents instead of the list. |
| Low | useAppInitialization | Optional: stagger or prefetch to reduce initial burst. |
| Low | queryClient / useProjects | Document invalidation-driven freshness and projects’ shorter staleTime. |

---

## 10. Performance and Scalability

- **CPU:** Redundant refetches and extra re-renders from over-invalidation increase CPU. Tightening invalidation to “dependents only” and avoiding refetch of the mutated list reduces work.
- **Memory:** With `staleTime: Infinity` and 24h gc, cache size grows with usage. For very large lists, consider pagination and keyed by page so unused pages can be garbage-collected.
- **Network:** Fewer invalidations and “dependents only” invalidation reduce the number of requests per mutation. Consistent use of CacheInvalidationManager for dependents avoids stale UIs and ad-hoc refetches.
- **Consistency:** Centralizing “who invalidates what” in CacheInvalidationManager (and using it everywhere that affects dependents) makes behavior predictable and easier to tune (e.g. sequential vs parallel, what to skip in development).

Implementing the high-priority fixes and the “invalidate dependents only” pattern will make the caching system more correct, smoother, and more predictable without changing the overall architecture.
