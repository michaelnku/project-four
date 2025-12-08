export function convertPrice(
  amount: number,
  baseCurrency: string,
  targetCurrency: string,
  rates: any
) {
  if (!rates) return amount;
  if (baseCurrency === targetCurrency) return amount;

  const baseToUsd = amount / rates[baseCurrency];
  return baseToUsd * rates[targetCurrency];
}
