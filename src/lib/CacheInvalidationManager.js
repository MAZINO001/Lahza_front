/**
 * Cache Invalidation Manager
 * Handles cross-entity cache updates and dependencies
 * 
 * When one entity changes, it automatically invalidates related entities
 */

import { QUERY_KEYS } from '@/lib/queryKeys';

export class CacheInvalidationManager {
    constructor(queryClient) {
        this.queryClient = queryClient;

        // Define cache dependencies: if X changes, invalidate these
        this.dependencies = {
            // When a quote changes, potentially affects invoices and payments
            quotes: [
                QUERY_KEYS.quotes,
                QUERY_KEYS.invoices,
                QUERY_KEYS.payments,
            ],
            // When an invoice changes, affects payments and dashboard
            invoices: [
                QUERY_KEYS.invoices,
                QUERY_KEYS.payments,
                QUERY_KEYS.dashboardStats,
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

        console.log(`🔄 Invalidating ${primaryEntity}:`, cacheKeysToInvalidate);

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

        console.log(`🔄 Invalidating multiple entities:`, entities, Array.from(allKeysToInvalidate));

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
        console.log(`🔄 Invalidating query key:`, queryKey);
        await this.queryClient.invalidateQueries({ queryKey });
    }

    /**
     * Invalidate all caches at once
     * Use sparingly - only for major operations
     */
    async invalidateAll() {
        console.log(`🔄 Invalidating ALL caches`);
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