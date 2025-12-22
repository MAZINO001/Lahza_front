import React, { useState } from "react";
import { Sparkles, X, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link } from "react-router-dom";

export default function WhatsNextBanner({ currentId }) {
  const [isVisible, setIsVisible] = useState(true);
  const { role } = useAuthContext();
  if (!isVisible) return null;

  return (
    <div className="bg-background border border-border rounded-lg px-4 py-4">
      <div className="flex gap-3 items-start ">
        <div
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-100"
        >
          <Sparkles className="text-purple-600" size={18} />
        </div>

        <div className="flex flex-col w-full min-w-0">
          <div className="space-y-1 mb-3">
            <p className="font-semibold text-sm text-foreground">
              WHAT'S NEXT?
            </p>
            <p className="text-sm text-muted-foreground">
              Create an <span className="font-medium">invoice</span> or a{" "}
              <span className="font-medium">quote</span> and send it to your
              customer.
            </p>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <Link to={`/${role}/invoice/new`} state={{ clientId: currentId }}>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Invoice
              </Button>
            </Link>
            <Link to={`/${role}/quote/new`} state={{ clientId: currentId }}>
              <Button
                size="sm"
                variant="outline"
                className="border border-border"
              >
                <Plus className="h-4 w-4" />
                New Quote
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  variant="outline"
                  className="p-2 border border-border rounded-md "
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setIsVisible(false)}>
                  Don't show again
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button
          aria-label="Close banner"
          className="size-8 shrink-0 p-0 -mt-1 -mr-1"
          onClick={() => setIsVisible(false)}
          variant="ghost"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
