import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavMain({ items }) {
  const location = useLocation();
  const { state } = useSidebar();

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
    <div className="flex flex-col">
      {/* Logo */}
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col ">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center mb-2">
              <Link to="/client/dashboard" className="flex items-center ">
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
                      : "w-auto h-9 md:h-12 lg:h-15"
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
            <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col ">
            <SidebarMenu>
              {section.items.map((item) => (
                <Link key={item.title} to={item.url} className="">
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`
                      flex items-center rounded-sm
                      cursor-pointer
                      hover:text-primary/80
                      text-[12px]
                   
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
      ))}
    </div>
  );
}
