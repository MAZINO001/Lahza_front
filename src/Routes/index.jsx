// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   Outlet,
// } from "react-router-dom";
// import Login from "../pages/Auth/Login";
// import Register from "../pages/Auth/Register";
// import ResetPassword from "../pages/Auth/ResetPassword";
// import ForgotPassword from "../pages/Auth/ForgotPassword";
// import ConfirmPassword from "../pages/Auth/ConfirmPassword";

// import DashboardPage from "../pages/dashboard/DashboardPage";

// import ProjectsPage from "../pages/projects/ProjectsPage";
// import ProjectViewPage from "../pages/projects/ProjectViewPage";
// import ProjectEditPage from "../pages/projects/ProjectEditPage";
// import ProjectCreatePage from "../pages/projects/ProjectCreatePage";

// import QuotesPage from "../pages/quotes/QuotesPage";
// import QuoteViewPage from "../pages/quotes/QuoteViewPage";
// import QuoteCreatePage from "../pages/quotes/QuoteCreatePage";
// import QuoteEditPage from "../pages/quotes/QuoteEditPage";

// import TicketsPage from "../pages/tickets/TicketsPage";
// import TicketViewPage from "../pages/tickets/TicketViewPage";
// import TicketCreatePage from "../pages/tickets/TicketCreatePage";
// import TicketEditPage from "../pages/tickets/TicketEditPage";

// import InvoicesPage from "../pages/invoices/InvoicesPage";
// import InvoiceViewPage from "../pages/invoices/InvoiceViewPage";
// import InvoiceCreatePage from "../pages/invoices/InvoiceCreatePage";
// import InvoiceEditPage from "../pages/invoices/InvoiceEditPage";

// import ServicesPage from "../pages/services/ServicesPage";
// import ServiceViewPage from "../pages/services/ServiceViewPage";
// import ServiceCreatePage from "../pages/services/ServiceCreatePage";
// import ServiceEditPage from "../pages/services/ServiceEditPage";

// import ClientsPage from "../pages/clients/ClientsPage";
// import ClientCreatePage from "../pages/clients/ClientCreatePage";
// import ClientEditPage from "../pages/clients/ClientEditPage";
// import ClientViewPage from "../pages/clients/ClientViewPage";

// import PaymentsPage from "../pages/payments/PaymentsPage";
// import PaymentViewPage from "../pages/payments/PaymentViewPage";

// import OffersPage from "../pages/offers/OffersPage";
// import OfferViewPage from "../pages/offers/OfferViewPage";
// import OfferCreatePage from "../pages/offers/OfferCreatePage";
// import OfferEditPage from "../pages/offers/OfferEditPage";

// import ActivityLogsPage from "@/pages/activityLogs/ActivityLogsPage";
// import ActivityLogViewPage from "@/pages/activityLogs/ActivityLogViewPage";

// import SettingsPage from "@/pages/settings/settingsPage";
// import CalendarPage from "@/pages/calendar/CalendarPage";
// import TasksPage from "@/pages/tasks/tasksPage";

// import AuthLayout from "@/app/layout/AuthLayout";
// import AppLayout from "@/app/layout/AppLayout";
// import ProtectedRoute from "./ProtectedRoute";
// import { useAuthContext } from "@/hooks/AuthContext";
// import TaskCreatePage from "@/pages/tasks/TaskCreatePage";
// import TaskEditPage from "@/pages/tasks/TaskEditPage";
// import AdditionalDataViewPage from "@/pages/additional_data/AdditionalDataViewPage";
// import AdditionalDataCreatePage from "@/pages/additional_data/AdditionalDataCreatePage";
// import AdditionalDataEditPage from "@/pages/additional_data/AdditionalDataEditPage";
// import TeamUserViewPage from "@/features/settings/management/team_userViewPage";
// import UserManagementView from "@/features/settings/components/management/usermanagement/user_management_view";

// function GuestRoute() {
//   const { user, role, loading } = useAuthContext();
//   if (loading) return <div>Loading...</div>;
//   if (user) return <Navigate to={`/${role || "client"}/dashboard`} replace />;
//   return <Outlet />;
// }

