import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in → kick to login
  if (!user) return <Navigate to="/auth/login" replace />;

  // Role mismatch → redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
}
