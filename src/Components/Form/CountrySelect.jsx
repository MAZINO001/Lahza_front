
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CountrySelect({ value, onChange, error }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name",
        );
        const data = await response.json();

        // Get common names and sort alphabetically
        const names = data.map((c) => c.name.common).filter(Boolean);

        // Remove duplicates & sort
        const unique = [...new Set(names)].sort((a, b) =>
          a.localeCompare(b, "en"),
        );

        setCountries(unique);
      } catch (err) {
        console.error("Failed to load countries:", err);
        setCountries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter by whole word match from the beginning
  const filtered = countries.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase()),
  );

  return (
    <div>
      <Label htmlFor="country" className="text-sm font-medium">
        Country
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`w-full transition-colors bg-background ${
            error
              ? "border-destructive focus:ring-destructive"
              : "focus:ring-primary"
          }`}
        >
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>

        <SelectContent className="max-hp-40">
          {/* Search Input */}
          <div className="sticky top-0 p-2 z-50 border-b bg-background">
            <Input
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="h-10 text-sm"
              autoFocus
            />
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="px-3 pyp-4 text-center text-sm text-muted-foreground">
              Loading countries...
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((country) => (
              <SelectItem
                key={country}
                value={country}
                className="cursor-pointer"
              >
                {country}
              </SelectItem>
            ))
          ) : (
            <div className="px-3 pyp-4 text-center text-sm text-muted-foreground">
              No countries found
            </div>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
