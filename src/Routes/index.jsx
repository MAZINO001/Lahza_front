import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import DashboardPage from "../pages/dashboard/DashboardPage";

import ProjectsPage from "../pages/projects/ProjectsPage";
import ProjectViewPage from "../pages/projects/ProjectViewPage";
import ProjectEditPage from "../pages/projects/ProjectEditPage";
import ProjectCreatePage from "../pages/projects/ProjectCreatePage";

import QuotesPage from "../pages/quotes/QuotesPage";
import QuoteViewPage from "../pages/quotes/QuoteViewPage";
import QuoteCreatePage from "../pages/quotes/QuoteCreatePage";
import QuoteEditPage from "../pages/quotes/QuoteEditPage";

import TicketsPage from "../pages/tickets/TicketsPage";
import TicketViewPage from "../pages/tickets/TicketViewPage";
import TicketCreatePage from "../pages/tickets/TicketCreatePage";
import TicketEditPage from "../pages/tickets/TicketEditPage";

import InvoicesPage from "../pages/invoices/InvoicesPage";
import InvoiceViewPage from "../pages/invoices/InvoiceViewPage";
import InvoiceCreatePage from "../pages/invoices/InvoiceCreatePage";
import InvoiceEditPage from "../pages/invoices/InvoiceEditPage";

import ServicesPage from "../pages/services/ServicesPage";
import ServiceViewPage from "../pages/services/ServiceViewPage";
import ServiceCreatePage from "../pages/services/ServiceCreatePage";
import ServiceEditPage from "../pages/services/ServiceEditPage";

import ClientsPage from "../pages/clients/ClientsPage";
import ClientCreatePage from "../pages/clients/ClientCreatePage";
import ClientEditPage from "../pages/clients/ClientEditPage";
import ClientViewPage from "../pages/clients/ClientViewPage";

import PaymentsPage from "../pages/payments/PaymentsPage";
import PaymentViewPage from "../pages/payments/PaymentViewPage";
import PaymentCreatePage from "../pages/payments/PaymentCreatePage";
import PaymentEditPage from "../pages/payments/PaymentEditPage";

import OffersPage from "../pages/offers/OffersPage";
import OfferViewPage from "../pages/offers/OfferViewPage";
import OfferCreatePage from "../pages/offers/OfferCreatePage";
import OfferEditPage from "../pages/offers/OfferEditPage";

import ActivityLogsPage from "@/pages/activityLogs/ActivityLogsPage";
import ActivityLogViewPage from "@/pages/activityLogs/ActivityLogViewPage";

import SettingsPage from "@/pages/settings/settingsPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import TasksPage from "@/pages/tasks/tasksPage";

import AuthLayout from "@/app/layout/AuthLayout";
import AppLayout from "@/app/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthContext } from "@/hooks/AuthContext";
import TaskCreatePage from "@/pages/tasks/TaskCreatePage";
import TaskEditPage from "@/pages/tasks/TaskEditPage";
import AdditionalDataViewPage from "@/pages/additional_data/AdditionalDataViewPage";
import AdditionalDataCreatePage from "@/pages/additional_data/AdditionalDataCreatePage";
import AdditionalDataEditPage from "@/pages/additional_data/AdditionalDataEditPage";

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
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
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
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Projects */}
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="project/:id" element={<ProjectViewPage />} />

            {/* Quotes */}
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="quote/:id" element={<QuoteViewPage />} />

            {/* Tickets */}
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="ticket/:id" element={<TicketViewPage />} />

            {/* Invoices */}
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoice/:id" element={<InvoiceViewPage />} />

            {/* Clients */}
            <Route path="clients" element={<ClientsPage />} />
            <Route path="client/:id" element={<ClientViewPage />} />

            {/* Payments */}
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="payment/:id" element={<PaymentViewPage />} />

            {/* Offers */}
            <Route path="offers" element={<OffersPage />} />
            <Route path="offer/:id" element={<OfferViewPage />} />

            {/* Services */}
            <Route path="services" element={<ServicesPage />} />
            <Route path="service/:id" element={<ServiceViewPage />} />

            {/* logs */}
            <Route path="logs" element={<ActivityLogsPage />} />
            <Route path="log/:id" element={<ActivityLogViewPage />} />

            {/* logs */}
            <Route path="settings" element={<SettingsPage />} />
            {/* calendar */}
            <Route path="calendar" element={<CalendarPage />} />
            {/* tasks */}
            <Route path="project/:id/tasks" element={<TasksPage />} />
            <Route
              path="project/:id/task/new"
              element={<TaskCreatePage />}
            />
            <Route
              path="project/:id/task/:id/edit"
              element={<TaskEditPage />}
            />

            {/* additional data */}
            <Route path="project/:id/additional-data" element={<AdditionalDataViewPage />} />
            <Route
              path="project/:id/additional-data/new"
              element={<AdditionalDataCreatePage />}
            />
            <Route
              path="project/:id/additional-data/edit"
              element={<AdditionalDataEditPage />}
            />

            {/* Admin-only create/edit routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              {/* Projects */}
              <Route path="project/new" element={<ProjectCreatePage />} />
              <Route path="project/:id/edit" element={<ProjectEditPage />} />
              <Route path="project/:id/tasks" element={<TasksPage />} />
              <Route
                path="project/:id/task/new"
                element={<TaskCreatePage />}
              />
              <Route
                path="project/:id/task/:id/edit"
                element={<TaskEditPage />}
              />

              {/* Quotes */}
              <Route path="quote/new" element={<QuoteCreatePage />} />
              <Route path="quote/:id/edit" element={<QuoteEditPage />} />

              {/* Tickets */}
              <Route path="ticket/new" element={<TicketCreatePage />} />
              <Route path="ticket/:id/edit" element={<TicketEditPage />} />

              {/* Invoices */}
              <Route path="invoice/new" element={<InvoiceCreatePage />} />
              <Route path="invoice/:id/edit" element={<InvoiceEditPage />} />

              {/* Payments */}
              <Route path="payment/new" element={<PaymentCreatePage />} />
              <Route path="payment/:id/edit" element={<PaymentEditPage />} />

              {/* Offers */}
              <Route path="offer/new" element={<OfferCreatePage />} />
              <Route path="offer/:id/edit" element={<OfferEditPage />} />

              {/* Services */}
              <Route path="service/new" element={<ServiceCreatePage />} />
              <Route path="service/:id/edit" element={<ServiceEditPage />} />
              {/* Clients */}
              <Route path="client/new" element={<ClientCreatePage />} />
              <Route path="client/:id/edit" element={<ClientEditPage />} />

              {/* Additional Data */}
              <Route path="project/:id/additional-data/new" element={<AdditionalDataCreatePage />} />
              <Route path="project/:id/additional-data/edit" element={<AdditionalDataEditPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
