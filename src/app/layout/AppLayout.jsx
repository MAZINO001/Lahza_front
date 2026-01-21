import { Outlet } from "react-router-dom";
import Header from "@/Components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AppSidebar } from "../../Components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../Components/ui/sidebar";
import { LoadingProvider } from "@/hooks/LoadingContext";
import ContactWidget from "../ContactWidget";
import BreadcrumbsWrapper from "@/components/common/Breadcrumbs";

export default function AppLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 44)",
        "--header-height": "calc(var(--spacing) * 4)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="w-full border-b">
            <Header />
          </header>
          <main className="flex-1">
            <LoadingProvider>
              <div className="bg-muted-foreground/7 ">
                <BreadcrumbsWrapper />
                <Outlet />
              </div>
            </LoadingProvider>
          </main>
          <Footer />
          <ContactWidget />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
