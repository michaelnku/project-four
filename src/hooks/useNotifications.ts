"use client";

import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import {
  getNotificationsAction,
  markNotificationReadAction,
} from "@/actions/notifications/notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => getNotificationsAction(),
    refetchInterval: 10000,
  });
}

export function useReadNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => markNotificationReadAction(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useUserNotifications(userId: string) {
  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("payment-success", (data: any) => {
      console.log("Payment success:", data);
    });

    channel.bind("rider-assigned", (data: any) => {
      console.log("Rider assigned:", data);
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId]);
}
