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
const EmailVerification = lazy(() => import("../pages/Auth/EmailVerification"));

// Lazy load dashboard
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));

// Lazy load project pages
const ProjectsPage = lazy(() => import("../pages/projects/ProjectsPage"));
const ProjectViewPage = lazy(() => import("../pages/projects/ProjectViewPage"));
const ProjectEditPage = lazy(
  () => import("../pages/projects/ProjectSettingsPage"),
);
const ProjectCreatePage = lazy(
  () => import("../pages/projects/ProjectCreatePage"),
);

// Lazy load quote pages
const QuotesPage = lazy(() => import("../pages/quotes/QuotesPage"));
const QuoteViewPage = lazy(() => import("../pages/quotes/QuoteViewPage"));
const QuoteCreatePage = lazy(() => import("../pages/quotes/QuoteCreatePage"));
const QuoteEditPage = lazy(() => import("../pages/quotes/QuoteEditPage"));

// Lazy load ticket pages
const TicketsPage = lazy(() => import("../pages/tickets/TicketsPage"));
const TicketCreatePage = lazy(
  () => import("../pages/tickets/TicketCreatePage"),
);
const TicketForm = lazy(
  () => import("../features/tickets/components/TicketForm"),
);
// Lazy load invoice pages
const InvoicesPage = lazy(() => import("../pages/invoices/InvoicesPage"));
const InvoiceViewPage = lazy(() => import("../pages/invoices/InvoiceViewPage"));
const InvoiceCreatePage = lazy(
  () => import("../pages/invoices/InvoiceCreatePage"),
);
const InvoiceEditPage = lazy(() => import("../pages/invoices/InvoiceEditPage"));

// Lazy load service pages
const ServicesPage = lazy(() => import("../pages/services/ServicesPage"));
const ServiceViewPage = lazy(() => import("../pages/services/ServiceViewPage"));
const ServiceCreatePage = lazy(
  () => import("../pages/services/ServiceCreatePage"),
);
const ServiceEditPage = lazy(() => import("../pages/services/ServiceEditPage"));

// Lazy load client pages
const ClientsPage = lazy(() => import("../pages/clients/ClientsPage"));
const ClientCreatePage = lazy(
  () => import("../pages/clients/ClientCreatePage"),
);
const ClientEditPage = lazy(() => import("../pages/clients/ClientEditPage"));
const ClientViewPage = lazy(() => import("../pages/clients/ClientViewPage"));

// Lazy load expense pages
const ExpensesPage = lazy(() => import("../pages/expenses/ExpensesPage"));
const ExpenseCreatePage = lazy(
  () => import("../pages/expenses/ExpenseCreatePage"),
);
const ExpenseEditPage = lazy(() => import("../pages/expenses/ExpenseEditPage"));
const ExpenseViewPage = lazy(() => import("../pages/expenses/ExpenseViewPage"));

// Lazy load payment pages
const PaymentsPage = lazy(() => import("../pages/payments/PaymentsPage"));
const PaymentViewPage = lazy(() => import("../pages/payments/PaymentViewPage"));

// Lazy load receipt pages
const ReceiptsPage = lazy(() => import("../pages/receipts/ReceiptsPage"));
const ReceiptViewPage = lazy(() => import("../pages/receipts/ReceiptViewPage"));
const ReceiptClientView = lazy(
  () => import("../pages/receipts/views/ReceiptClientView"),
);

// Lazy load offer pages
const OffersPage = lazy(() => import("../pages/offers/OffersPage"));
const OfferViewPage = lazy(() => import("../pages/offers/OfferViewPage"));
const OfferCreatePage = lazy(() => import("../pages/offers/OfferCreatePage"));
const OfferEditPage = lazy(() => import("../pages/offers/OfferEditPage"));

// Lazy load activity log pages
const ActivityLogsPage = lazy(
  () => import("@/pages/activityLogs/ActivityLogsPage"),
);
const ActivityLogViewPage = lazy(
  () => import("@/pages/activityLogs/ActivityLogViewPage"),
);

