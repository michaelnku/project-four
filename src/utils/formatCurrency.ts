export const formatCurrency = (
  value: number | string,
  currency: string
): string => {
  const num = Number(value);

  const currencySymbol: Record<string, string> = {
    USD: "$",
    NGN: "₦",
    EUR: "€",
  };

  const symbol = currencySymbol[currency] ?? "";

  return `${symbol}${num.toLocaleString()}`;
};
