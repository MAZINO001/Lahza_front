// import { Button } from "@/components/ui/button";
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { Link, useLocation } from "react-router-dom";

// export function NavMain({ items }) {
//   const location = useLocation();
//   return (
//     <SidebarGroup>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         <SidebarMenu>
//           <SidebarMenuItem className="flex items-center gap-2">
//             <Link to="/client/dashboard" className="flex items-center">
//               <img
//                 src="/images/logo.png"
//                 alt="lahza agency logo"
//                 className="w-auto h-9 md:h-12 lg:h-15"
//               />
//             </Link>
//           </SidebarMenuItem>
//         </SidebarMenu>
//         <SidebarMenu>
//           {items.map((item) => (
//             <Link
//               key={item.title}
//               to={item.url}
//               className={`
//             flex items-center gap-3 rounded-lg
//             cursor-pointer
//             hover:text-primary/80
//             ${
//               location.pathname === item.url
//                 ? "bg-primary/20 text-primary/80"
//                 : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
//             }
//           `}
//             >
//               <SidebarMenuItem key={item.url}>
//                 <SidebarMenuButton
//                   tooltip={item.title}
//                   className={`${
//                     location.pathname === item.url
//                       ? "text-foreground"
//                       : "text-foreground"
//                   } hover:bg-transparent
//                   hover:text-foreground cursor-pointer`}
//                 >
//                   <span>{item.icon && <item.icon className="w-4 h-4" />}</span>
//                   <span>{item.title}</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </Link>
//           ))}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavMain({ items }) {
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
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link to="/client/dashboard" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="lahza agency logo"
                className="w-auto h-9 md:h-12 lg:h-15"
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`
            flex items-center gap-3 rounded-sm
            cursor-pointer
            hover:text-primary/80
            ${
              isActive(item.url)
                ? "bg-primary/20 text-primary/80"
                : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
            }
          `}
            >
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`${
                    isActive(item.url) ? "text-foreground" : "text-foreground"
                  } hover:bg-transparent 
                  hover:text-foreground cursor-pointer`}
                >
                  <span>{item.icon && <item.icon className="w-4 h-4" />}</span>
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
