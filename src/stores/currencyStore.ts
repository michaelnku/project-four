"use client";

import { create } from "zustand";

type CurrencyStore = {
  currency: string;
  rates: Record<string, number>;
  setCurrency: (currency: string) => void;
  setRates: (rates: Record<string, number>) => void;
};

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: "USD",
  rates: {},
  setCurrency: (currency) => set({ currency }),
  setRates: (rates) => set({ rates }),
}));
