import { Card, CardContent } from "@/components/ui/card";

export default function overview({ data }) {
  return (
    <div>
      <Card>
        <CardContent className="space-y-6 py-4 px-4">
          {data?.image && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Image
              </p>
              <img
                src={data.image}
                alt={data.name}
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </p>
            <p className="text-md text-gray-800 whitespace-pre-wrap">
              {data?.description || (
                <span className="text-muted-foreground italic">
                  No description provided
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Base Price
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {data?.base_price ? Number(data.base_price).toFixed(2) : "0.00"}{" "}
                MAD
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tax Rate
              </p>
              <p className="text-3xl font-bold text-gray-700">
                {data?.tax_rate ? `${data.tax_rate}%` : "0%"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
