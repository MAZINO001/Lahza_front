"use client";

import { useAuthContext } from "@/hooks/AuthContext";
import { Building, Contact, Palette, Scale } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    section: "Agency Info",
    items: [
      { name: "Company Basics", icon: <Building className="w-5 h-5" /> },
      { name: "Branding & Assets", icon: <Palette className="w-5 h-5" /> },
      { name: "Contact & Address", icon: <Contact className="w-5 h-5" /> },
      { name: "Legal, Tax & Banking", icon: <Scale className="w-5 h-5" /> },
    ],
  },

  { section: "Preferences", items: ["notifications", "General", "Snippets"] },
  {
    section: "User Team Management",
    items: ["Profile", "General", "Snippets"],
  },
];

export default function SettingsSideBar() {
  const { role } = useAuthContext();
  const location = useLocation();

  // Get the current settings section from the URL
  const currentSection = location.pathname.split("/").pop();

  return (
    <aside className="w-64 shrink-0 border border-border rounded-lg h-screen overflow-auto">
      <div className="rounded-2xl bg-background backdrop-blur-sm ">
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Settings
          </h2>
          <nav className="space-y-4">
            {sidebarItems.map((group) => (
              <div key={group.section}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {group.section}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = currentSection === item.name;
                    return (
                      <Link
                        to={`/${role}/settings/${item.name}`}
                        key={item.name}
                      >
                        <div
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-700 hover:bg-gray-100"
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
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
