import { useServices } from '@/features/services/hooks/useServicesData';
// import { useClients } from '@/hooks/useClients';
// import { useProjects } from '@/hooks/useProjects';
// import { useTasks } from '@/hooks/useTasks';
// import { useInvoices } from '@/hooks/useInvoices';
// import { usePayments } from '@/hooks/usePayments';
// import { useDocuments } from '@/hooks/useDocuments';

export function useAppInitialization() {
    // Load all main data tables at app startup
    // These load ONCE and stay cached for the entire session
    const servicesQuery = useServices();
    // const clientsQuery = useClients();
    // const projectsQuery = useProjects();
    // const tasksQuery = useTasks();
    // const invoicesQuery = useInvoices();
    // const paymentsQuery = usePayments();
    // const documentsQuery = useDocuments();

    // Determine if any are still loading
    const isLoading =
        servicesQuery.isLoading
    // servicesQuery.isLoading ||
    // clientsQuery.isLoading ||
    // projectsQuery.isLoading ||
    // tasksQuery.isLoading ||
    // invoicesQuery.isLoading ||
    // paymentsQuery.isLoading ||
    // documentsQuery.isLoading;

    // Return loading state and all query objects for more granular control if needed
    return {
        isLoading,
        // Optional: expose individual queries if you need them
        servicesQuery,
        // clientsQuery,
        // projectsQuery,
        // tasksQuery,
        // invoicesQuery,
        // paymentsQuery,
        // documentsQuery,
    };
}