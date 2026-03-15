/* eslint-disable react-hooks/exhaustive-deps */
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import { useSidebar } from "@/components/ui/sidebar";
// import { Link, useLocation } from "react-router-dom";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import { useState } from "react";

// export function NavMain({ items }) {
//   const location = useLocation();
//   const { state } = useSidebar();
//   const [expandedItems, setExpandedItems] = useState(new Set());

//   const isActive = (itemUrl) => {
//     const pathname = location.pathname;

//     if (pathname.startsWith(itemUrl)) {
//       return true;
//     }

//     if (itemUrl.endsWith("s")) {
//       const singular = itemUrl.slice(0, -1);
//       if (pathname.startsWith(singular)) {
//         return true;
//       }
//     } else {
//       const plural = itemUrl + "s";
//       if (pathname.startsWith(plural)) {
//         return true;
//       }
//     }

//     return false;
//   };

//   const toggleExpanded = (itemUrl) => {
//     setExpandedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemUrl)) {
//         newSet.delete(itemUrl);
//       } else {
//         newSet.add(itemUrl);
//       }
//       return newSet;
//     });
//   };
//   return (
//     <div className="flex flex-col">
//       {/* Logo */}
//       <SidebarGroup>
//         <SidebarGroupContent className="flex flex-col">
//           <SidebarMenu>
//             <SidebarMenuItem className="flex items-center mb-2">
//               <Link
//                 to="/client/dashboard"
//                 className="flex items-center justify-center"
//               >
//                 <img
//                   src={
//                     state === "collapsed"
//                       ? "/images/alt_logo.png"
//                       : "/images/logo.png"
//                   }
//                   alt="lahza agency logo"
//                   className={
//                     state === "collapsed"
//                       ? "w-auto h-6 md:h-8"
//                       : "w-auto h-5 md:h-8 lg:h-11 "
//                   }
//                 />
//               </Link>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarGroupContent>
//       </SidebarGroup>

//       {/* Navigation Sections */}
//       {items.map((section) => (
//         <SidebarGroup key={section.title}>
//           {state !== "collapsed" && (
//             <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//               {section.title}
//             </SidebarGroupLabel>
//           )}
//           <SidebarGroupContent className="flex flex-col ">
//             <SidebarMenu>
//               {section.items.map((item) => (
//                 <SidebarMenuItem key={item.url}>
//                   {item.children ? (
//                     <SidebarMenuButton
//                       tooltip={item.title}
//                       className={`
//                         flex items-center rounded-sm
//                         cursor-pointer
//                         hover:text-primary/80
//                         text-[13px]
//                         ${
//                           isActive(item.url)
//                             ? "bg-primary/20 text-primary/80"
//                             : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
//                         }
//                         `}
//                       onClick={() => toggleExpanded(item.url)}
//                     >
//                       <span>
//                         {item.icon && <item.icon className="w-3.5 h-3.5" />}
//                       </span>
//                       <span className="flex-1">{item.title}</span>
//                       <span className="ml-auto">
//                         {expandedItems.has(item.url) ? (
//                           <ChevronDown className="w-3 h-3" />
//                         ) : (
//                           <ChevronRight className="w-3 h-3" />
//                         )}
//                       </span>
//                     </SidebarMenuButton>
//                   ) : (
//                     <Link to={item.url} className="">
//                       <SidebarMenuButton
//                         tooltip={item.title}
//                         className={`
//                           flex items-center rounded-sm
//                           cursor-pointer
//                           hover:text-primary/80
//                           text-[13px]

//                           ${
//                             isActive(item.url)
//                               ? "bg-primary/20 text-primary/80"
//                               : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
//                           }
//                           `}
//                       >
//                         <span>
//                           {item.icon && <item.icon className="w-3.5 h-3.5" />}
//                         </span>
//                         <span>{item.title}</span>
//                       </SidebarMenuButton>
//                     </Link>
//                   )}
//                   {item.children &&
//                     expandedItems.has(item.url) &&
//                     state !== "collapsed" && (
//                       <SidebarMenuSub>
//                         {item.children.map((child) => (
//                           <SidebarMenuSubItem key={child.url}>
//                             <SidebarMenuSubButton
//                               asChild
//                               className={`
//                               flex items-center rounded-sm
//                               cursor-pointer
//                               hover:text-primary/80
//                               text-[12px]
//                               py-1

