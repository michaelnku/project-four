"use client";

import { toast } from "sonner";

export const useWishlistToast = () => {
  return {
    added: () => toast.success("Added to wishlist ❤️"),
    removed: () => toast.success("Removed from wishlist 💔"),
    loginRequired: () => toast.error("Login to use wishlist"),
    error: () => toast.error("Something went wrong"),
  };
};
