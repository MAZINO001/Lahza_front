import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <Outlet />
    </div>
  );
}
