"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  productId: string;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  sync: (items: WishlistItem[]) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],

      toggle: (productId) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === productId);
          return exists
            ? { items: state.items.filter((i) => i.productId !== productId) }
            : { items: [...state.items, { productId }] };
        }),

      add: (productId) =>
        set((state) =>
          state.items.some((i) => i.productId === productId)
            ? state
            : { items: [...state.items, { productId }] }
        ),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      sync: (items) => set({ items }),

      clear: () => {
        set({ items: [] });
        localStorage.removeItem("wishlist-store");
      },
    }),
    {
      name: "wishlist-store",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
