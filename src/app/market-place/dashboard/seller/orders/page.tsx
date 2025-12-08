import { prisma } from "@/lib/prisma";
import { CurrentUser } from "@/lib/currentUser";
import SellerOrdersTable from "./SellerOrdersTable";

export default async function SellerOrdersPage() {
  const user = await CurrentUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { sellerId: user.id },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <SellerOrdersTable orders={orders} />;
}
