"use server";

import { CurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export const getWishlistAction = async () => {
  const userId = await CurrentUserId();
  if (!userId) return [];

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              variants: true,
              store: {
                select: {
                  id: true,
                  userId: true,
                  name: true,
                  slug: true,
                  logo: true,
                },
              },
              category: true,
              reviews: {
                include: {
                  user: { select: { id: true, name: true, image: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!wishlist) return [];

  return wishlist.items.map((i) => i.product);
};