// export default function AppRoutes() {
//   const { role, user } = useAuthContext();
//   const basePath = role || "client";

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<GuestRoute />}>
//           <Route path="/auth" element={<AuthLayout />}>
//             <Route path="login" element={<Login />} />
//             <Route path="register" element={<Register />} />
//             <Route path="reset-password" element={<ResetPassword />} />
//             <Route path="forgot-password" element={<ForgotPassword />} />
//             <Route path="confirm-password" element={<ConfirmPassword />} />
//           </Route>
//         </Route>

//         <Route
//           path="/"
//           element={
//             user ? (
//               <Navigate to={`/${basePath}/dashboard`} replace />
//             ) : (
//               <Navigate to="/auth/login" replace />
//             )
//           }
//         />

//         <Route
//           element={
//             <ProtectedRoute allowedRoles={["admin", "team_member", "client"]} />
//           }
//         >
//           <Route path="/:role" element={<AppLayout />}>
//             {/* Dashboard */}
//             <Route path="dashboard" element={<DashboardPage />} />

//             {/* Projects */}
//             <Route path="projects" element={<ProjectsPage />} />
//             <Route path="project/:id" element={<ProjectViewPage />} />

//             {/* Quotes */}
//             <Route path="quotes" element={<QuotesPage />} />
//             <Route path="quote/:id" element={<QuoteViewPage />} />

//             {/* Tickets */}
//             <Route path="tickets" element={<TicketsPage />} />
//             <Route path="ticket/:id" element={<TicketViewPage />} />

//             {/* Invoices */}
//             <Route path="invoices" element={<InvoicesPage />} />
//             <Route path="invoice/:id" element={<InvoiceViewPage />} />

//             {/* Clients */}
//             <Route path="clients" element={<ClientsPage />} />
//             <Route path="client/:id" element={<ClientViewPage />} />

//             {/* Payments */}
//             <Route path="payments" element={<PaymentsPage />} />
//             <Route path="payment/:id" element={<PaymentViewPage />} />

//             {/* Offers */}
//             <Route path="offers" element={<OffersPage />} />
//             <Route path="offer/:id" element={<OfferViewPage />} />

//             {/* Services */}
//             <Route path="services" element={<ServicesPage />} />
//             <Route path="service/:id" element={<ServiceViewPage />} />

//             {/* logs */}
//             <Route path="logs" element={<ActivityLogsPage />} />
//             <Route path="log/:id" element={<ActivityLogViewPage />} />

//             {/* logs */}
//             {/* <Route path="settings" element={<SettingsPage />} /> */}
//             <Route path="settings/:id" element={<SettingsPage />} />
//             <Route
//               path="settings/team_management/:id"
//               element={<TeamUserViewPage />}
//             />
//             <Route
//               path="settings/users_management/:id"
//               element={<UserManagementView />}
//             />
//             {/* calendar */}
//             <Route path="calendar" element={<CalendarPage />} />
//             {/* tasks */}
//             <Route path="project/:id/tasks" element={<TasksPage />} />
//             <Route path="project/:id/task/new" element={<TaskCreatePage />} />
//             <Route
//               path="project/:id/task/:id/edit"
//               element={<TaskEditPage />}
//             />

//             {/* additional data */}
//             <Route
//               path="project/:id/additional-data"
//               element={<AdditionalDataViewPage />}
//             />
//             <Route
//               path="project/:id/additional-data/new"
//               element={<AdditionalDataCreatePage />}
//             />
//             <Route
//               path="project/:id/additional-data/edit"
//               element={<AdditionalDataEditPage />}
//             />

//             {/* Admin-only create/edit routes */}
//             <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//               {/* Projects */}
//               <Route path="project/new" element={<ProjectCreatePage />} />
//               <Route path="project/:id/edit" element={<ProjectEditPage />} />
//               <Route path="project/:id/tasks" element={<TasksPage />} />
//               <Route path="project/:id/task/new" element={<TaskCreatePage />} />
//               <Route
//                 path="project/:id/task/:id/edit"
//                 element={<TaskEditPage />}
//               />

