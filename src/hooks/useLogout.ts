import { useCartStore } from "@/stores/CartStore";
import { useWishlistStore } from "@/stores/WishlistStore";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return async () => {
    //queryClient.resetQueries();
    queryClient.clear();

    useCartStore.getState().clear?.();
    useWishlistStore.getState().clear?.();

    localStorage.removeItem("cart-store");
    localStorage.removeItem("wishlist-store");

    queryClient.resetQueries({ queryKey: ["wishlist"] });
    queryClient.resetQueries({ queryKey: ["cart"] });

    await signOut({ callbackUrl: "/" });
  };
};
