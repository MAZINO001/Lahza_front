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
  Package,
  PercentSquare,
  User,
  ReceiptCentIcon,
  Target,
  Calculator,
  Layers,
  Ticket,
  TicketCheckIcon,
  LifeBuoy,
  MessageSquareWarning,
  Server,
} from "lucide-react";
import { MessageCircle } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { Sidebar, SidebarContent, SidebarRail, useSidebar } from "./ui/sidebar";
import { useAuthContext } from "@/hooks/AuthContext";
export function AppSidebar(props) {
  const { role, logout } = useAuthContext();
  const sidebarData = {
    client: {
      navMain: [
        {
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
              title: "Projects",
              url: `/${role}/projects`,
              icon: BriefcaseIcon,
            },
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
          ],
        },
      ],
      navSecondary: [
        { title: "Tickets", url: `/${role}/tickets`, icon: IconInvoice },
        {
          title: "Contact Us",
          component: "contactWidget",
          icon: MessageCircle,
        },
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
              title: "Projects",
              url: `/${role}/projects`,
              icon: BriefcaseIcon,
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
          ],
        },
        {
          title: "Management",
          items: [
            { title: "Clients", url: `/${role}/clients`, icon: User },
            {
              title: "Plans",
              url: `/${role}/plans`,
              icon: Layers,
              children: [
                {
                  title: "Web Hosting",
                  url: `/${role}/plans/web-hosting`,
                  icon: Server,
                },
                { title: "SEO", url: `/${role}/plans/seo`, icon: Server },
                {
                  title: "Maintenance & Security",
                  url: `/${role}/plans/maintenance-security`,
                  icon: Server,
                },
                { title: "SAV", url: `/${role}/plans/sav`, icon: Server },
                { title: "SM", url: `/${role}/plans/sm`, icon: Server },
                {
                  title: "Automation",
                  url: `/${role}/plans/automation`,
                  icon: Server,
                },
              ],
            },
            { title: "Services", url: `/${role}/services`, icon: Package },
            { title: "Offers", url: `/${role}/offers`, icon: PercentSquare },
            {
              title: "Tickets",
              url: `/${role}/tickets`,
              icon: MessageSquareWarning,
            },
          ],
        },
        {
          title: "Personal",
          items: [
            { title: "Objectives", url: `/${role}/objectives`, icon: Target },
            {
              title: "Settings",
              url: `/${role}/settings/company_basics`,
              icon: IconSettings,
            },
          ],
        },
        {
          title: "Finance",
          items: [
            { title: "Expenses", url: `/${role}/expenses`, icon: DollarSign },
            { title: "Comptable", url: `/${role}/comptable`, icon: Calculator },
          ],
        },
      ],
      navSecondary: [
        { title: "System Logs", url: "/admin/logs", icon: IconInvoice },
        {
          title: "Contact Us",
          component: "contactWidget",
          icon: MessageCircle,
        },
      ],
    },
  };

  const roleData = sidebarData[role];

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
