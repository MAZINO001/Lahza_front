import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م." },
];

export default function CurrencySelect({
  value = "",
  onChange,
  disabled = false,
  error,
}) {
  const { t } = useTranslation();
  const selectedCurrency = CURRENCIES.find((c) => c.code === value);

  return (
    <div className={cn("flex items-start justify-between flex-col ")}>
      <Label htmlFor="currency" className="text-sm font-medium">
        {t("client_form.currency")}
      </Label>

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={`w-full transition-colors bg-background  ${
            error
              ? "border-destructive focus:ring-destructive"
              : "focus:ring-primary"
          }`}
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2 ">
              <span className="font-medium">{selectedCurrency.code}</span>
              <span className="text-muted-foreground text-sm">
                {selectedCurrency.symbol}
              </span>
            </div>
          ) : (
            <SelectValue placeholder={t("client_form.currency_placeholder")} />
          )}
        </SelectTrigger>

        <SelectContent className="w-full" align="start" sideOffset={4}>
          {CURRENCIES.map((currency) => (
            <SelectItem
              key={currency.code}
              value={currency.code}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{currency.code}</span>
                <span className="text-muted-foreground">{currency.symbol}</span>
                <span className="text-muted-foreground text-sm">
                  {currency.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