//                               ${
//                                 isActive(child.url)
//                                   ? "bg-primary/20 text-primary/80"
//                                   : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
//                               }
//                               `}
//                             >
//                               <Link to={child.url}>
//                                 <span>
//                                   {child.icon && (
//                                     <child.icon className="w-3.5 h-3.5" />
//                                   )}
//                                 </span>
//                                 <span>{child.title}</span>
//                               </Link>
//                             </SidebarMenuSubButton>
//                           </SidebarMenuSubItem>
//                         ))}
//                       </SidebarMenuSub>
//                     )}
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       ))}
//     </div>
//   );
// }

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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { isActive } from "./sidebar-utils";

export function NavMain({ items }) {
  const location = useLocation();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const pathname = location.pathname;

  // Auto-expand any parent whose child matches the current route
  const [expandedItems, setExpandedItems] = useState(() => {
    const initial = new Set();
    items.forEach((section) =>
      section.items?.forEach((item) => {
        if (item.children?.some((c) => isActive(pathname, c.url))) {
          initial.add(item.url);
        }
      }),
    );
    return initial;
  });

  // Re-evaluate when route changes
  useEffect(() => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      items.forEach((section) =>
        section.items?.forEach((item) => {
          if (item.children?.some((c) => isActive(pathname, c.url))) {
            next.add(item.url);
          }
        }),
      );
      return next;
    });
  }, [pathname]);

  const toggleExpanded = (url) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(url) ? next.delete(url) : next.add(url);
      return next;
    });
  };

  const isCollapsed = state === "collapsed";

  return (
    <div className="flex flex-col">
      {/* ── Logo + mobile close button ─────────────────────────── */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center justify-between mb-2 px-1">
              <Link to="/client/dashboard" className="flex items-center">
                <img
                  src={
                    isCollapsed ? "/images/alt_logo.png" : "/images/logo.png"
                  }
                  alt="lahza agency logo"
                  className={
                    isCollapsed
                      ? "w-auto h-6 md:h-8"
                      : "w-auto h-5 md:h-8 lg:h-11"
                  }
                />
              </Link>

              {/* Close button — always visible on mobile, hidden on desktop */}
              {isMobile && (
                <SidebarTrigger
                  className="ml-auto p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close sidebar"
                />
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* ── Navigation sections ─────────────────────────────────── */}
      {items.map((section, sIdx) => (
        <SidebarGroup key={section.title ?? sIdx}>
          {/* Section label — only when sidebar is expanded */}
          {!isCollapsed && section.title && (
            <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest px-2 mb-0.5">
              {section.title}
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const active = isActive(pathname, item.url);
                const isExpanded = expandedItems.has(item.url);
                const hasKids = Boolean(item.children?.length);

                return (
                  <SidebarMenuItem key={item.url ?? item.title}>
                    {/* ── Parent item with children ── */}
                    {hasKids ? (
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => toggleExpanded(item.url)}
                        className={`
                          flex items-center gap-2 rounded-md px-2 py-1.5
                          text-[13px] font-medium cursor-pointer
                          transition-colors duration-150
                          ${
                            active
                              ? "bg-primary/15 text-primary"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground"
                          }
                        `}
                      >
                        {item.icon && (
                          <item.icon className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="flex-1 truncate">{item.title}</span>
                        <ChevronDown
                          className={`
                            w-3 h-3 shrink-0 transition-transform duration-200
                            ${isExpanded ? "rotate-0" : "-rotate-90"}
                          `}
                        />
                      </SidebarMenuButton>
                    ) : (
                      /* ── Leaf item ── */
                      <Link to={item.url}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={`
                            flex items-center gap-2 rounded-md px-2 py-1.5
                            text-[13px] font-medium cursor-pointer
                            transition-colors duration-150
                            ${
                              active
                                ? "bg-primary/15 text-primary"
                                : "text-foreground/80 hover:bg-muted hover:text-foreground"
                            }
                          `}
                        >
                          {item.icon && (
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate">{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    )}

                    {/* ── Children (sub-menu) ── */}
                    {hasKids && isExpanded && !isCollapsed && (
                      <SidebarMenuSub className="ml-3 border-l border-border/50 pl-2 mt-0.5">
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.url}>
                            <SidebarMenuSubButton
                              asChild
                              className={`
                                flex items-center gap-2 rounded-md px-2 py-1
                                text-[12px] cursor-pointer
                                transition-colors duration-150
                                ${
                                  isActive(pathname, child.url)
                                    ? "bg-primary/15 text-primary font-medium"
                                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                                }
                              `}
                            >
                              <Link to={child.url}>
                                {child.icon && (
                                  <child.icon className="w-3 h-3 shrink-0" />
                                )}
                                <span className="truncate">{child.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
