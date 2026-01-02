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
            flex items-center gap-3  py-2 rounded-lg text-[15px] font-medium
            transition-colors duration-100 cursor-pointer
            hover:text-primary/80
            ${
              location.pathname === item.url
                ? "bg-primary/20 text-primary/80"
                : "text-foreground hover:bg-gray-100 dark:hover:bg-primary/20"
            }
          `}
            >
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`${
                    location.pathname === item.url
                      ? "text-primary/80"
                      : "text-foreground"
                  } hover:bg-transparent hover:text-primary/80 cursor-pointer`}
                >
                  <span>{item.icon && <item.icon className="w-5 h-5" />}</span>
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
