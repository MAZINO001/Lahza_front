/* eslint-disable react-hooks/exhaustive-deps */
// CurrencySelect.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRegisterStore } from "@/hooks/registerStore";
import InputError from "../InputError";

const COMMON_CURRENCIES = [
  { code: "USD", name: "Dollar américain", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "MAD", name: "Dirham marocain", symbol: "د.م." },
];

export default function CurrencySelect({
  value = "",
  onChange,
  disabled = false,
  error,
}) {
  const [search, setSearch] = useState("");
  const registerStore = useRegisterStore();

  // Sync selected currency with Zustand store whenever it changes
  useEffect(() => {
    if (value) {
      registerStore.setField("currency", value);
    }
  }, [value]);

  // Filter currencies based on search input
  const filtered = COMMON_CURRENCIES.filter((c) => {
    const lower = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(lower) ||
      c.name.toLowerCase().includes(lower) ||
      c.symbol.toLowerCase().includes(lower)
    );
  });

  const handleValueChange = (newValue) => {
    // 1. Update React Hook Form (via Controller)
    onChange?.(newValue);
    // 2. Update Zustand store
    registerStore.setField("currency", newValue);
  };

  return (
    <div className="space-y-2 ">
      <Label htmlFor="devise">Devise</Label>

      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full ${
            error
              ? "border-destructive focus:ring-destructive "
              : "border-border"
          }`}
        >
          <SelectValue placeholder="Sélectionnez une devise" />
        </SelectTrigger>

        <SelectContent className="max-h-60">
          {/* Search box */}
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Rechercher (code, nom, symbole)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()} // prevent Select from closing
              className="h-9 bg-background"
              disabled={disabled}
            />
          </div>

          {/* Currency items */}
          {filtered.length > 0 ? (
            filtered.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-muted-foreground">
                    ({currency.symbol})
                  </span>
                  <span className="text-sm text-muted-foreground">
                    - {currency.name}
                  </span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Aucun résultat
            </div>
          )}
        </SelectContent>
      </Select>

      {error && <InputError message={error} className="mt-1" />}
    </div>
  );
}
