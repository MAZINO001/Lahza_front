import React from "react";
import { Mail, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Mails() {
  const data = [
    {
      id: 1,
      to: "xoxec79310@rohoza.com",
      subject: "Invoice Notification",
      description: "Invoice - INV-000002 from NewEra",
      date: "11 Nov 2025 01:22 PM",
    },
    {
      id: 2,
      to: "xoxec79310@rohoza.com",
      subject: "Invites",
      description: "NewEra has invited you to join their portal",
      date: "10 Nov 2025 10:23 AM",
    },
    {
      id: 3,
      to: "xoxec79310@rohoza.com",
      subject: "Invites",
      description: "NewEra has invited you to join their portal",
      date: "10 Nov 2025 10:23 AM",
    },
    {
      id: 4,
      to: "xoxec79310@rohoza.com",
      subject: "Invites",
      description: "NewEra has invited you to join their portal",
      date: "10 Nov 2025 10:23 AM",
    },
    {
      id: 5,
      to: "xoxec79310@rohoza.com",
      subject: "Invites",
      description: "NewEra has invited you to join their portal",
      date: "10 Nov 2025 10:23 AM",
    },
  ];
  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-base font-medium text-gray-900">System Mails</h2>
        {/* <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
        >
          <Mail className="h-4 w-4 mr-2" />
          Link Email account
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button> */}
      </div>

      <div className="divide-y divide-gray-200">
        {data.map((mail) => (
          <div
            key={mail.id}
            className="flex items-center gap-3 p-4  transition-colors"
          >
            {/* <Button
              variant="ghost"
              className="w-8 h-8 flex items-center justify-center rounded-2xl"
            >
              <X className="h-4 w-4" />
            </Button> */}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 mb-1">To {mail.to}</p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{mail.subject}</span>
                    <span className="text-gray-600"> - {mail.description}</span>
                  </p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">
                  {mail.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
