"use server";

import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";

const StoreRatingSummary = async ({ storeId }: { storeId: string }) => {
  const reviews = await prisma.storeReview.findMany({
    where: { storeId },
    select: { rating: true },
  });

  if (reviews.length === 0)
    return <p className="text-gray-500 text-sm">No ratings yet</p>;

  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="flex items-center gap-1 text-yellow-500 font-medium">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= avg ? "fill-yellow-500" : ""}`}
        />
      ))}
      <span className="text-gray-600 text-sm ml-1">
        {avg.toFixed(1)} • {reviews.length} reviews
      </span>
    </div>
  );
};

export default StoreRatingSummary;
