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
  Receipt,
  ReceiptCentIcon,
  Target,
  Calculator,
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
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
import { useAuthContext } from "@/hooks/AuthContext";
import { Button } from "./ui/button";
export function AppSidebar(props) {
  const { role, logout } = useAuthContext();
  const sidebarData = {
    client: {
      navMain: [
        {
          title: "Workspace",
          items: [
            {
              title: "Dashboard",
              url: `/${role}/dashboard`,
              icon: HomeIcon,
            },
            {
              title: "Calendar",
              url: `/${role}/calendar`,
              icon: Calendar1,
            },
            {
              title: "Invoices",
              url: `/${role}/invoices`,
              icon: IconFileInvoice,
            },
            { title: "Quotes", url: `/${role}/quotes`, icon: FileText },
            {
              title: "Payments",
              url: `/${role}/payments`,
              icon: DollarSign,
            },
            {
              title: "Receipt",
              url: `/${role}/receipt`,
              icon: ReceiptCentIcon,
            },
          ]
        },
        {
          title: "Management",
          items: [
            { title: "Projects", url: `/${role}/projects`, icon: BriefcaseIcon },
            { title: "Offers", url: `/${role}/offers`, icon: PercentSquare },
            { title: "Clients", url: `/${role}/clients`, icon: User },
            { title: "Plans", url: `/${role}/plans`, icon: Package },
          ]
        },
        {
          title: "Personal",
          items: [
            { title: "Objectives", url: `/${role}/objectives`, icon: Target },
            { title: "Settings", url: `/${role}/settings`, icon: IconSettings },
          ]
        },
        {
          title: "Finance",
          items: [
            { title: "Expenses", url: `/${role}/expenses`, icon: DollarSign },
            { title: "Comptable", url: `/${role}/comptable`, icon: Calculator },
          ]
        }
      ],
      navSecondary: [
        { title: "Tickets", url: `/${role}/tickets`, icon: IconInvoice },
        // {
        //   title: "Settings",
        //   url: `/${role}/settings/company_basics`,
        //   icon: IconSettings,
        // },
      ],
    },
    admin: {
      navMain: [
        {
          title: "Workspace",
          items: [
            {
              title: "Dashboard",
              url: `/${role}/dashboard`,
              icon: HomeIcon,
            },
            {
              title: "Calendar",
              url: `/${role}/calendar`,
              icon: Calendar1,
            },
            {
              title: "Invoices",
              url: `/${role}/invoices`,
              icon: IconFileInvoice,
            },
            { title: "Quotes", url: `/${role}/quotes`, icon: FileText },
            {
              title: "Payments",
              url: `/${role}/payments`,
              icon: DollarSign,
            },
            {
              title: "Receipt",
              url: `/${role}/receipt`,
              icon: ReceiptCentIcon,
            },
          ]
        },
        {
          title: "Management",
          items: [
            { title: "Projects", url: `/${role}/projects`, icon: BriefcaseIcon },
            { title: "Offers", url: `/${role}/offers`, icon: PercentSquare },
            { title: "Clients", url: `/${role}/clients`, icon: User },
            { title: "Services", url: `/${role}/services`, icon: Package },
            { title: "Plans", url: `/${role}/plans`, icon: Package },
          ]
        },
        {
          title: "Personal",
          items: [
            { title: "Objectives", url: `/${role}/objectives`, icon: Target },
            { title: "Settings", url: `/${role}/settings`, icon: IconSettings },
          ]
        },
        {
          title: "Finance",
          items: [
            { title: "Expenses", url: `/${role}/expenses`, icon: DollarSign },
            { title: "Comptable", url: `/${role}/comptable`, icon: Calculator },
          ]
        }
      ],
      navSecondary: [
        { title: "System Logs", url: "/admin/logs", icon: IconInvoice },
        // {
        //   title: "Settings",
        //   url: "/admin/settings/company_basics",
        //   icon: IconSettings,
        // },
      ],
    },
  };

  const roleData = sidebarData[role];
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} className="p-1 border-r">
      <SidebarRail />

      <SidebarContent>
        <NavMain items={roleData.navMain} />
        <NavSecondary items={roleData.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
