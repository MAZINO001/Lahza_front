import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview({ data }) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          Service Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Image (≈50%) */}
          {data?.image && (
            <div className="space-y-2 order-1 md:order-0">
              <p className="text-sm font-medium text-muted-foreground">
                Preview
              </p>
              <div className="overflow-hidden rounded-lg border bg-muted/40 aspect-video">
                <img
                  src={data.image}
                  alt={data.name || "Service preview"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Right: Description (≈50%) */}
          <div className="space-y-2 order-2 md:order-0">
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>

            {data?.description ? (
              <div
                className="text-sm leading-relaxed text-foreground prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No description provided.
              </p>
            )}
          </div>
        </div>

        {/* Pricing - full width below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Base Price
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-primary">
                {data?.base_price ? Number(data.base_price).toFixed(2) : "0.00"}
              </span>
              <span className="text-lg font-medium text-muted-foreground">
                MAD
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Tax Rate
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {data?.tax_rate ?? 0}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
