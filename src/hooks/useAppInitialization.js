// Remove eslint-disable - we're fixing the actual issue!
import { useClients } from '@/features/clients/hooks/useClients/useClientsData';
import { useServices } from '@/features/services/hooks/useServicesData';
import { useDocumentsData } from '@/features/documents/hooks/useDocuments/useDocumentsData';
import { useProjects } from '@/features/projects/hooks/useProjects/useProjectsData';
import { usePayments } from '@/features/payments/hooks/usePayments/usePaymentsData';
import { useOffers } from '@/features/offers/hooks/useOffers/useOffersData';
import { useAuthContext } from '@/hooks/AuthContext';

export function useAppInitialization() {
    const { user, loading: authLoading } = useAuthContext();

    // Call ALL hooks unconditionally - BEFORE any conditionals
    const servicesQuery = useServices();
    const clientsQuery = useClients();
    const invoicesQuery = useDocumentsData('invoices');
    const quotesQuery = useDocumentsData('quotes');
    const projectsQuery = useProjects();
    const paymentsQuery = usePayments();
    const offersQuery = useOffers();

    // NOW you can use conditionals - AFTER all hooks are called
    if (authLoading || !user) {
        return {
            isLoading: true, // or authLoading if you prefer
            servicesQuery: { isLoading: true },
            clientsQuery: { isLoading: true },
            invoicesQuery: { isLoading: true },
            quotesQuery: { isLoading: true },
            projectsQuery: { isLoading: true },
            paymentsQuery: { isLoading: true },
            offersQuery: { isLoading: true },
        };
    }

    // Determine if any are still loading
    const isLoading =
        servicesQuery.isLoading ||
        clientsQuery.isLoading ||
        invoicesQuery.isLoading ||
        quotesQuery.isLoading ||
        projectsQuery.isLoading ||
        paymentsQuery.isLoading ||
        offersQuery.isLoading;

    // Return loading state and all query objects
    return {
        isLoading,
        servicesQuery,
        clientsQuery,
        invoicesQuery,
        quotesQuery,
        projectsQuery,
        paymentsQuery,
        offersQuery,
    };
}