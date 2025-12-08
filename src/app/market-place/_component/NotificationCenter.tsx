"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Order Confirmed",
      message:
        "Your recent order #12345 has been confirmed and is being processed.",
      icon: CheckCircle2,
    },
    {
      id: 2,
      type: "info",
      title: "New Feature!",
      message: "You can now track your packages directly from your dashboard.",
      icon: Info,
    },
    {
      id: 3,
      type: "warning",
      title: "Low Balance",
      message:
        "Your wallet balance is running low. Please top up to continue shopping.",
      icon: AlertTriangle,
    },
    {
      id: 4,
      type: "error",
      title: "Payment Failed",
      message:
        "There was a problem processing your last payment. Try again later.",
      icon: XCircle,
    },
  ]);

  const handleDismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // We’ll use variant only for destructive vs. default,
  // and use custom Tailwind styles for the others.
  const getAlertStyle = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "info":
        return "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
      case "warning":
        return "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case "error":
        return "border-destructive/50 text-destructive dark:border-red-900";
      default:
        return "";
    }
  };

  return (
    <main className="max-w-3xl mx-auto md:ml-62 px-4 py-12 space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      <AnimatePresence>
        {notifications.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground text-center"
          >
            No notifications at the moment.
          </motion.p>
        ) : (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Alert
                  variant={
                    notification.type === "error" ? "destructive" : "default"
                  }
                  className={`flex items-start justify-between gap-3 relative border-l-4 ${getAlertStyle(
                    notification.type
                  )}`}
                >
                  <div className="flex gap-3">
                    <Icon className="h-5 w-5 mt-1" />
                    <div>
                      <AlertTitle>{notification.title}</AlertTitle>
                      <AlertDescription>
                        {notification.message}
                      </AlertDescription>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleDismiss(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Alert>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </main>
  );
};

export default NotificationCenter;
