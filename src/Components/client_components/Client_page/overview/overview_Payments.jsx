import { Card, CardContent } from "@/components/ui/card";
export default function overview_Payments({ formatCurrency }) {
  const receivablesData = [
    {
      currency: "USD",
      fullName: "United States Dollar",
      outstanding: 0.0,
      unusedCredits: 0.0,
    },
    {
      currency: "EUR",
      fullName: "Euro",
      outstanding: 0.0,
      unusedCredits: 0.0,
    },
  ];

  const paymentDuePeriod = "Due on Receipt";
  const receivables = receivablesData;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Payment due period</div>
          <div className="text-base font-semibold text-gray-900">
            {paymentDuePeriod}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Receivables
          </h3>

          <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Currency
            </div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
              Outstanding Receivables
            </div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
              Unused Credits
            </div>
          </div>

          {receivables.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0"
            >
              <div className="text-sm text-gray-900">
                {item.currency} - {item.fullName}
              </div>
              <div className="text-sm text-gray-900 text-right font-medium">
                {formatCurrency(item.outstanding)}
              </div>
              <div className="text-sm text-gray-900 text-right font-medium">
                {formatCurrency(item.unusedCredits)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