//               {/* Quotes */}
//               <Route path="quote/new" element={<QuoteCreatePage />} />
//               <Route path="quote/:id/edit" element={<QuoteEditPage />} />

//               {/* Tickets */}
//               <Route path="ticket/new" element={<TicketCreatePage />} />
//               <Route path="ticket/:id/edit" element={<TicketEditPage />} />

//               {/* Invoices */}
//               <Route path="invoice/new" element={<InvoiceCreatePage />} />
//               <Route path="invoice/:id/edit" element={<InvoiceEditPage />} />

//               {/* Offers */}
//               <Route path="offer/new" element={<OfferCreatePage />} />
//               <Route path="offer/:id/edit" element={<OfferEditPage />} />

//               {/* Services */}
//               <Route path="service/new" element={<ServiceCreatePage />} />
//               <Route path="service/:id/edit" element={<ServiceEditPage />} />
//               {/* Clients */}
//               <Route path="client/new" element={<ClientCreatePage />} />
//               <Route path="client/:id/edit" element={<ClientEditPage />} />

//               {/* Additional Data */}
//               <Route
//                 path="project/:id/additional-data/new"
//                 element={<AdditionalDataCreatePage />}
//               />
//               <Route
//                 path="project/:id/additional-data/edit"
//                 element={<AdditionalDataEditPage />}
//               />
//             </Route>
//           </Route>
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }




import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Lazy load auth pages
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const ConfirmPassword = lazy(() => import("../pages/Auth/ConfirmPassword"));

// Lazy load dashboard
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));

// Lazy load project pages
const ProjectsPage = lazy(() => import("../pages/projects/ProjectsPage"));
const ProjectViewPage = lazy(() => import("../pages/projects/ProjectViewPage"));
const ProjectEditPage = lazy(() => import("../pages/projects/ProjectEditPage"));
const ProjectCreatePage = lazy(() => import("../pages/projects/ProjectCreatePage"));

// Lazy load quote pages
const QuotesPage = lazy(() => import("../pages/quotes/QuotesPage"));
const QuoteViewPage = lazy(() => import("../pages/quotes/QuoteViewPage"));
const QuoteCreatePage = lazy(() => import("../pages/quotes/QuoteCreatePage"));
const QuoteEditPage = lazy(() => import("../pages/quotes/QuoteEditPage"));

// Lazy load ticket pages
const TicketsPage = lazy(() => import("../pages/tickets/TicketsPage"));
const TicketViewPage = lazy(() => import("../pages/tickets/TicketViewPage"));
const TicketCreatePage = lazy(() => import("../pages/tickets/TicketCreatePage"));
const TicketEditPage = lazy(() => import("../pages/tickets/TicketEditPage"));

// Lazy load invoice pages
const InvoicesPage = lazy(() => import("../pages/invoices/InvoicesPage"));
const InvoiceViewPage = lazy(() => import("../pages/invoices/InvoiceViewPage"));
const InvoiceCreatePage = lazy(() => import("../pages/invoices/InvoiceCreatePage"));
const InvoiceEditPage = lazy(() => import("../pages/invoices/InvoiceEditPage"));

// Lazy load service pages
const ServicesPage = lazy(() => import("../pages/services/ServicesPage"));
const ServiceViewPage = lazy(() => import("../pages/services/ServiceViewPage"));
const ServiceCreatePage = lazy(() => import("../pages/services/ServiceCreatePage"));
const ServiceEditPage = lazy(() => import("../pages/services/ServiceEditPage"));

// Lazy load client pages
const ClientsPage = lazy(() => import("../pages/clients/ClientsPage"));
const ClientCreatePage = lazy(() => import("../pages/clients/ClientCreatePage"));
const ClientEditPage = lazy(() => import("../pages/clients/ClientEditPage"));
const ClientViewPage = lazy(() => import("../pages/clients/ClientViewPage"));

