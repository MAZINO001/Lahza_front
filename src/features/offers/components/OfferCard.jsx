import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const OfferCard = ({
  offer,
  onDismiss,
  animationDelay = 0,
  showAnimated = true,
  placement = "default",
}) => {
  const baseCardClasses = `
    relative
    mt-4
    overflow-hidden
    bg-background
    text-foreground
    border
    transition-all duration-300
    ${showAnimated ? "animate-in fade-in slide-in-from-bottom-2 duration-400" : ""}
  `;

  let shapeClasses = "";
  let paddingClasses = "p-5";
  let titleSize = "text-lg";
  let ctaSize = "text-sm";

  const { t } = useTranslation();

  if (placement === "header") {
    shapeClasses = `
      mt-[-0px]
      border-border/70
      bg-gradient-to-r from-card via-card to-card/90
      flex items-center gap-4
      min-h-[68px]
      py-3 px-5
    `;
    paddingClasses = "";
    titleSize = "text-base font-semibold";
    ctaSize = "text-xs";
  } else if (placement === "calendar") {
    shapeClasses = `
      rounded-xl
      border-border
      bg-gradient-to-br from-primary/5 via-card to-card
    `;
    paddingClasses = "p-5";
    titleSize = "text-base font-bold";
  } else {
    shapeClasses = `
      rounded-xl
      border-border
      hover:border-primary/40
      hover:shadow-md
    `;
    paddingClasses = "p-5";
    titleSize = "text-lg font-semibold";
  }

  return (
    <div
      className={`${baseCardClasses} ${shapeClasses}`}
      style={
        showAnimated ? { animationDelay: `${animationDelay * 120}ms` } : {}
      }
    >
      {onDismiss && (
        <button
          onClick={() => onDismiss(offer?.id)}
          className={`
            absolute
            ${placement === "header" ? "top-2 right-2" : "top-3 right-3"}
            p-1.5 rounded-full
            bg-background/80 backdrop-blur-sm
            text-muted-foreground
            hover:bg-muted hover:text-foreground
            transition-colors
            z-10
          `}
          aria-label={t("offers.card.dismiss_aria", {
            title: offer?.title || t("offers.card.default_offer_label"),
          })}
          title={t("offers.card.dismiss_title")}
        >
          <X size={placement === "header" ? 16 : 18} />
        </button>
      )}

      {placement === "header" ? (
        <div className="flex items-center justify-between flex-1  gap-4">
          <div className="flex-1 min-w-0">
            <h3 className={`${titleSize} truncate`}>{offer?.title}</h3>
            {offer?.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {offer.description}
              </p>
            )}
          </div>

          <div className="shrink-0">{renderCTA(offer, ctaSize)}</div>
        </div>
      ) : (
        <div className={paddingClasses}>
          <h3 className={`${titleSize} mb-1.5`}>{offer?.title}</h3>

          {offer?.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {offer.description}
            </p>
          )}

          {renderCTA(offer, ctaSize)}
        </div>
      )}
    </div>
  );
};

function renderCTA(offer, ctaSize = "text-sm") {
  if (!offer) return null;

  if (offer.cta_url && offer.cta_text) {
    return (
      <a
        href={offer.cta_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          inline-flex items-center gap-1.5
          ${ctaSize} font-medium
          text-primary hover:text-primary/80
          transition-colors underline-offset-4 hover:underline
        `}
      >
        {offer.cta_text}
        <span aria-hidden>→</span>
      </a>
    );
  }

  if (offer.discount_type && offer.discount_value) {
    let discountText = "Special Offer";
    if (offer.discount_type === "percent") {
      discountText = `${offer.discount_value}% OFF`;
    } else if (offer.discount_type === "fixed") {
      discountText = `$${offer.discount_value} OFF`;
    }

    return (
      <div
        className={`
          inline-block px-3.5 py-1.5
          text-xs sm:${ctaSize}
          font-semibold
          bg-green-100 text-green-800
          dark:bg-green-950 dark:text-green-300
          rounded-full border border-green-200/50 dark:border-green-800/40
        `}
      >
        {discountText}
      </div>
    );
  }

  return null;
}

export default OfferCard;
