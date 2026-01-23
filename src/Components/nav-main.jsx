import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function NavMain({ items }) {
  const location = useLocation();
  const { state } = useSidebar();
  const [expandedItems, setExpandedItems] = useState(new Set());

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

  const toggleExpanded = (itemUrl) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemUrl)) {
        newSet.delete(itemUrl);
      } else {
        newSet.add(itemUrl);
      }
      return newSet;
    });
  };
  return (
    <div className="flex flex-col">
      {/* Logo */}
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center mb-2">
              <Link
                to="/client/dashboard"
                className="flex items-center justify-center"
              >
                <img
                  src={
                    state === "collapsed"
                      ? "/images/alt_logo.png"
                      : "/images/logo.png"
                  }
                  alt="lahza agency logo"
                  className={
                    state === "collapsed"
                      ? "w-auto h-6 md:h-8"
                      : "w-auto h-5 md:h-8 lg:h-11 "
                  }
                />
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Navigation Sections */}
      {items.map((section) => (
        <SidebarGroup key={section.title}>
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col ">
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  {item.children ? (
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`
                        flex items-center rounded-sm
                        cursor-pointer
                        hover:text-primary/80
                        text-[13px]
                        ${
                          isActive(item.url)
                            ? "bg-primary/20 text-primary/80"
                            : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
                        }
                        `}
                      onClick={() => toggleExpanded(item.url)}
                    >
                      <span>
                        {item.icon && <item.icon className="w-3.5 h-3.5" />}
                      </span>
                      <span className="flex-1">{item.title}</span>
                      <span className="ml-auto">
                        {expandedItems.has(item.url) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </span>
                    </SidebarMenuButton>
                  ) : (
                    <Link to={item.url} className="">
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`
                          flex items-center rounded-sm
                          cursor-pointer
                          hover:text-primary/80
                          text-[13px]
                       
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
                    </Link>
                  )}
                  {item.children &&
                    expandedItems.has(item.url) &&
                    state !== "collapsed" && (
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.url}>
                            <SidebarMenuSubButton
                              asChild
                              className={`
                              flex items-center rounded-sm
                              cursor-pointer
                              hover:text-primary/80
                              text-[12px]
                              py-1
                           
                              ${
                                isActive(child.url)
                                  ? "bg-primary/20 text-primary/80"
                                  : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
                              }
                              `}
                            >
                              <Link to={child.url}>
                                <span>
                                  {child.icon && (
                                    <child.icon className="w-3.5 h-3.5" />
                                  )}
                                </span>
                                <span>{child.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