// Lazy load payment pages
const PaymentsPage = lazy(() => import("../pages/payments/PaymentsPage"));
const PaymentViewPage = lazy(() => import("../pages/payments/PaymentViewPage"));

// Lazy load offer pages
const OffersPage = lazy(() => import("../pages/offers/OffersPage"));
const OfferViewPage = lazy(() => import("../pages/offers/OfferViewPage"));
const OfferCreatePage = lazy(() => import("../pages/offers/OfferCreatePage"));
const OfferEditPage = lazy(() => import("../pages/offers/OfferEditPage"));

// Lazy load activity log pages
const ActivityLogsPage = lazy(() => import("@/pages/activityLogs/ActivityLogsPage"));
const ActivityLogViewPage = lazy(() => import("@/pages/activityLogs/ActivityLogViewPage"));

// Lazy load other pages
const SettingsPage = lazy(() => import("@/pages/settings/settingsPage"));
const CalendarPage = lazy(() => import("@/pages/calendar/CalendarPage"));
const TasksPage = lazy(() => import("@/pages/tasks/tasksPage"));
const TaskCreatePage = lazy(() => import("@/pages/tasks/TaskCreatePage"));
const TaskEditPage = lazy(() => import("@/pages/tasks/TaskEditPage"));
const AdditionalDataViewPage = lazy(() => import("@/pages/additional_data/AdditionalDataViewPage"));
const AdditionalDataCreatePage = lazy(() => import("@/pages/additional_data/AdditionalDataCreatePage"));
const AdditionalDataEditPage = lazy(() => import("@/pages/additional_data/AdditionalDataEditPage"));
const TeamUserViewPage = lazy(() => import("@/features/settings/management/team_userViewPage"));
const UserManagementView = lazy(() => import("@/features/settings/components/management/usermanagement/user_management_view"));

import AuthLayout from "@/app/layout/AuthLayout";
import AppLayout from "@/app/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthContext } from "@/hooks/AuthContext";

function GuestRoute() {
  const { user, role, loading } = useAuthContext();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to={`/${role || "client"}/dashboard`} replace />;
  return <Outlet />;
}

