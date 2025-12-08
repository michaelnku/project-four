import ProductPublicDetail from "@/components/product/PublicProductDetail";
import { CurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export default async function Page(props: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await props.params;
  const userId = await CurrentUserId();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      variants: true,
      store: {
        select: { id: true, userId: true, slug: true, name: true, logo: true },
      },
      reviews: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!product) return <div>Product not found</div>;

  const wishlistCount = await prisma.wishlistItem.count({
    where: { productId },
  });

  const isWishlisted = userId
    ? !!(await prisma.wishlistItem.findFirst({
        where: { productId, wishlist: { userId } },
      }))
    : false;

  const cart = userId
    ? await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      })
    : null;

  return (
    <ProductPublicDetail
      data={product}
      isWishlisted={isWishlisted}
      cartItems={cart?.items ?? []}
      userId={userId}
    />
  );
}
