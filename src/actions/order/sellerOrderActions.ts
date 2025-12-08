"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const acceptOrderAction = async (orderId: string) => {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" },
    });
    revalidatePath("/market-place/dashboard/seller/orders");
    return { success: "Order accepted" };
  } catch {
    return { error: "Failed to accept order" };
  }
};

export const shipOrderAction = async (orderId: string) => {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" },
    });
    revalidatePath("/market-place/dashboard/seller/orders");
    return { success: "Order marked as shipped" };
  } catch {
    return { error: "Failed to update order" };
  }
};

export const cancelOrderAction = async (orderId: string) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    // Refund buyer automatically
    await prisma.wallet.update({
      where: { userId: order.userId },
      data: {
        balance: { increment: order.totalAmount },
        transactions: {
          create: {
            type: "REFUND",
            amount: order.totalAmount,
            description: `Refund for cancelled order #${order.id}`,
          },
        },
      },
    });

    revalidatePath("/market-place/dashboard/seller/orders");
    return { success: "Order cancelled & refund issued" };
  } catch {
    return { error: "Failed to cancel order" };
  }
};
