import { useLocation, Link } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function BreadcrumbsWrapper() {
  const location = useLocation();

  if (
    location.pathname.includes("/auth") ||
    location.pathname.endsWith("/dashboard")
  ) {
    return null;
  }

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const crumbs = [];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    if (index === 0 && ["admin", "client", "team_member"].includes(segment)) {
      return;
    }

    let name = segment;
    let breadcrumbPath = currentPath;

    // Handle singular to plural conversion for list pages
    if (
      index === pathSegments.length - 2 &&
      /^\d+$/.test(pathSegments[index + 1])
    ) {
      // This is a detail page, so we need to make the previous segment plural
      if (segment === "invoice") {
        name = "Invoices";
        breadcrumbPath = currentPath.replace(/invoice$/, "invoices");
      } else if (segment === "project") {
        name = "Projects";
        breadcrumbPath = currentPath.replace(/project$/, "projects");
      } else if (segment === "quote") {
        name = "Quotes";
        breadcrumbPath = currentPath.replace(/quote$/, "quotes");
      } else if (segment === "client") {
        name = "Clients";
        breadcrumbPath = currentPath.replace(/client$/, "clients");
      } else if (segment === "payment") {
        name = "Payments";
        breadcrumbPath = currentPath.replace(/payment$/, "payments");
      } else if (segment === "receipt") {
        name = "Receipts";
        breadcrumbPath = currentPath.replace(/receipt$/, "receipts");
      } else if (segment === "offer") {
        name = "Offers";
        breadcrumbPath = currentPath.replace(/offer$/, "offers");
      } else if (segment === "service") {
        name = "Services";
        breadcrumbPath = currentPath.replace(/service$/, "services");
      } else if (segment === "ticket") {
        name = "Tickets";
        breadcrumbPath = currentPath.replace(/ticket$/, "tickets");
      } else if (segment === "log") {
        name = "Logs";
        breadcrumbPath = currentPath.replace(/log$/, "logs");
      }
    } else if (
      index === pathSegments.length - 2 &&
      pathSegments[index + 1] === "new"
    ) {
      // This is a "new" page, so we need to make the previous segment plural
      if (segment === "invoice") {
        name = "Invoices";
        breadcrumbPath = currentPath.replace(/invoice$/, "invoices");
      } else if (segment === "project") {
        name = "Projects";
        breadcrumbPath = currentPath.replace(/project$/, "projects");
      } else if (segment === "quote") {
        name = "Quotes";
        breadcrumbPath = currentPath.replace(/quote$/, "quotes");
      } else if (segment === "client") {
        name = "Clients";
        breadcrumbPath = currentPath.replace(/client$/, "clients");
      } else if (segment === "payment") {
        name = "Payments";
        breadcrumbPath = currentPath.replace(/payment$/, "payments");
      } else if (segment === "receipt") {
        name = "Receipts";
        breadcrumbPath = currentPath.replace(/receipt$/, "receipts");
      } else if (segment === "offer") {
        name = "Offers";
        breadcrumbPath = currentPath.replace(/offer$/, "offers");
      } else if (segment === "service") {
        name = "Services";
        breadcrumbPath = currentPath.replace(/service$/, "services");
      } else if (segment === "ticket") {
        name = "Tickets";
        breadcrumbPath = currentPath.replace(/ticket$/, "tickets");
      } else if (segment === "log") {
        name = "Logs";
        breadcrumbPath = currentPath.replace(/log$/, "logs");
      }
    } else if (
      index === pathSegments.length - 3 &&
      pathSegments[index + 2] === "edit" &&
      /^\d+$/.test(pathSegments[index + 1])
    ) {
      // This is an edit page (e.g., /admin/offer/1/edit), so we need to make the resource segment plural
      if (segment === "invoice") {
        name = "Invoices";
        breadcrumbPath = currentPath.replace(/invoice$/, "invoices");
      } else if (segment === "project") {
        name = "Projects";
        breadcrumbPath = currentPath.replace(/project$/, "projects");
      } else if (segment === "quote") {
        name = "Quotes";
        breadcrumbPath = currentPath.replace(/quote$/, "quotes");
      } else if (segment === "client") {
        name = "Clients";
        breadcrumbPath = currentPath.replace(/client$/, "clients");
      } else if (segment === "payment") {
        name = "Payments";
        breadcrumbPath = currentPath.replace(/payment$/, "payments");
      } else if (segment === "receipt") {
        name = "Receipts";
        breadcrumbPath = currentPath.replace(/receipt$/, "receipts");
      } else if (segment === "offer") {
        name = "Offers";
        breadcrumbPath = currentPath.replace(/offer$/, "offers");
      } else if (segment === "service") {
        name = "Services";
        breadcrumbPath = currentPath.replace(/service$/, "services");
      } else if (segment === "ticket") {
        name = "Tickets";
        breadcrumbPath = currentPath.replace(/ticket$/, "tickets");
      } else if (segment === "log") {
        name = "Logs";
        breadcrumbPath = currentPath.replace(/log$/, "logs");
      }
    } else if (
      index === pathSegments.length - 3 &&
      pathSegments[index + 2] === "settings" &&
      /^\d+$/.test(pathSegments[index + 1])
    ) {
      // This is a settings page (e.g., /admin/project/1/settings), so we need to make the resource segment plural
      if (segment === "invoice") {
        name = "Invoices";
        breadcrumbPath = currentPath.replace(/invoice$/, "invoices");
      } else if (segment === "project") {
        name = "Projects";
        breadcrumbPath = currentPath.replace(/project$/, "projects");
      } else if (segment === "quote") {
        name = "Quotes";
        breadcrumbPath = currentPath.replace(/quote$/, "quotes");
      } else if (segment === "client") {
        name = "Clients";
        breadcrumbPath = currentPath.replace(/client$/, "clients");
      } else if (segment === "payment") {
        name = "Payments";
        breadcrumbPath = currentPath.replace(/payment$/, "payments");
      } else if (segment === "receipt") {
        name = "Receipts";
        breadcrumbPath = currentPath.replace(/receipt$/, "receipts");
      } else if (segment === "offer") {
        name = "Offers";
        breadcrumbPath = currentPath.replace(/offer$/, "offers");
      } else if (segment === "service") {
        name = "Services";
        breadcrumbPath = currentPath.replace(/service$/, "services");
      } else if (segment === "ticket") {
        name = "Tickets";
        breadcrumbPath = currentPath.replace(/ticket$/, "tickets");
      } else if (segment === "log") {
        name = "Logs";
        breadcrumbPath = currentPath.replace(/log$/, "logs");
      }
    } else if (segment === "project") {
      name = "Projects";
    } else if (segment === "new") {
      name = "New";
    } else if (segment === "edit") {
      name = "Edit";
    } else if (segment === "settings") {
      name = "Settings";
      // If this is the settings segment and there's a next segment (like company_basics)
      // make it link to the full settings path instead of just /settings
      if (index < pathSegments.length - 1) {
        breadcrumbPath = currentPath + "/" + pathSegments[index + 1];
      }
    } else if (index > 0 && pathSegments[index - 1] === "settings") {
      // This is a settings page (e.g., company_basics in /admin/settings/company_basics)
      // Don't make it clickable since it's already the current page
      name = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    } else if (segment === "tasks") {
      name = "Tasks";
    } else if (segment === "calendar") {
      name = "Calendar";
    } else if (segment === "profile") {
      name = "Profile";
    } else if (segment === "notifications") {
      name = "Notifications";
    } else if (/^\d+$/.test(segment)) {
      const prevSegment = pathSegments[index - 1];
      if (prevSegment === "project") {
        name = `Project ${segment}`;
      } else if (prevSegment === "ticket") {
        name = `TKT ${segment}`;
      } else {
        name = `ID: ${segment}`;
      }
    } else {
      name = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    crumbs.push({
      name,
      path: breadcrumbPath,
      isLast: index === pathSegments.length - 1,
    });
  });

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb className="px-4 pt-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/${pathSegments[0]}/dashboard`} aria-label="home">
              <Home size={16} />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb, idx) => (
          <BreadcrumbItem key={idx}>
            <BreadcrumbSeparator />
            {crumb.isLast ? (
              <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={crumb.path}>{crumb.name}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbsWrapper;
