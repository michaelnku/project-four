"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useNotifications,
  useReadNotification,
} from "@/hooks/useNotifications";
import { Bell } from "lucide-react";

export default function NotificationCenter() {
  const { data: notifications = [] } = useNotifications();
  const readMutation = useReadNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <Alert
          key={n.id}
          className={`cursor-pointer transition ${
            n.read ? "opacity-60" : "border-[var(--brand-blue)] bg-[#eaf6ff]"
          }`}
          onClick={() => readMutation.mutate(n.id)}
        >
          <Bell className="h-4 w-4" />
          <AlertTitle className="font-semibold">{n.title}</AlertTitle>
          <AlertDescription>{n.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
