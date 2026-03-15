import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancialOverview() {
  return (
    <div className="space-y-4 ">
      <h2 className="text-xl font-normal tracking-tight text-foreground">
        Financial Overview
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              104.500 MAD
            </div>
            <p className="text-xs text-blue-500 mt-1">↑ +9.6% vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">62.300 MAD</div>
            <p className="text-xs text-blue-500 mt-1">↑ +4.2% vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">85.200 MAD</div>
            <p className="text-xs text-blue-500 mt-1">↑ +12.1% vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unpaid Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">43.800 MAD</div>
            <p className="text-xs text-muted-foreground mt-1">
              4 invoices pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row - 3 cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Active Projects */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">5</div>
          </CardContent>
        </Card>

        {/* Awaiting Validation */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Awaiting Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">4</div>
          </CardContent>
        </Card>

        {/* Total Clicks */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">4</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
