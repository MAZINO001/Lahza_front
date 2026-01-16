/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  currencies,
  convertCurrency,
  formatCurrency,
} from "@/lib/utils/formatCurrency";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem("selectedCurrency") || "EUR";
  });

  useEffect(() => {
    localStorage.setItem("selectedCurrency", selectedCurrency);
  }, [selectedCurrency]);

  const convertAmount = (amount, fromCurrency = "EUR") => {
    return convertCurrency(amount, fromCurrency, selectedCurrency);
  };

  const formatAmount = (amount, fromCurrency = "EUR") => {
    const convertedAmount = convertAmount(amount, fromCurrency);
    return formatCurrency(convertedAmount, selectedCurrency);
  };

  const value = {
    selectedCurrency,
    setSelectedCurrency,
    convertAmount,
    formatAmount,
    currencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default function CurrencyToggle() {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

  const currentCurrency =
    currencies.find((curr) => curr.code === selectedCurrency) || currencies[0];

  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          size="sm"
          className="px-2 gap-2 border  border-border rounded-md flex items-center justify-center"
        >
          <div className="hidden sm:flex gap-4 w-full">
            <p>{currentCurrency.symbol}</p>
            <p>{currentCurrency.code}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className={selectedCurrency === currency.code ? "bg-accent" : ""}
          >
            <div className="flex items-center justify-between w-full">
              <span className="mr-2">{currency.symbol}</span>
              <span>{currency.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
