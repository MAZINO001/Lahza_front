import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const categoryConfig = {
  dev: {
    label: "Development",
    description:
      "Development services focused on building, customizing, and deploying high-quality web and application solutions tailored to business needs.",
    services: [
      "Web Application Development",
      "Shopify Ecommerce Website Creation",
      "Custom Ecommerce Website Development",
    ],
  },

  marketing: {
    label: "Marketing",
    description:
      "Digital marketing services designed to improve online visibility, drive targeted traffic, and increase conversions through organic and paid strategies.",
    services: [
      "SEO – Website Indexing Phase",
      "SEO – Monthly Performance Monitoring",
      "Ads Management – Campaign Setup & Optimization",
    ],
  },

  management: {
    label: "Management",
    description:
      "Technical and operational management services that ensure hosting reliability, website security, performance, and long-term system stability.",
    services: [
      "Web Hosting Server ",
      "Annual Website Maintenance & Security",
      "Annual Website Service Renewal",
    ],
  },

  branding: {
    label: "Branding",
    description:
      "Branding and design services aimed at creating a strong, consistent, and professional visual identity across all digital and physical touchpoints.",
    services: [
      "Logo Design",
      "New Brand Creation – Full Package",
      "Graphic Charter & Visual Guidelines",
    ],
  },
};

export function CategoryBadge({
  category,
  showTooltip = true,
  className = "",
  tooltip,
  ...props
}) {
  const config = categoryConfig[category] || {
    label: category,
    description: `Category: ${category}`,
    services: [],
  };

  const tooltipContent = tooltip || (
    <div className="max-w-xs p-4 space-y-3">
      <p className="text-sm text-background leading-relaxed">
        {config.description} <br />
        Examples:
      </p>
      <ul className="space-y-1 text-sm">
        {config.services.map((service) => (
          <li key={service} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-background" />
            <span className="text-background">{service}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const badgeContent = (
    <Badge className={`cursor-pointer capitalize ${className}`} {...props}>
      {config.label}
    </Badge>
  );

  if (showTooltip && (tooltip || config.services.length > 0)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          sideOffset={5}
          className="bg-foreground text-background border-border"
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    );
  }

  return badgeContent;
}
