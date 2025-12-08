"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function StoreMaintenancePage({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <Image
        src="https://ijucjait38.ufs.sh/f/rO7LkXAj4RVlnNw2KuOByscQRmqV3jX4rStz8G2Mv0IpxKJA"
        alt="Maintenance"
        width={160}
        height={160}
        className="opacity-80 border rounded-md"
      />

      <h1 className="text-2xl font-bold text-gray-800">
        🛑 Your Store is Offline
      </h1>

      <p className="text-gray-600 max-w-md">
        Customers can't view your storefront right now. Turn it on from your
        Dashboard to make it public again.
      </p>

      <Button
        className="mt-3"
        onClick={() => router.push(`/market-place/dashboard/seller/settings`)}
      >
        Go to Store Settings
      </Button>

      <Button variant="link" onClick={() => router.push(`/store/${slug}`)}>
        Try Again
      </Button>
    </main>
  );
}
