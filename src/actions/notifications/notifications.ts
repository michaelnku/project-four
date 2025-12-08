"use server";

import { prisma } from "@/lib/prisma";
import { CurrentUserId } from "@/lib/currentUser";

export async function getNotificationsAction() {
  const userId = await CurrentUserId();
  if (!userId) return [];

  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationReadAction(id: string) {
  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}
