"use client";

import { useQuery } from "@tanstack/react-query";

export function useCurrentUserQuery(initialUser?: any) {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/current-user", { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    initialData: initialUser,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
