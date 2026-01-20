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

  const isActive = (itemUrl) => {
    const pathname = location.pathname;

    if (pathname.startsWith(itemUrl)) {
      return true;
    }

    if (itemUrl.endsWith("s")) {
      const singular = itemUrl.slice(0, -1);
      if (pathname.startsWith(singular)) {
        return true;
      }
    } else {
      const plural = itemUrl + "s";
      if (pathname.startsWith(plural)) {
        return true;
      }
    }

    return false;
  };
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} to={item.url}>
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`
            flex items-center gap-2 rounded-sm
            cursor-pointer
            hover:text-primary/80
               text-[12px]
               mb-2
            ${
              isActive(item.url)
                ? "bg-primary/20 text-primary/80"
                : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
            }
          `}
                >
                  <span>
                    {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  </span>
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
