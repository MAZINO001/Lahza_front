import { useAuthContext } from "@/hooks/AuthContext";
import {
  AwardIcon,
  Bell,
  Building,
  Contact,
  FileQuestion,
  FolderKanban,
  Lock,
  MessageSquare,
  Palette,
  Scale,
  Ticket,
  User,
  CreditCard,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    section: "Agency Info",
    items: [
      {
        name: "Company Basics",
        value: "company_basics",
        icon: <Building className="w-4 h-4" />,
      },
      {
        name: "Branding & Assets",
        value: "branding_assets",
        icon: <Palette className="w-4 h-4" />,
      },
      {
        name: "Contact & Address",
        value: "contact_address",
        icon: <Contact className="w-4 h-4" />,
      },
      {
        name: "Legal, Tax & Banking",
        value: "legal_tax_banking",
        icon: <Scale className="w-4 h-4" />,
      },
      {
        name: "Certifications",
        value: "certifications",
        icon: <AwardIcon className="w-4 h-4" />,
      },
    ],
  },

  {
    section: "Preferences",
    items: [
      {
        name: "Notifications",
        value: "notifications",
        icon: <Bell className="w-4 h-4" />,
      },
      {
        name: "General",
        value: "preferences",
        icon: <Palette className="w-4 h-4" />,
      },
      {
        name: "Security",
        value: "security",
        icon: <Lock className="w-4 h-4" />,
      },
    ],
  },

  {
    section: "Management",
    items: [
      {
        name: "Team Management",
        value: "team_management",
        icon: <Building className="w-4 h-4" />,
      },
      {
        name: "Projects Management",
        value: "projects_management",
        icon: <FolderKanban className="w-4 h-4" />,
      },
      {
        name: "Users Management",
        value: "users_management",
        icon: <User className="w-4 h-4" />,
      },
      {
        name: "Plans Management",
        value: "plans_management",
        icon: <CreditCard className="w-4 h-4" />,
      },
    ],
  },
];

export default function SettingsSideBar() {
  const { role } = useAuthContext();
  const location = useLocation();

  // Get the current settings section from the URL
  const currentSection = location.pathname.split("/").pop() || "company_basics";
  return (
    <aside className="w-60 shrink-0 border border-border rounded-lg h-screen overflow-auto bg-background ">
      <div className="bg-background backdrop-blur-sm ">
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Settings
          </h2>
          <nav className="space-y-4">
            {sidebarItems.map((group) => {
              // Hide entire Management section from non-admin users
              if (group.section === "Management" && role !== "admin") {
                return null;
              }

              return (
                <div key={group.section}>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground ">
                    {group.section}
                  </p>
                  <ul className="space-y-2 ">
                    {group.items.map((item) => {
                      // Hide branding & assets from non-admin users
                      if (
                        item.value === "branding_assets" &&
                        role !== "admin"
                      ) {
                        return null;
                      }

                      const isActive = currentSection === item.value;
                      return (
                        <Link
                          to={`/${role}/settings/${item.value}`}
                          key={item.value}
                        >
                          <div
                            className={`w-full text-left px-2 py-2 rounded-lg text-sm transition-colors mb-1 ${
                              isActive
                                ? "bg-primary/20 text-primary/80"
                                : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
                            }`}
                          >
                            <span className="flex gap-2">
                              {item.icon}
                              {item.name}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
