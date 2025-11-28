import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import InputError from "../InputError";

export default function ServiceSelect({
  services = [],
  value = "",
  disabled = false,
  error,
  onChange,
}) {
  const [search, setSearch] = useState("");

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* <Label htmlFor="service" className="text-foreground">
        Service
      </Label> */}
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(val) => onChange?.(val)}
      >
        <SelectTrigger className="mt-1 w-full border border-border bg-background text-foreground hover:border-primary focus:ring-2 focus:ring-ring transition-colors">
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>

        <SelectContent className="z-50 max-h-60 overflow-auto rounded-lg shadow-md border border-border bg-popover text-popover-foreground">
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Search for a service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              disabled={disabled}
            />
          </div>

          {filtered.length ? (
            filtered.map((service) => (
              <SelectItem
                key={service.id}
                value={service.id}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{service.name}</span>
                  <span className="text-muted-foreground">
                    ${service.price}
                  </span>
                </span>
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-muted-foreground">No results</div>
          )}
        </SelectContent>
      </Select>

      {error && (
        <InputError message={error} className="mt-1 text-destructive" />
      )}
    </div>
  );
}
