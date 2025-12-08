import { prisma } from "@/lib/prisma";
import StackedProductCards from "./StackedProductCards";

export default async function StackedProductCardsWrapper() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    take: 10, // pull some random or most recent products
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!products || products.length === 0) {
    return (
      <div className="relative flex gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-[260px] h-[360px] rounded-3xl bg-gray-200 dark:bg-neutral-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // transform to what the client component expects
  const formatted = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.images[0]?.imageUrl ?? "/placeholder.png",
    price: p.basePrice,
  }));

  return <StackedProductCards products={formatted} />;
}
