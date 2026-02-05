// import { useState } from "react";
// import isBetween from "dayjs/plugin/isBetween";
// import dayjs from "dayjs";
// import { X } from "lucide-react";
// import { useOffers } from "../hooks/useOffers/useOffers";

// const OfferPlacementSlot = ({ placement }) => {
//   const { data: offers } = useOffers();
//   dayjs.extend(isBetween);

//   const [dismissedOffers, setDismissedOffers] = useState([]);

//   const handleDismiss = (id) => {
//     setDismissedOffers((prev) => [...prev, id]);
//   };

//   const visibleOffers = offers
//     ?.filter((offer) => {
//       return (
//         offer?.status === "active" &&
//         offer?.placement?.includes(placement) &&
//         dayjs().isBetween(offer?.start_date, offer?.end_date) &&
//         !dismissedOffers.includes(offer.id)
//       );
//     })
//     .slice();

//   if (!visibleOffers?.length) return null;

//   return (
//     <div className="mt-4 space-y-3">
//       {visibleOffers?.map((offer) => (
//         <div
//           key={offer.id}
//           className="relative rounded-xl border p-4 bg-background"
//         >
//           <button
//             onClick={() => handleDismiss(offer.id)}
//             className="absolute top-2 right-2 text-sm px-2 py-1 rounded-md"
//           >
//             <X />
//           </button>

//           <h3 className="font-semibold">{offer.title}</h3>
//           <p className="text-sm text-muted-foreground">{offer.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OfferPlacementSlot;

import { useState, useMemo } from "react";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useOffers } from "../hooks/useOffers/useOffers";

dayjs.extend(isBetween);

/**
 * OfferPlacementSlot - Displays promotional offers in specific UI placements
 *
 * Features:
 * - Filters offers by placement, status, and date range
 * - Allows users to dismiss individual offers
 * - Dismissal state is per-component instance
 * - Supports rendering multiple offers with animation
 *
 * @param {string} placement - The placement identifier (e.g., "projects", "calendar")
 * @param {number} [maxOffers=3] - Maximum number of offers to display
 * @param {boolean} [showAnimated=true] - Enable entrance animations
 */
const OfferPlacementSlot = ({
  placement,
  maxOffers = 3,
  showAnimated = true,
}) => {
  const { data: offers, isLoading, error } = useOffers();
  const [dismissedOffers, setDismissedOffers] = useState([]);

  const handleDismiss = (id) => {
    setDismissedOffers((prev) => [...prev, id]);
  };

  // Memoize filtering logic to avoid unnecessary recalculations
  const visibleOffers = useMemo(() => {
    if (!offers?.length) return [];

    const now = dayjs();

    return offers
      .filter((offer) => {
        // Validate offer structure
        if (!offer.id || !offer.placement || !Array.isArray(offer.placement)) {
          console.warn("Invalid offer structure:", offer);
          return false;
        }

        return (
          offer.status === "active" &&
          offer.placement.includes(placement) &&
          now.isBetween(offer.start_date, offer.end_date, null, "[]") &&
          !dismissedOffers.includes(offer.id)
        );
      })
      .slice(0, maxOffers);
  }, [offers, placement, dismissedOffers, maxOffers]);

  // Handle loading and error states
  if (isLoading) {
    return null; // Or render a skeleton if needed
  }

  if (error) {
    console.error("Error loading offers:", error);
    return null;
  }

  if (!visibleOffers.length) {
    return null;
  }

  return (
    <div
      className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
      role="region"
      aria-label={`Promotional offers for ${placement}`}
    >
      {visibleOffers.map((offer, index) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onDismiss={handleDismiss}
          animationDelay={index}
          showAnimated={showAnimated}
        />
      ))}
    </div>
  );
};

/**
 * OfferCard - Individual offer display component
 * Separated for better component composition and reusability
 */
const OfferCard = ({
  offer,
  onDismiss,
  animationDelay = 0,
  showAnimated = true,
}) => {
  return (
    <div
      className={`relative rounded-xl border border-gray-200 p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-200 ${
        showAnimated
          ? "animate-in fade-in slide-in-from-bottom-1 duration-300"
          : ""
      }`}
      style={
        showAnimated ? { animationDelay: `${animationDelay * 100}ms` } : {}
      }
    >
      <button
        onClick={() => onDismiss(offer.id)}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700 flex-shrink-0"
        aria-label={`Dismiss offer: ${offer.title}`}
        title="Dismiss this offer"
      >
        <X size={18} />
      </button>

      <div className="pr-8">
        <h3 className="font-semibold text-gray-900">{offer.title}</h3>
        {offer.description && (
          <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
        )}

        {offer.cta_url && offer.cta_text && (
          <a
            href={offer.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            {offer.cta_text} →
          </a>
        )}
      </div>
    </div>
  );
};

export default OfferPlacementSlot;
