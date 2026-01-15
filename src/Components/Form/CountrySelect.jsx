import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import InputError from "../InputError";

export default function CountrySelect({ value, onChange, error }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,translations"
        );
        const data = await response.json();

        // Prefer French name if available, fallback to English
        const names = data.map(
          (c) => c.translations?.fra?.common || c.name.common
        );

        // Remove duplicates & sort in French locale
        const unique = [...new Set(names)].sort((a, b) =>
          a.localeCompare(b, "fr")
        );

        setCountries(unique);
      } catch (err) {
        console.error("Failed to load countries:", err);
      }
    };

    fetchCountries();
  }, []);

  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Label htmlFor="pays" className="text-foreground">
        Pays
      </Label>
      <Select value={value} onValueChange={onChange}>
        {/* Trigger */}
        <SelectTrigger
          className={`mt-1 w-full border ${error ? "border-destructive" : "border-border"} bg-background text-foreground hover:border-primary focus:ring-2 focus:ring-ring transition-colors `}
        >
          <SelectValue placeholder="Sélectionnez un pays" />
        </SelectTrigger>

        {/* Dropdown */}
        <SelectContent className="z-50 max-h-60 overflow-auto rounded-lg shadow-md border border-border bg-popover text-popover-foreground ">
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Rechercher un pays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring "
            />
          </div>

          {/* Options */}
          {filtered.length ? (
            filtered.map((country, index) => (
              <SelectItem
                key={`${country}-${index}`} // React list key
                // value={`${country}-${index}`}
                value={country}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground "
              >
                {country}
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-muted-foreground">
              Aucun résultat
            </div>
          )}
        </SelectContent>
      </Select>

      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
