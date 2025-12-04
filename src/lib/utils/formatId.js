const f = (id, padding = 4) => String(id || "").padStart(padding, "0");

export const formatQuote = (id) => `QUOTE-${f(id)}`;
export const formatInvoice = (id) => `INVOICE-${f(id)}`;
export const formatPayment = (id) => `PAYMENT-${f(id)}`;
export const formatClient = (id) => `CLIENT-${f(id)}`;
export const formatOrder = (id) => `ORDER-${f(id)}`;
export const formatTicket = (id) => `TICKET-${f(id)}`;

// Bonus: generic one
export const formatId = (id, prefix = "ID", padding = 5) =>
  `${prefix.toUpperCase()}-${f(id, padding)}`;