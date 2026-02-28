import TimelineComponent from "@/components/timeline";
import { Mail, Phone, Copy, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Overview_chart from "./overview_chart";
import Overview_ClientInfo from "./overview_ClientInfo";
import Overview_Payments from "./overview_Payments";
import { useClientHistory } from "@/features/clients/hooks/useClientsHistory";
import { useState } from "react";
import VerifiedCard from "@/components/VerifiedCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
export default function Overview({ data, currentId }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === "phone") {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const { data: history } = useClientHistory(currentId);
  console.log(history);
  const displayName =
    data?.client?.client_type === "company"
      ? data?.client?.company
      : data?.client.user?.name;

  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4 ">
        <Card className="bg-background rounded-lg border border-border">
          <CardHeader className="text-lg font-semibold text-foreground">
            {displayName}
          </CardHeader>

          <CardContent className=" flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt={data?.client.user?.name || "unknown"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                {getInitials(data?.client.user?.name || "CL")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <div className="text-base font-medium text-foreground gap-4 flex ">
                <p>{data?.client.user?.name || "unknown"}</p>
                <VerifiedCard />
              </div>
              <div
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() =>
                  copyToClipboard(data?.client.user?.email, "email")
                }
              >
                <Mail className="w-4 h-4" />
                {data?.client.user?.email}
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </div>
              <div
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => copyToClipboard(data?.client?.phone, "phone")}
              >
                <Phone className="w-4 h-4" />
                <span>{data?.client?.phone}</span>
                {copiedPhone ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Overview_ClientInfo id={data?.client?.id} />
      </div>
      <div className="space-y-4">
        <Overview_Payments
          formatAmount={formatAmount}
          currentId={currentId}
        />
        <Overview_chart formatAmount={formatAmount} currentId={currentId} />
        <div className="bg-background max-h-[500px] overflow-y-auto rounded-lg border border-border p-4">
          <TimelineComponent data={history} />
        </div>
      </div>
    </div>
  );
}
