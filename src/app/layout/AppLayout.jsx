import { Outlet } from "react-router-dom";
import Header from "@/Components/layout/Header";
import { AppSidebar } from "../../Components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../Components/ui/sidebar";
import { LoadingProvider } from "@/hooks/LoadingContext";

export default function AppLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 60)",
        "--header-height": "calc(var(--spacing) * 6)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="w-full border-b">
            <Header />
          </header>
          <main>
            <LoadingProvider>
              <div className="mx-auto max-w-7xl">
                <Outlet />
              </div>
            </LoadingProvider>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
