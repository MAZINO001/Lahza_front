import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, role, loading } = useAuthContext();
  const safeRole = role || "client";
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/auth/login" replace />;

  const [, segRole] = location.pathname.split("/");
  const knownRoles = ["admin", "team_member", "client"];
  if (knownRoles.includes(segRole) && segRole !== role) {
    return <Navigate to={`/${safeRole}/dashboard`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${safeRole}/dashboard`} replace />;
  }

  return <Outlet />;
}
