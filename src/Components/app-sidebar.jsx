import * as React from "react";
import {
  IconFileInvoice,
  IconInvoice,
  IconSettings,
} from "@tabler/icons-react";
import {
  BriefcaseIcon,
  Calendar1,
  DollarSign,
  FileText,
  HomeIcon,
  LogOutIcon,
  Package,
  PercentSquare,
  User,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useAuthContext } from "@/hooks/AuthContext";
import { Button } from "./ui/button";
import { Outline } from "react-pdf";
export function AppSidebar(props) {
  const { role, logout } = useAuthContext();
  const currentRole = role || "client";

  const sidebarData = {
    client: {
      navMain: [
        {
          title: "Dashboard",
          url: `/${currentRole}/dashboard`,
          icon: HomeIcon,
        },
        {
          title: "Projects",
          url: `/${currentRole}/projects`,
          icon: BriefcaseIcon,
        },
        {
          title: "Invoices",
          url: `/${currentRole}/invoices`,
          icon: IconFileInvoice,
        },
        { title: "Quotes", url: `/${currentRole}/quotes`, icon: FileText },
        {
          title: "Payments",
          url: `/${currentRole}/payments`,
          icon: DollarSign,
        },
        { title: "Offers", url: `/${currentRole}/offers`, icon: PercentSquare },
      ],
      navSecondary: [
        { title: "Tickets", url: `/${currentRole}/tickets`, icon: IconInvoice },
        {
          title: "Settings",
          url: `/${currentRole}/settings`,
          icon: IconSettings,
        },
      ],
    },
    admin: {
      navMain: [
        {
          title: "Dashboard",
          url: `/${currentRole}/dashboard`,
          icon: HomeIcon,
        },
        {
          title: "Calendar",
          url: `/${currentRole}/calendar`,
          icon: Calendar1
        },
        {
          title: "Projects",
          url: `/${currentRole}/projects`,
          icon: BriefcaseIcon,
        },
        {
          title: "Invoices",
          url: `/${currentRole}/invoices`,
          icon: IconFileInvoice,
        },
        { title: "Quotes", url: `/${currentRole}/quotes`, icon: FileText },
        {
          title: "Payments",
          url: `/${currentRole}/payments`,
          icon: DollarSign,
        },
        { title: "Offers", url: `/${currentRole}/offers`, icon: PercentSquare },
        { title: "Clients", url: `/${currentRole}/clients`, icon: User },
        { title: "Services", url: `/${currentRole}/services`, icon: Package },
      ],
      navSecondary: [
        { title: "System Logs", url: "/admin/logs", icon: IconInvoice },
        { title: "Settings", url: "/admin/settings", icon: IconSettings },
      ],
    },
  };

  const roleData = sidebarData[currentRole];

  return (
    <Sidebar collapsible="offcanvas" {...props} className="p-0 border-r">
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="font-semibold text-lg px-2 py-1">My App</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}

      <SidebarContent>
        <NavMain items={roleData.navMain} />
        <NavSecondary items={roleData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="Outline"
          onClick={() => logout()}
          className=" cursor-pointer flex items-center justify-center gap-2 text-red text-md"
        >
          <LogOutIcon />
          LogOut
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
