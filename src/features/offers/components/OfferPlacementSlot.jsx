import { useState, useMemo } from "react";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOffers } from "../hooks/useOffers/useOffers";
import OfferCard from "./OfferCard";

dayjs.extend(isBetween);
const OfferPlacementSlot = ({
  placement,
  maxOffers = 3,
  showAnimated = true,
}) => {
  const { data: offers, isLoading, error } = useOffers();
  const [dismissedOffers, setDismissedOffers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const visibleOffers = useMemo(() => {
    if (!offers?.length) {
      console.log("No offers available");
      return [];
    }

    const now = dayjs();

    return offers
      ?.filter((offer) => {
        if (!offer?.id) {
          console.warn("Invalid offer structure - missing id:", offer);
          return false;
        }
        let hasPlacement = false;
        if (Array.isArray(offer?.placement)) {
          hasPlacement = offer?.placement.includes(placement);
        } else if (offer?.service_id && offer?.placement !== null) {
          // Only show in projects/header if placement is explicitly set (not null)
          hasPlacement = placement === "projects" || placement === "header";
        }

        const isActive =
          offer?.status === "active" || offer?.status === undefined;
        let isInRange = true;
        if (offer?.start_date && offer?.end_date) {
          isInRange = now.isBetween(
            offer?.start_date,
            offer?.end_date,
            null,
            "[]",
          );
        }

        const notDismissed = !dismissedOffers.includes(offer?.id);

        return isActive && hasPlacement && isInRange && notDismissed;
      })
      .slice(0, maxOffers);
  }, [offers, placement, dismissedOffers, maxOffers]);

  const handleDismiss = (id) => {
    setDismissedOffers((prev) => [...prev, id]);
    // Reset to first slide if current offer is dismissed
    if (visibleOffers[currentSlide]?.id === id) {
      setCurrentSlide(0);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? visibleOffers.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === visibleOffers.length - 1 ? 0 : prev + 1,
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Reset current slide when visible offers change
  useMemo(() => {
    if (currentSlide >= visibleOffers.length) {
      setCurrentSlide(0);
    }
  }, [visibleOffers.length, currentSlide]);

  if (isLoading) {
    return null;
  }

  if (error) {
    console.error("Error loading offers:", error);
    return null;
  }

  if (!visibleOffers.length) {
    return null;
  }

  // If only one offer, show it normally without slider
  if (visibleOffers.length === 1) {
    return (
      <div
        className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
        role="region"
        aria-label={`Promotional offers for ${placement}`}
      >
        <OfferCard
          key={visibleOffers[0]?.id}
          offer={visibleOffers[0]}
          onDismiss={handleDismiss}
          animationDelay={0}
          showAnimated={showAnimated}
          placement={placement}
        />
      </div>
    );
  }

  // Multiple offers - show slider
  return (
    <div
      className="relative animate-in fade-in slide-in-from-bottom-2 duration-300"
      role="region"
      aria-label={`Promotional offers for ${placement}`}
    >
      {/* Slider Container */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {visibleOffers.map((offer, index) => (
            <div key={offer?.id} className="w-full shrink-0">
              <OfferCard
                offer={offer}
                onDismiss={handleDismiss}
                animationDelay={0}
                showAnimated={false}
                placement={placement}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-4 px-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevSlide}
          className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
          aria-label="Previous offer"
          title="Previous offer"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {visibleOffers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to offer ${index + 1}`}
              title={`Offer ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextSlide}
          className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
          aria-label="Next offer"
          title="Next offer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OfferPlacementSlot;
