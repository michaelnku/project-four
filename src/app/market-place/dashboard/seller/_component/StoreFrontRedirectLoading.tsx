"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface Props {
  to: string;
  message?: string;
  logo?: string | null;
}

const StoreFrontRedirectLoading = ({ to, message, logo }: Props) => {
  const router = useRouter();
  const [dots, setDots] = useState(".");
  const [showCancel, setShowCancel] = useState(false);

  // animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // delay before routing
  useEffect(() => {
    const timeout = setTimeout(() => router.push(to), 1500);
    const cancelReveal = setTimeout(() => setShowCancel(true), 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(cancelReveal);
    };
  }, [to, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] gap-5 animate-fadeIn text-center px-4">
      {/* Pulsing logo */}
      <Image
        src={
          logo ??
          "https://ijucjait38.ufs.sh/f/rO7LkXAj4RVlnNw2KuOByscQRmqV3jX4rStz8G2Mv0IpxKJA"
        }
        alt="store logo"
        width={75}
        height={75}
        className="rounded-full shadow-lg animate-pulse ring-2 ring-blue-500 ring-offset-2"
      />

      <p className="text-gray-700 text-base font-medium">
        {message ?? "Loading"}
        <span>{dots}</span>
      </p>

      {/* Spinner under message */}
      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />

      {/* Cancel button (debug or safety net) */}
      {showCancel && (
        <button
          onClick={() => router.back()}
          className="text-xs text-gray-500 hover:underline mt-2"
        >
          Cancel
        </button>
      )}
    </main>
  );
};

export default StoreFrontRedirectLoading;
