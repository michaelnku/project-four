import { prisma } from "./prisma";
import { pusherServer } from "./pusher";

export async function autoAssignRider(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { include: { store: true } } } },
    },
  });

  if (!order) return;

  const sellerCount = new Set(order.items.map((i) => i.product.storeId)).size;

  // 🚨 FOOD ORDERS: Deliver immediately using nearest available rider
  if (order.isFoodOrder) {
    const rider = await prisma.user.findFirst({
      where: { role: "RIDER", riderProfile: { isAvailable: true } },
    });

    if (!rider) return;

    await prisma.delivery.create({
      data: {
        orderId,
        riderId: rider.id,
        fee: order.shippingFee,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    });

    await pusherServer.trigger(`user-${order.userId}`, "rider-assigned", {
      orderId,
      riderId: rider.id,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "IN_TRANSIT",
      },
    });

    return;
  }

  // NON-FOOD ORDERS
  // If only one store → assign rider directly (skip hub)
  if (sellerCount === 1) {
    const rider = await prisma.user.findFirst({
      where: { role: "RIDER", riderProfile: { isAvailable: true } },
    });

    if (!rider) return;

    await prisma.delivery.create({
      data: {
        orderId,
        riderId: rider.id,
        fee: order.shippingFee,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    });

    await pusherServer.trigger(`user-${order.userId}`, "rider-assigned", {
      orderId,
      riderId: rider.id,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "IN_TRANSIT",
      },
    });

    return;
  }

  // MULTI-SELLER (GENERAL ITEMS)
  // ❗ Route sellers → Nexamart consolidation hub
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PROCESSING",
      isReadyForDispatch: false,
    },
  });

  // Riders will be assigned AFTER all sellerGroups are verified at hub
}
