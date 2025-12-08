"use server";

export async function getCurrencyRates() {
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD", {
      next: { revalidate: 60 * 60 },
    });
    const data = await res.json();

    return data.rates;
  } catch (error) {
    console.error("Currency API error:", error);
    return null;
  }
}