// Lazy load other pages
const SettingsPage = lazy(() => import("@/pages/settings/settingsPage"));
const CalendarPage = lazy(() => import("@/pages/calendar/CalendarPage"));
const TasksPage = lazy(() => import("@/pages/tasks/tasksPage"));
const TaskCreatePage = lazy(() => import("@/pages/tasks/TaskCreatePage"));
const TaskEditPage = lazy(() => import("@/pages/tasks/TaskEditPage"));
const AdditionalDataViewPage = lazy(
  () => import("@/pages/additional_data/AdditionalDataViewPage"),
);
const AdditionalDataCreatePage = lazy(
  () => import("@/pages/additional_data/AdditionalDataCreatePage"),
);
const AdditionalDataEditPage = lazy(
  () => import("@/pages/additional_data/AdditionalDataEditPage"),
);
const TeamUserViewPage = lazy(
  () => import("@/features/settings/team-management/TeamManagement"),
);
const UserManagementView = lazy(
  () => import("@/features/settings/user-management/views/UserManagementView"),
);
const UserManagementForm = lazy(
  () => import("@/features/settings/user-management/views/UserManagementForm"),
);
const ObjectivesPage = lazy(
  () => import("@/features/objectives/ObjectivesPage"),
);
const AdminTicketsPage = lazy(
  () => import("../pages/tickets/views/AdminTicketsPage"),
);
const TicketAdminView = lazy(
  () => import("../pages/tickets/views/TicketAdminView"),
);

// Lazy load profile page
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));

// Lazy load notifications page
const NotificationsPage = lazy(
  () => import("@/pages/notifications/NotificationsPage"),
);

// Lazy load plan pages
const PlansPage = lazy(() => import("../pages/plans"));
const WebHostingPage = lazy(() => import("../pages/plans/web-hosting"));
const SEOPage = lazy(() => import("../pages/plans/seo"));
const MaintenanceSecurityPage = lazy(() => import("../pages/plans/maintenance-security"));
const SAVPage = lazy(() => import("../pages/plans/sav"));
const SMPage = lazy(() => import("../pages/plans/sm"));
const AutomationPage = lazy(() => import("../pages/plans/automation"));

