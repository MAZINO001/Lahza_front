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

    // Fetch company info first to reduce initial request burst (1 request, then the rest)
    const companyInfoQuery = useCompanyInfo({ enabled: isEnabled });
    const phase2Enabled = isEnabled && companyInfoQuery.isFetched;

    // Call ALL hooks unconditionally - BEFORE any conditionals
    const servicesQuery = useServices({ enabled: phase2Enabled });
    const clientsQuery = useClients({ enabled: phase2Enabled });
    const invoicesQuery = useDocumentsData('invoices', { enabled: phase2Enabled });
    const quotesQuery = useDocumentsData('quotes', { enabled: phase2Enabled });
    const projectsQuery = useProjects({ enabled: phase2Enabled });
    const paymentsQuery = usePayments({ enabled: phase2Enabled });
    const offersQuery = useOffers({ enabled: phase2Enabled });

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