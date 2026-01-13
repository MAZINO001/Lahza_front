// Currency conversion rates (base currency: EUR)
export const conversionRates = {
    EUR: 1,
    MAD: 10, // 1 EUR = 10 MAD (simplified rate as requested)
    USD: 1.1,
};

export const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
];

/**
 * Convert amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} - Converted amount
 */
export const convertCurrency = (amount, fromCurrency = 'EUR', toCurrency = 'EUR') => {
    if (fromCurrency === toCurrency) return amount;

    // First convert to EUR (base currency)
    const amountInEUR = amount / conversionRates[fromCurrency];

    // Then convert from EUR to target currency
    return amountInEUR * conversionRates[toCurrency];
};

/**
 * Format currency amount with symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'EUR') => {
    const currencyInfo = currencies.find(c => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;

    // Format with 2 decimal places for all currencies
    const formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `${symbol}${formattedAmount}`;
};