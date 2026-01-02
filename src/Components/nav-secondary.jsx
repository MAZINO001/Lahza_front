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
    hover:text-primary/80
    ${
      location.pathname === item.url
        ? "bg-primary/20 text-primary/80"
        : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
    }
  `}
            >
              <SidebarMenuButton
                asChild
                className={`${
                  location.pathname === item.url
                    ? "text-primary/80"
                    : "text-foreground"
                } hover:bg-transparent 
                  hover:text-primary/80
                  
                  cursor-pointer`}
              >
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