export default function AppRoutes() {
  const { role, user } = useAuthContext();
  const basePath = role || "client";

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={
              <Suspense fallback={<div>Loading login...</div>}>
                <Login />
              </Suspense>
            } />
            <Route path="register" element={
              <Suspense fallback={<div>Loading register...</div>}>
                <Register />
              </Suspense>
            } />
            <Route path="reset-password" element={
              <Suspense fallback={<div>Loading reset password...</div>}>
                <ResetPassword />
              </Suspense>
            } />
            <Route path="forgot-password" element={
              <Suspense fallback={<div>Loading forgot password...</div>}>
                <ForgotPassword />
              </Suspense>
            } />
            <Route path="confirm-password" element={
              <Suspense fallback={<div>Loading confirm password...</div>}>
                <ConfirmPassword />
              </Suspense>
            } />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${basePath}/dashboard`} replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin", "team_member", "client"]} />
          }
        >
          <Route path="/:role" element={<AppLayout />}>
            {/* Dashboard */}
            <Route path="dashboard" element={
              <Suspense fallback={<div>Loading dashboard...</div>}>
                <DashboardPage />
              </Suspense>
            } />

            {/* Projects */}
            <Route path="projects" element={
              <Suspense fallback={<div>Loading projects...</div>}>
                <ProjectsPage />
              </Suspense>
            } />
            <Route path="project/:id" element={
              <Suspense fallback={<div>Loading project details...</div>}>
                <ProjectViewPage />
              </Suspense>
            } />

            {/* Quotes */}
            <Route path="quotes" element={
              <Suspense fallback={<div>Loading quotes...</div>}>
                <QuotesPage />
              </Suspense>
            } />
            <Route path="quote/:id" element={
              <Suspense fallback={<div>Loading quote details...</div>}>
                <QuoteViewPage />
              </Suspense>
            } />

            {/* Tickets */}
            <Route path="tickets" element={
              <Suspense fallback={<div>Loading tickets...</div>}>
                <TicketsPage />
              </Suspense>
            } />
            <Route path="ticket/:id" element={
              <Suspense fallback={<div>Loading ticket details...</div>}>
                <TicketViewPage />
              </Suspense>
            } />

            {/* Invoices */}
            <Route path="invoices" element={
              <Suspense fallback={<div>Loading invoices...</div>}>
                <InvoicesPage />
              </Suspense>
            } />
            <Route path="invoice/:id" element={
              <Suspense fallback={<div>Loading invoice details...</div>}>
                <InvoiceViewPage />
              </Suspense>
            } />

            {/* Clients */}
            <Route path="clients" element={
              <Suspense fallback={<div>Loading clients...</div>}>
                <ClientsPage />
              </Suspense>
            } />
            <Route path="client/:id" element={
              <Suspense fallback={<div>Loading client details...</div>}>
                <ClientViewPage />
              </Suspense>
            } />

            {/* Payments */}
            <Route path="payments" element={
              <Suspense fallback={<div>Loading payments...</div>}>
                <PaymentsPage />
              </Suspense>
            } />
            <Route path="payment/:id" element={
              <Suspense fallback={<div>Loading payment details...</div>}>
                <PaymentViewPage />
              </Suspense>
            } />

            {/* Offers */}
            <Route path="offers" element={
              <Suspense fallback={<div>Loading offers...</div>}>
                <OffersPage />
              </Suspense>
            } />
            <Route path="offer/:id" element={
              <Suspense fallback={<div>Loading offer details...</div>}>
                <OfferViewPage />
              </Suspense>
            } />

            {/* Services */}
            <Route path="services" element={
              <Suspense fallback={<div>Loading services...</div>}>
                <ServicesPage />
              </Suspense>
            } />
            <Route path="service/:id" element={
              <Suspense fallback={<div>Loading service details...</div>}>
                <ServiceViewPage />
              </Suspense>
            } />

            {/* logs */}
            <Route path="logs" element={
              <Suspense fallback={<div>Loading activity logs...</div>}>
                <ActivityLogsPage />
              </Suspense>
            } />
            <Route path="log/:id" element={
              <Suspense fallback={<div>Loading activity log details...</div>}>
                <ActivityLogViewPage />
              </Suspense>
            } />

            {/* logs */}
            {/* <Route path="settings" element={<SettingsPage />} /> */}
            <Route path="settings/:id" element={
              <Suspense fallback={<div>Loading settings...</div>}>
                <SettingsPage />
              </Suspense>
            } />
            <Route
              path="settings/team_management/:id"
              element={
                <Suspense fallback={<div>Loading team management...</div>}>
                  <TeamUserViewPage />
                </Suspense>
              }
            />
            <Route
              path="settings/users_management/:id"
              element={
                <Suspense fallback={<div>Loading user management...</div>}>
                  <UserManagementView />
                </Suspense>
              }
            />
            {/* calendar */}
            <Route path="calendar" element={
              <Suspense fallback={<div>Loading calendar...</div>}>
                <CalendarPage />
              </Suspense>
            } />
            {/* tasks */}
            <Route path="project/:id/tasks" element={
              <Suspense fallback={<div>Loading tasks...</div>}>
                <TasksPage />
              </Suspense>
            } />
            <Route path="project/:id/task/new" element={
              <Suspense fallback={<div>Loading task creation...</div>}>
                <TaskCreatePage />
              </Suspense>
            } />
            <Route
              path="project/:id/task/:id/edit"
              element={
                <Suspense fallback={<div>Loading task editor...</div>}>
                  <TaskEditPage />
                </Suspense>
              }
            />

            {/* additional data */}
            <Route
              path="project/:id/additional-data"
              element={
                <Suspense fallback={<div>Loading additional data...</div>}>
                  <AdditionalDataViewPage />
                </Suspense>
              }
            />
            <Route
              path="project/:id/additional-data/new"
              element={
                <Suspense fallback={<div>Loading additional data creation...</div>}>
                  <AdditionalDataCreatePage />
                </Suspense>
              }
            />
            <Route
              path="project/:id/additional-data/edit"
              element={
                <Suspense fallback={<div>Loading additional data editor...</div>}>
                  <AdditionalDataEditPage />
                </Suspense>
              }
            />

            {/* Admin-only create/edit routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              {/* Projects */}
              <Route path="project/new" element={
                <Suspense fallback={<div>Loading project creation...</div>}>
                  <ProjectCreatePage />
                </Suspense>
              } />
              <Route path="project/:id/edit" element={
                <Suspense fallback={<div>Loading project editor...</div>}>
                  <ProjectEditPage />
                </Suspense>
              } />
              <Route path="project/:id/tasks" element={
                <Suspense fallback={<div>Loading tasks...</div>}>
                  <TasksPage />
                </Suspense>
              } />
              <Route path="project/:id/task/new" element={
                <Suspense fallback={<div>Loading task creation...</div>}>
                  <TaskCreatePage />
                </Suspense>
              } />
              <Route
                path="project/:id/task/:id/edit"
                element={
                  <Suspense fallback={<div>Loading task editor...</div>}>
                    <TaskEditPage />
                  </Suspense>
                }
              />

              {/* Quotes */}
              <Route path="quote/new" element={
                <Suspense fallback={<div>Loading quote creation...</div>}>
                  <QuoteCreatePage />
                </Suspense>
              } />
              <Route path="quote/:id/edit" element={
                <Suspense fallback={<div>Loading quote editor...</div>}>
                  <QuoteEditPage />
                </Suspense>
              } />

              {/* Tickets */}
              <Route path="ticket/new" element={
                <Suspense fallback={<div>Loading ticket creation...</div>}>
                  <TicketCreatePage />
                </Suspense>
              } />
              <Route path="ticket/:id/edit" element={
                <Suspense fallback={<div>Loading ticket editor...</div>}>
                  <TicketEditPage />
                </Suspense>
              } />

              {/* Invoices */}
              <Route path="invoice/new" element={
                <Suspense fallback={<div>Loading invoice creation...</div>}>
                  <InvoiceCreatePage />
                </Suspense>
              } />
              <Route path="invoice/:id/edit" element={
                <Suspense fallback={<div>Loading invoice editor...</div>}>
                  <InvoiceEditPage />
                </Suspense>
              } />

              {/* Offers */}
              <Route path="offer/new" element={
                <Suspense fallback={<div>Loading offer creation...</div>}>
                  <OfferCreatePage />
                </Suspense>
              } />
              <Route path="offer/:id/edit" element={
                <Suspense fallback={<div>Loading offer editor...</div>}>
                  <OfferEditPage />
                </Suspense>
              } />

              {/* Services */}
              <Route path="service/new" element={
                <Suspense fallback={<div>Loading service creation...</div>}>
                  <ServiceCreatePage />
                </Suspense>
              } />
              <Route path="service/:id/edit" element={
                <Suspense fallback={<div>Loading service editor...</div>}>
                  <ServiceEditPage />
                </Suspense>
              } />
              {/* Clients */}
              <Route path="client/new" element={
                <Suspense fallback={<div>Loading client creation...</div>}>
                  <ClientCreatePage />
                </Suspense>
              } />
              <Route path="client/:id/edit" element={
                <Suspense fallback={<div>Loading client editor...</div>}>
                  <ClientEditPage />
                </Suspense>
              } />

              {/* Additional Data */}
              <Route
                path="project/:id/additional-data/new"
                element={
                  <Suspense fallback={<div>Loading additional data creation...</div>}>
                    <AdditionalDataCreatePage />
                  </Suspense>
                }
              />
              <Route
                path="project/:id/additional-data/edit"
                element={
                  <Suspense fallback={<div>Loading additional data editor...</div>}>
                    <AdditionalDataEditPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
