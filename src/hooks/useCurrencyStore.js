// stores/useCurrencyStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { convertCurrency, formatCurrency } from "@/lib/utils/formatCurrency";

export const currencies = [
  {
    code: "EUR",
    symbol: "€",
    flag: "🇪🇺",
    short: "EUR",
  },
  {
    code: "USD",
    symbol: "$",
    flag: "🇺🇸",
    short: "USD",
  },
  {
    code: "MAD",
    symbol: "د.م.",
    flag: "🇲🇦",
    short: "MAD",
  },
];

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      selectedCurrency: 'EUR',
      
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
      
      // Convert amount from one currency to selected
      convertAmount: (amount, fromCurrency = 'EUR') => {
        const { selectedCurrency } = get();
        return convertCurrency(amount, fromCurrency, selectedCurrency);
      },
      
      // Format amount with currency symbol
      formatAmount: (amount, fromCurrency = 'EUR') => {
        const { selectedCurrency, convertAmount } = get();
        const converted = convertAmount(amount, fromCurrency);
        return formatCurrency(converted, selectedCurrency);
      },
      
      // Get current currency object
      getCurrentCurrency: () => {
        const { selectedCurrency } = get();
        return currencies.find((c) => c.code === selectedCurrency) ?? currencies[0];
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);

