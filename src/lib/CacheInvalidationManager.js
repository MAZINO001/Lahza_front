/**
 * Cache Invalidation Manager
 * Handles cross-entity cache updates and dependencies
 *
 * When one entity changes, it automatically invalidates related entities.
 * Use invalidateDependentsOnly() after optimistic/setQueryData updates to avoid
 * redundant refetches of the primary list you already updated.
 */

import { QUERY_KEYS } from '@/lib/queryKeys';

const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

export class CacheInvalidationManager {
    constructor(queryClient) {
        this.queryClient = queryClient;

        // Define cache dependencies: if X changes, invalidate these
        this.dependencies = {
            // When a quote changes, potentially affects invoices and payments
            quotes: [
                QUERY_KEYS.quotes,
                QUERY_KEYS.invoices,
                QUERY_KEYS.projects,
                QUERY_KEYS.invoicesProjects,
                QUERY_KEYS.payments,
            ],
            // When an invoice changes, affects payments and dashboard
            invoices: [
                QUERY_KEYS.invoices,
                QUERY_KEYS.projects,
                QUERY_KEYS.invoicesProjects,
                QUERY_KEYS.payments,
                QUERY_KEYS.dashboardStats
            ],
            // When a payment changes, affects dashboard and project stats
            payments: [
                QUERY_KEYS.clients,
                QUERY_KEYS.payments,
                QUERY_KEYS.invoices,
                QUERY_KEYS.dashboardStats,
                QUERY_KEYS.projects, // Projects might have payment status
            ],
            // When a client changes, affects their projects and documents
            clients: [
                QUERY_KEYS.projects,
                QUERY_KEYS.invoices,
                QUERY_KEYS.quotes,
            ],
            // When a project changes, affects tasks, invoices, and payments
            projects: [
                QUERY_KEYS.projects,
                QUERY_KEYS.tasks,
                QUERY_KEYS.invoices,
                QUERY_KEYS.payments,
            ],
            // When a service changes, affects all documents using it
            services: [
                QUERY_KEYS.services,
                QUERY_KEYS.invoices,
                QUERY_KEYS.quotes,
            ],
        };
    }

    /**
     * Invalidate a primary cache and all its dependent caches
     * @param {string} primaryEntity - The entity that changed (e.g., 'quotes', 'invoices')
     * @param {Object} options - Additional options
     * @param {boolean} options.parallel - Invalidate all at once (true) or sequentially (false)
     */
    async invalidateByEntity(primaryEntity, options = {}) {
        const { parallel = true } = options;

        const cacheKeysToInvalidate = this.dependencies[primaryEntity] || [QUERY_KEYS[primaryEntity]];
        if (isDev) console.log(`[CacheInvalidation] ${primaryEntity}:`, cacheKeysToInvalidate);

        if (parallel) {
            // Invalidate all at once - faster but hammers the API
            await Promise.all(
                cacheKeysToInvalidate.map(queryKey =>
                    this.queryClient.invalidateQueries({ queryKey })
                )
            );
        } else {
            // Invalidate sequentially - more controlled, reduces API load
            for (const queryKey of cacheKeysToInvalidate) {
                await this.queryClient.invalidateQueries({ queryKey });
            }
        }
    }

    /**
     * Invalidate multiple related entities together
     * @param {string[]} entities - Array of entities that changed
     */
    async invalidateMultiple(entities, options = {}) {
        const { parallel = false } = options;

        // Collect all unique cache keys from all entities
        const allKeysToInvalidate = new Set();

        entities.forEach(entity => {
            const keys = this.dependencies[entity] || [QUERY_KEYS[entity]];
            keys.forEach(key => allKeysToInvalidate.add(key));
        });

        if (isDev) console.log(`[CacheInvalidation] multiple:`, entities, Array.from(allKeysToInvalidate));

        if (parallel) {
            await Promise.all(
                Array.from(allKeysToInvalidate).map(queryKey =>
                    this.queryClient.invalidateQueries({ queryKey })
                )
            );
        } else {
            for (const queryKey of allKeysToInvalidate) {
                await this.queryClient.invalidateQueries({ queryKey });
            }
        }
    }

    /**
     * Invalidate cache by specific query key
     * Useful for custom cache keys or specific IDs
     */
    async invalidateByQueryKey(queryKey) {
        if (isDev) console.log(`[CacheInvalidation] queryKey:`, queryKey);
        await this.queryClient.invalidateQueries({ queryKey });
    }

    /**
     * Return only dependent cache keys for an entity (excludes the entity's own list key).
     * Use when you have already updated the primary list (e.g. via setQueryData) and want
     * to avoid redundant refetches of that list.
     */
    getDependentKeys(primaryEntity) {
        const primaryKey = QUERY_KEYS[primaryEntity];
        const allKeys = this.dependencies[primaryEntity] || [];
        return allKeys.filter(key => key !== primaryKey);
    }

    /**
     * Invalidate only dependent caches for an entity, not the entity's own list.
     * Call this after you have already updated the primary list (optimistic or with server response)
     * to keep related views in sync without refetching the list you just wrote.
     * @param {string} primaryEntity - e.g. 'quotes', 'invoices', 'payments'
     * @param {Object} options - { parallel: boolean }
     */
    async invalidateDependentsOnly(primaryEntity, options = {}) {
        const { parallel = false } = options;
        const cacheKeysToInvalidate = this.getDependentKeys(primaryEntity);
        if (cacheKeysToInvalidate.length === 0) return;
        if (isDev) console.log(`[CacheInvalidation] dependents of ${primaryEntity}:`, cacheKeysToInvalidate);

        if (parallel) {
            await Promise.all(
                cacheKeysToInvalidate.map(queryKey =>
                    this.queryClient.invalidateQueries({ queryKey })
                )
            );
        } else {
            for (const queryKey of cacheKeysToInvalidate) {
                await this.queryClient.invalidateQueries({ queryKey });
            }
        }
    }

    /**
     * Invalidate all caches at once
     * Use sparingly - only for major operations
     */
    async invalidateAll() {
        if (isDev) console.log(`[CacheInvalidation] all`);
        await this.queryClient.invalidateQueries();
    }
}

/**
 * Create and export a singleton instance
 * You'll pass the queryClient when creating it in your mutation hooks
 */
export function createCacheInvalidator(queryClient) {
    return new CacheInvalidationManager(queryClient);
}