import AuthLayout from "@/app/layout/AuthLayout";
import AppLayout from "@/app/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthContext } from "@/hooks/AuthContext";
import ErrorBoundary from "./ErrorBoundary";
import ProjectSettingsPage from "@/pages/projects/ProjectSettingsPage";

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
      <ErrorBoundary>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/auth" element={<AuthLayout />}>
              <Route
                path="login"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading login...</div>}>
                      <Login />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="register"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading register...</div>}>
                      <Register />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="reset-password"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading reset password...</div>}>
                      <ResetPassword />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="forgot-password"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading forgot password...</div>}>
                      <ForgotPassword />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="confirm-password"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading confirm password...</div>}>
                      <ConfirmPassword />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="verify-email"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading email verification...</div>}>
                      <EmailVerification />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
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
              <ProtectedRoute
                allowedRoles={["admin", "team_member", "client"]}
              />
            }
          >
            <Route path="/:role" element={<AppLayout />}>
              {/* Dashboard */}
              <Route
                path="dashboard"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading dashboard...</div>}>
                      <DashboardPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Profile */}
              <Route
                path="profile"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading profile...</div>}>
                      <ProfilePage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Notifications */}
              <Route
                path="notifications"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading notifications...</div>}>
                      <NotificationsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Projects */}
              <Route
                path="projects"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading projects...</div>}>
                      <ProjectsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="project/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading project details...</div>}>
                      <ProjectViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Quotes */}
              <Route
                path="quotes"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading quotes...</div>}>
                      <QuotesPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="quote/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading quote details...</div>}>
                      <QuoteViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path="tickets"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading tickets...</div>}>
                      {role === "client" ? (
                        <TicketsPage />
                      ) : (
                        <AdminTicketsPage />
                      )}
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path="ticket/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading ticket details...</div>}>
                      {role === "admin" ? <TicketAdminView /> : <TicketsPage />}
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path="ticket/new"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading ticket creation...</div>}>
                      {role === "client" ? <TicketCreatePage /> : null}
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path="ticket/:id/edit"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading ticket edit...</div>}>
                      {role === "client" ? <TicketForm /> : null}
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Invoices */}
              <Route
                path="invoices"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading invoices...</div>}>
                      <InvoicesPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="invoice/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading invoice details...</div>}>
                      <InvoiceViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Clients */}
              <Route
                path="clients"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading clients...</div>}>
                      <ClientsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="client/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading client details...</div>}>
                      <ClientViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Expenses */}
              <Route
                path="expenses"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading expenses...</div>}>
                      <ExpensesPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="expense/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading expense details...</div>}>
                      <ExpenseViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Payments */}
              <Route
                path="payments"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading payments...</div>}>
                      <PaymentsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="payment/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading payment details...</div>}>
                      <PaymentViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Receipts - Both Admin and Client */}
              <Route
                path="receipt"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading receipts...</div>}>
                      <ReceiptsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="receipts"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading receipts...</div>}>
                      <ReceiptsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="receipt/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading receipt details...</div>}>
                      <ReceiptViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="receipts/views/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading receipt view...</div>}>
                      <ReceiptClientView />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Offers */}
              <Route
                path="offers"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading offers...</div>}>
                      <OffersPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="offer/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading offer details...</div>}>
                      <OfferViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Services */}
              <Route
                path="services"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading services...</div>}>
                      <ServicesPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="service/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading service details...</div>}>
                      <ServiceViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Plans */}
              <Route
                path="plans"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading plans...</div>}>
                      <PlansPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="plans/web-hosting"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading web hosting plans...</div>}>
                      <WebHostingPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="plans/seo"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading SEO plans...</div>}>
                      <SEOPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="plans/maintenance-security"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading maintenance & security plans...</div>}>
                      <MaintenanceSecurityPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="plans/sav"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading SAV plans...</div>}>
                      <SAVPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="plans/sm"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading social media plans...</div>}>
                      <SMPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="plans/automation"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading automation plans...</div>}>
                      <AutomationPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* logs */}
              <Route
                path="logs"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading activity logs...</div>}>
                      <ActivityLogsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="log/:id"
                element={
                  <ErrorBoundary>
                    <Suspense
                      fallback={<div>Loading activity log details...</div>}
                    >
                      <ActivityLogViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* settings */}
              <Route
                path="settings/:id"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading settings...</div>}>
                      <SettingsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Admin-only management routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route
                  path="objectives"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading objectives...</div>}>
                        <ObjectivesPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="settings/team_management/:id"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={<div>Loading team management...</div>}
                      >
                        <TeamUserViewPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="settings/users_management/:id"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={<div>Loading user management...</div>}
                      >
                        <UserManagementView />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="settings/users_management/new"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading user creation...</div>}>
                        <UserManagementForm />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="settings/users_management/edit/:id"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading user editing...</div>}>
                        <UserManagementForm />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>

              {/* calendar */}
              <Route
                path="calendar"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading calendar...</div>}>
                      <CalendarPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              {/* tasks */}
              <Route
                path="project/:id/tasks"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading tasks...</div>}>
                      <TasksPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="project/:id/task/new"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading task creation...</div>}>
                      <TaskCreatePage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="project/:id/task/:id/edit"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading task editor...</div>}>
                      <TaskEditPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* additional data */}
              <Route
                path="project/:id/additional-data"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading additional data...</div>}>
                      <AdditionalDataViewPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="project/:id/additional-data/new"
                element={
                  <ErrorBoundary>
                    <Suspense
                      fallback={<div>Loading additional data creation...</div>}
                    >
                      <AdditionalDataCreatePage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="project/:id/additional-data/edit"
                element={
                  <ErrorBoundary>
                    <Suspense
                      fallback={<div>Loading additional data editor...</div>}
                    >
                      <AdditionalDataEditPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              {/* Admin-only create/edit routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                {/* Projects */}
                <Route
                  path="project/new"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={<div>Loading project creation...</div>}
                      >
                        <ProjectCreatePage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="project/:id/settings"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading project editor...</div>}>
                        <ProjectSettingsPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                {/* Quotes */}
                <Route
                  path="quote/new"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading quote creation...</div>}>
                        <QuoteCreatePage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="quote/:id/edit"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading quote editor...</div>}>
                        <QuoteEditPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                {/* Invoices */}
                <Route
                  path="invoice/new"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={<div>Loading invoice creation...</div>}
                      >
                        <InvoiceCreatePage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="invoice/:id/edit"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading invoice editor...</div>}>
                        <InvoiceEditPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                {/* Offers */}
                <Route
                  path="offer/new"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading offer creation...</div>}>
                        <OfferCreatePage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="offer/:id/edit"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading offer editor...</div>}>
                        <OfferEditPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                {/* Services */}
                <Route
                  path="service/new"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={<div>Loading service creation...</div>}
                      >
                        <ServiceCreatePage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="service/:id/edit"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading service editor...</div>}>
                        <ServiceEditPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                {/* Clients */}
                <Route
                  path="client/new"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={<div>Loading client creation...</div>}
                      >
                        <ClientCreatePage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="client/:id/edit"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading client editor...</div>}>
                        <ClientEditPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                {/* Expenses */}
                <Route
                  path="expense/new"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={<div>Loading expense creation...</div>}
                      >
                        <ExpenseCreatePage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="expense/:id/edit"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<div>Loading expense editor...</div>}>
                        <ExpenseEditPage />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
