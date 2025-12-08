import { prisma } from "@/lib/prisma";
import PublicProductCard from "@/components/product/PublicProductCard";
import { CurrentUserId } from "@/lib/currentUser";

export default async function ProductFeed() {
  const userId = await CurrentUserId();

  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: {
      images: true,
      variants: true,
      store: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center w-full">
        <p className="text-gray-500 text-lg">
          No products available at the moment.
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Check back later — new items are being added.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <PublicProductCard
          key={product.id}
          product={product}
          userId={userId}
          isWishlisted={false}
        />
      ))}
    </div>
  );
}
