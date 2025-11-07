import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  HomeIcon,
  FileTextIcon,
  SettingsIcon,
  UserIcon,
  BriefcaseIcon,
  DollarSignIcon,
  Ticket,
  DollarSign,
  PercentSquare,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { IconInvoice } from "@tabler/icons-react";

export default function SideBar() {
  const location = useLocation();

  const menuItems = [
    {
      to: "/client/dashboard",
      icon: <HomeIcon className="size-4" />,
      label: "Dashboard",
    },
    {
      to: "/client/projects",
      icon: <BriefcaseIcon className="size-4" />,
      label: "Projects",
    },
    {
      to: "/client/invoices",
      icon: <FileTextIcon className="size-4" />,
      label: "Invoices",
    },
    {
      to: "/client/quotes",
      icon: <DollarSignIcon className="size-4" />,
      label: "Quotes",
    },
    {
      to: "/client/payments",
      icon: <DollarSign className="size-4" />,
      label: "Payments",
    },
    {
      to: "/client/offers",
      icon: <PercentSquare className="size-4" />,
      label: "Offers",
    },
    {
      to: "/client/clients",
      icon: <PercentSquare className="size-4" />,
      label: "clients",
    },
  ];
  const isSettingsActive = location.pathname === "/client/settings";
  const isTicketsActive = location.pathname === "/client/tickets";
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarTrigger className="fixed bottom-4 left-4 w-5 h-5 z-50 md:hidden" />

      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="offcanvas"
        // className="bg-red-500"
      >
        {/* Main Menu */}
        <SidebarContent className="lg:mt-28 mt-4 px-2">
          <SidebarMenu className="flex flex-col gap-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.to;

              return (
                <SidebarMenuItem key={index} className="mb-2 lg:mb-4">
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-4 px-2 py-6 rounded-md transition-colors duration-100 ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary/70 text-primary hover:text-white"
                      }`}
                    >
                      {item.icon}
                      <span className="text-lg font-semibold">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="flex justify-center  py-2">
          <Link
            to="/client/Tickets"
            className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors duration-100 ${
              isTicketsActive
                ? "bg-primary text-white"
                : "hover:bg-primary/70  text-primary hover:text-white"
            }`}
          >
            <IconInvoice size={20} />
            <span className="text-lg font-semibold">Tickets</span>
          </Link>
          <Link
            to="/client/settings"
            className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors duration-100 ${
              isSettingsActive
                ? "bg-primary text-white"
                : "hover:bg-primary/70  text-primary hover:text-white"
            }`}
          >
            <SettingsIcon size={20} />
            <span className="text-lg font-semibold">Settings</span>
          </Link>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
