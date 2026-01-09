// src/components/common/BreadcrumbsWrapper.jsx
import { useMatches, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

function BreadcrumbsWrapper() {
  const matches = useMatches();
  const crumbs = matches
    .filter((route) => route.handle?.breadcrumb)
    .map((route) => {
      const crumb =
        typeof route.handle.breadcrumb === "function"
          ? route.handle.breadcrumb(route.params)
          : route.handle.breadcrumb;
      return { label: crumb, path: route.pathname };
    });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            aria-label="home"
          >
            <Home size={16} />
          </Link>
        </li>

        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />
            {idx === crumbs.length - 1 ? (
              <span className="text-gray-700 font-medium" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default BreadcrumbsWrapper;
