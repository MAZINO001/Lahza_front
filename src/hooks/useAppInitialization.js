// Remove eslint-disable - we're fixing the actual issue!
import { useClients } from '@/features/clients/hooks/useClients/useClientsData';
import { useServices } from '@/features/services/hooks/useServicesData';
import { useDocumentsData } from '@/features/documents/hooks/useDocuments/useDocumentsData';
import { useProjects } from '@/features/projects/hooks/useProjects/useProjectsData';
import { usePayments } from '@/features/payments/hooks/usePayments/usePaymentsData';
import { useOffers } from '@/features/offers/hooks/useOffers/useOffersData';
import { useAuthContext } from '@/hooks/AuthContext';
import { useCompanyInfo } from '@/features/settings/hooks/useSettingsAgencyInfoQuery';

export function useAppInitialization() {
    const { user, loading: authLoading } = useAuthContext();

    const isEnabled = !!user && !authLoading;
    // Call ALL hooks unconditionally - BEFORE any conditionals
    const servicesQuery = useServices({ enabled: isEnabled });
    const clientsQuery = useClients({ enabled: isEnabled });
    const invoicesQuery = useDocumentsData('invoices', { enabled: isEnabled });
    const quotesQuery = useDocumentsData('quotes', { enabled: isEnabled });
    const projectsQuery = useProjects({ enabled: isEnabled });
    const paymentsQuery = usePayments({ enabled: isEnabled });
    const offersQuery = useOffers({ enabled: isEnabled });
    const companyInfoQuery = useCompanyInfo({ enabled: isEnabled });

    // NOW you can use conditionals - AFTER all hooks are called
    if (authLoading) {
        return {
            isLoading: true,
            servicesQuery: { isLoading: true },
            clientsQuery: { isLoading: true },
            invoicesQuery: { isLoading: true },
            quotesQuery: { isLoading: true },
            projectsQuery: { isLoading: true },
            paymentsQuery: { isLoading: true },
            offersQuery: { isLoading: true },
            companyInfoQuery: { isLoading: true },
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
        offersQuery.isLoading ||
        companyInfoQuery.isLoading;

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
        companyInfoQuery,
    };
}