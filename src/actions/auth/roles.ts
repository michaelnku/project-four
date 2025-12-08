"use server";

import { prisma } from "@/lib/prisma";
import { CurrentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export async function becomeSellerAction() {
  const user = await CurrentUser();
  if (!user) return redirect("/seller/login");

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "SELLER" },
  });

  return redirect("/market-place/dashboard/seller");
}

export async function becomeRiderAction() {
  const user = await CurrentUser();
  if (!user) return redirect("/rider/login");

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "RIDER" },
  });

  return redirect("/market-place/dashboard/rider");
}
