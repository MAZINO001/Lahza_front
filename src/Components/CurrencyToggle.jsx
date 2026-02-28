// components/CurrencyToggle.jsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { currencies, useCurrencyStore } from "@/hooks/useCurrencyStore";

export default function CurrencyToggle() {
  const { selectedCurrency, setSelectedCurrency, getCurrentCurrency } =
    useCurrencyStore();

  const current = getCurrentCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-2 gap-2 text-sm font-medium",
            "text-sm font-medium border-border/70 hover:border-border",
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
          )}
        >
          <span className="hidden sm:inline font-mono tracking-wide">
            {current.symbol}
          </span>
          <span className="hidden sm:inline text-muted-foreground">
            {current.code}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[220px] p-1 max-h-[min(360px,80vh)] overflow-y-auto"
      >
        {currencies.map((currency) => {
          const isActive = selectedCurrency === currency.code;

          return (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className={cn(
                "cursor-pointer flex items-center gap-2 py-2 px-2 text-sm",
                "focus:bg-accent focus:text-accent-foreground",
                isActive && "bg-accent/60 font-medium",
              )}
            >
              <span className="text-base leading-none">{currency.flag}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium">{currency.code}</span>
                <span className="text-xs text-muted-foreground">
                  {currency.symbol}
                </span>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
