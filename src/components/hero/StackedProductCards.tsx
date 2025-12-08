"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type ProductCard = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
};

export default function StackedProductCards({
  products,
}: {
  products: ProductCard[];
}) {
  const [visibleCards, setVisibleCards] = useState<ProductCard[]>([]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Motion values for max 3 cards
  const motionValues = Array.from({ length: 3 }).map(() => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-50, 50], [10, -10]);
    const rotateY = useTransform(x, [-50, 50], [-10, 10]);
    return { x, y, rotateX, rotateY };
  });

  useEffect(() => {
    setVisibleCards(products.slice(0, cardsToShow));
  }, [products, cardsToShow]);

  useEffect(() => {
    if (!products.length) return;

    const interval = setInterval(() => {
      setVisibleCards((prev) => {
        const nextIndex = (index + 1) % products.length;
        setIndex(nextIndex);
        const nextProduct = products[nextIndex];
        const filteredPrev = prev
          .slice(1)
          .filter((p) => p.id !== nextProduct.id);
        return [...filteredPrev, nextProduct].slice(-cardsToShow);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [index, cardsToShow, products]);

  return (
    <div className="relative flex justify-center md:justify-end items-center h-[480px] w-full overflow-visible">
      <AnimatePresence initial={false}>
        {visibleCards.map((product, i) => {
          const isTopCard = i === visibleCards.length - 1;
          const tilt = motionValues[i]; // safe, always exists

          return (
            <motion.div
              key={`${product.id}-${i}`}
              className="absolute w-[280px] md:w-[300px] lg:w-[320px] h-[400px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 cursor-pointer"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: i * 25 + (hovered && !isTopCard ? 10 : 0),
                x: i * -35,
                scale: isTopCard && hovered === i ? 1.05 : 1 - i * 0.05,
                zIndex: visibleCards.length - i,
              }}
              exit={{
                opacity: 0,
                y: -50,
                scale: 0.9,
                transition: { duration: 0.6 },
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }}
              onMouseMove={(e) => {
                if (isTopCard) {
                  const bounds = (
                    e.currentTarget as HTMLDivElement
                  ).getBoundingClientRect();
                  const posX = e.clientX - bounds.left - bounds.width / 2;
                  const posY = e.clientY - bounds.top - bounds.height / 2;
                  tilt.x.set(posX / 10);
                  tilt.y.set(posY / 10);
                }
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => {
                setHovered(null);
                tilt.x.set(0);
                tilt.y.set(0);
              }}
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover w-full h-[220px]"
                  loading="lazy"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {product.description}
                </p>
                <p className="font-bold text-primary text-lg">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              {isTopCard && (
                <Link
                  href={`/product/${product.id}`}
                  className="absolute inset-0 z-20"
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
