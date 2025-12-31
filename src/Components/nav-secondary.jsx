"use client";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavSecondary({ items, ...props }) {
  const location = useLocation();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              className={`
    flex items-center gap-3  py-2 rounded-lg text-[15px] font-medium
    transition-colors duration-200 cursor-pointer
    ${location.pathname === item.url
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
                }
  `}
            >
              <SidebarMenuButton asChild className="text-gray-700 hover:bg-transparent hover:text-gray-700">
                <Link to={item.url}>
                  <>
                    <span>
                      <item.icon className="w-5 h-5" />
                    </span>
                    <span>{item.title}</span>
                  </>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
