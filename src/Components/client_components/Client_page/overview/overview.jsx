import TimelineComponent from "@/components/timeline";
import { Mail, Phone } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Overview_chart from "./overview_chart";
import Overview_ClientInfo from "./overview_ClientInfo";
import Overview_Payments from "./overview_Payments";
import { useClientHistory } from "@/features/clients/hooks/useClientsHistory";
export default function Overview({ data, currentId }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const { data: history } = useClientHistory(currentId);
  console.log(history);
  const displayName =
    data?.client?.client_type === "company"
      ? data?.client?.company
      : data?.client.user?.name;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="grid  grid-cols-2 gap-4">
      <div className="space-y-4 ">
        <div className="bg-background rounded-lg border border-border p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {displayName}
          </h3>

          <div className=" flex items-start gap-4 ">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt={data?.client.user?.name || "unknown"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                {getInitials(data?.client.user?.name || "CL")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <div className="text-base font-medium text-foreground">
                {data?.client.user?.name || "unknown"}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {data?.client.user?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{data?.client?.phone}</span>
              </div>
            </div>
          </div>
        </div>
        <Overview_ClientInfo id={data?.client?.id} />
      </div>
      <div className="space-y-4">
        <Overview_Payments
          formatCurrency={formatCurrency}
          currentId={currentId}
        />
        <Overview_chart formatCurrency={formatCurrency} currentId={currentId} />
        <div className="bg-background max-h-[500px] overflow-y-auto rounded-lg border border-border p-4">
          <TimelineComponent data={history} />
        </div>
      </div>
    </div>
  );
}
