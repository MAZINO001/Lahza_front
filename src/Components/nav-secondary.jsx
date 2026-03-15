// "use client";
// import * as React from "react";

// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { Link, useLocation } from "react-router-dom";
// import ContactWidget from "@/app/ContactWidget";

// export function NavSecondary({ items, ...props }) {
//   const location = useLocation();

//   const isActive = (itemUrl) => {
//     const { pathname } = location;

//     if (pathname.startsWith(itemUrl)) {
//       return true;
//     }

//     if (itemUrl?.endsWith("s")) {
//       const singular = itemUrl?.slice(0, -1);
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
//   return (
//     <SidebarGroup {...props}>
//       <SidebarGroupContent>
//         <SidebarMenu>
//           {items.map((item) => {
//             if (item.component === "contactWidget") {
//               return (
//                 <SidebarMenuItem key={item.title}>
//                   <div className="w-full px-1 mb-2">
//                     <ContactWidget variant="sidebar" />
//                   </div>
//                 </SidebarMenuItem>
//               );
//             }

//             return (
//               <Link key={item.title} to={item.url}>
//                 <SidebarMenuItem key={item.url}>
//                   <SidebarMenuButton
//                     tooltip={item.title}
//                     className={`
//                     flex items-center gap-2 rounded-sm
//                     cursor-pointer
//                     hover:text-primary/80
//                     text-[13px]
//                     mb-2
//                     ${
//                       isActive(item.url)
//                         ? "bg-primary/20 text-primary/80"
//                         : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
//                     }
//                     `}
//                   >
//                     <span>
//                       {item.icon && <item.icon className="w-3.5 h-3.5" />}
//                     </span>
//                     <span>{item.title}</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               </Link>
//             );
//           })}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }

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
import ContactWidget from "@/app/ContactWidget";
import { isActive } from "./sidebar-utils";

export function NavSecondary({ items, ...props }) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.component === "contactWidget") {
              return (
                <SidebarMenuItem key={item.title}>
                  <div className="w-full px-1 mb-2">
                    <ContactWidget variant="sidebar" />
                  </div>
                </SidebarMenuItem>
              );
            }

            const active = isActive(pathname, item.url);

            return (
              <SidebarMenuItem key={item.url}>
                <Link to={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`
                      flex items-center gap-2 rounded-md px-2 py-1.5
                      text-[13px] font-medium cursor-pointer mb-1
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
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
