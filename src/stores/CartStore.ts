import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartItem = {
  productId: string;
  quantity: number;
  variantId?: string;
};

type CartState = {
  items: CartItem[];
  add: (productId: string) => void;
  change: (productId: string, delta: number) => void;
  remove: (productId: string) => void;
  sync: (items: CartItem[]) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (productId) =>
        set((state) => {
          const item = state.items.find((i) => i.productId === productId);
          return item
            ? {
                items: state.items.map((i) =>
                  i.productId === productId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                ),
              }
            : {
                items: [...state.items, { productId, quantity: 1 }],
              };
        }),

      change: (productId, delta) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + delta }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId)),
        })),

      sync: (items) => set({ items }),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
