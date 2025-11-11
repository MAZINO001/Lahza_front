import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ConfirmPassword from "../pages/Auth/ConfirmPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

import NotFound from "../pages/extras/NotFound ";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/settings/Settings";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";
import Quotes from "../pages/quotes/Quotes";
import QuoteDetails from "../pages/quotes/QuoteDetails";
import Tickets from "../pages/Tickets/Tickets";
import Invoices from "../pages/invoices/Invoices";
import Payments from "../pages/Payments/Payments";
import Offers from "../pages/Offers/Offers";
import Clients from "../pages/clients/Clients";
import ClientDetails from "../pages/clients/clientDetails";
import AddQuote from "../pages/quotes/addNewQuote";
import InvoiceDetails from "@/pages/invoices/invoiceDetails";
import AddNewInvoice from "@/pages/invoices/addNewInvoice";

import AuthLayout from "../pages/layouts/AuthLayout";
import AppLayout from "../pages/layouts/AppLayout";

import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

function GuestRoute() {
  const { user, role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to={`/${role || "client"}/dashboard`} replace />;
  return <Outlet />;
}

export default function AppRoutes() {
  const { role, user } = useAuth();
  const basePath = role || "client";

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="confirmPassword" element={<ConfirmPassword />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route path="resetPassword" element={<ResetPassword />} />
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="payments" element={<Payments />} />
            <Route path="offers" element={<Offers />} />
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="quotes/new" element={<AddQuote />} />
              <Route path="quotes/:id" element={<QuoteDetails />} />
              <Route path="invoices/new" element={<AddNewInvoice />} />
              <Route path="invoices/:id" element={<InvoiceDetails />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientDetails />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
