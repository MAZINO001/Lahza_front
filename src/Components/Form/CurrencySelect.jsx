/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { useRegisterStore } from "@/hooks/registerStore";
// import { useForm } from "react-hook-form";

// // ErrorMessage component - replace with your actual component
// function ErrorMessage({ errors, field }) {
//   if (!errors?.[field]) return null;
//   return <p className="text-sm text-red-500 mt-1">{errors[field]}</p>;
// }

// // 30 most common currencies worldwide
// const COMMON_CURRENCIES = [
//   { code: "USD", name: "Dollar américain", symbol: "$" },
//   { code: "EUR", name: "Euro", symbol: "€" },
//   { code: "MAD", name: "Dirham marocain", symbol: "د.م." },
// ];

// export default function CurrencySelect({ value, onChange, errors }) {
//   const [search, setSearch] = useState("");

//   const registerStore = useRegisterStore();
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { error },
//   } = useForm({
//     defaultValues: registerStore,
//   });

//   const filtered = COMMON_CURRENCIES.filter((c) => {
//     const searchLower = search.toLowerCase();
//     return (
//       c.code.toLowerCase().includes(searchLower) ||
//       c.name.toLowerCase().includes(searchLower) ||
//       c.symbol.includes(search)
//     );
//   });

//   return (
//     <div>
//       <Label htmlFor="devise" className="text-foreground">
//         Devise
//       </Label>
//       <Select value={value} onValueChange={onChange}>
//         {/* Trigger */}
//         <SelectTrigger className="mt-1 w-full border border-border bg-background text-foreground hover:border-primary focus:ring-2 focus:ring-ring transition-colors">
//           <SelectValue placeholder="Sélectionnez une devise" />
//         </SelectTrigger>

//         {/* Dropdown */}
//         <SelectContent className="z-50 max-h-60 overflow-auto rounded-lg shadow-md border border-border bg-popover text-popover-foreground">
//           {/* Search Input */}
//           <div className="p-2 border-b border-border">
//             <Input
//               placeholder="Rechercher (code, nom, symbole)..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={(e) => e.stopPropagation()}
//               className="w-full bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
//             />
//           </div>

//           {/* Options */}
//           {filtered.length ? (
//             filtered.map((currency) => (
//               <SelectItem
//                 key={currency.code}
//                 value={currency.code}
//                 className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
//               >
//                 <span className="flex items-center gap-2">
//                   <span className="font-semibold">{currency.code}</span>
//                   <span className="text-muted-foreground">
//                     ({currency.symbol})
//                   </span>
//                   <span className="text-sm">- {currency.name}</span>
//                 </span>
//               </SelectItem>
//             ))
//           ) : (
//             <div className="px-3 py-2 text-muted-foreground">
//               Aucun résultat
//             </div>
//           )}
//         </SelectContent>
//       </Select>

//       {errors && <ErrorMessage errors={errors} field="devise" />}
//     </div>
//   );
// }

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

// ErrorMessage component
function ErrorMessage({ errors, field }) {
  if (!errors?.[field]) return null;
  return <p className="text-sm text-red-500 mt-1">{errors[field]}</p>;
}

const COMMON_CURRENCIES = [
  { code: "USD", name: "Dollar américain", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "MAD", name: "Dirham marocain", symbol: "د.م." },
];

export default function CurrencySelect({ value, disabled = false, errors }) {
  const [search, setSearch] = useState("");
  const registerStore = useRegisterStore();

  // Filter currencies by search
  const filtered = COMMON_CURRENCIES.filter((c) => {
    const searchLower = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(searchLower) ||
      c.name.toLowerCase().includes(searchLower) ||
      c.symbol.includes(search)
    );
  });

  // Whenever value changes, update Zustand store
  useEffect(() => {
    if (value) registerStore.setField("currency", value);
  }, [value]);

  return (
    <div>
      <Label htmlFor="devise" className="text-foreground">
        Devise
      </Label>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(val) => {
          registerStore.setField("currency", val); // update Zustand
        }}
      >
        <SelectTrigger className="mt-1 w-full border border-border bg-background text-foreground hover:border-primary focus:ring-2 focus:ring-ring transition-colors">
          <SelectValue placeholder="Sélectionnez une devise" />
        </SelectTrigger>

        <SelectContent className="z-50 max-h-60 overflow-auto rounded-lg shadow-md border border-border bg-popover text-popover-foreground">
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Rechercher (code, nom, symbole)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              disabled={disabled} // optional: disable search if select is disabled
            />
          </div>

          {filtered.length ? (
            filtered.map((currency) => (
              <SelectItem
                key={currency.code}
                value={currency.code}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{currency.code}</span>
                  <span className="text-muted-foreground">
                    ({currency.symbol})
                  </span>
                  <span className="text-sm">- {currency.name}</span>
                </span>
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-muted-foreground">
              Aucun résultat
            </div>
          )}
        </SelectContent>
      </Select>

      {errors && <ErrorMessage errors={errors} field="devise" />}
    </div>
  );
}
