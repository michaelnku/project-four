"use server";

import { CurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export const getCurrentUserProfile = async () => {
  const authUser = await CurrentUser();
  if (!authUser) return null;

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      //  userAddress: true,
      profileImage: true,
    },
  });

  return user;
};
