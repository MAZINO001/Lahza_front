import TimelineComponent from "@/Components/comp-531";
import { Phone } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Overview_chart from "./overview_chart";
import Overview_ClientInfo from "./overview_ClientInfo";
import Overview_Payments from "./overview_Payments";
export default function Overview({ data }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName =
    data?.client_type === "company" ? data?.company : data?.user?.name;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {displayName}
          </h3>

          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt={data?.user?.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                {getInitials(data?.user?.name || "CL")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="text-base font-medium text-gray-900 mb-1">
                {data?.user?.name}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {data?.user?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{data?.phone}</span>
              </div>
            </div>
          </div>
        </div>
        <Overview_ClientInfo id={data?.id} />
      </div>

      <div className="space-y-4">
        <Overview_Payments formatCurrency={formatCurrency} />
        <Overview_chart formatCurrency={formatCurrency} />
        <div className="bg-white max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 p-4 shadow-sm">
          <TimelineComponent />
        </div>
      </div>
    </div>
  );
}
