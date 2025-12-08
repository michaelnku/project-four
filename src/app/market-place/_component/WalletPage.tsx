"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  Wallet,
} from "lucide-react";

/* ---------------------- RIDER WALLET ---------------------- */
const RiderWalletPage = () => {
  const walletBalance = 680;
  const recentTransactions = [
    {
      id: 1,
      type: "credit",
      amount: 25,
      description: "Delivery #452 - Completed",
      date: "2025-11-07",
    },
    {
      id: 2,
      type: "credit",
      amount: 40,
      description: "Delivery #453 - Completed",
      date: "2025-11-08",
    },
    {
      id: 3,
      type: "debit",
      amount: 100,
      description: "Withdrawal to Bank",
      date: "2025-11-09",
    },
  ];

  return (
    <main className="md:ml-64 px-4 py-16 space-y-6">
      <h2 className="text-3xl font-semibold mb-6">My Wallet</h2>

      {/* Wallet Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Available Earnings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold">
              ${walletBalance.toLocaleString()}
            </span>
          </div>
          <Button size="sm" variant="outline">
            Withdraw Earnings
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2 border rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2">
                {tx.type === "credit" ? (
                  <ArrowDown className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowUp className="w-5 h-5 text-red-500" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{tx.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {tx.date}
                  </span>
                </div>
              </div>
              <span
                className={`font-semibold ${
                  tx.type === "credit" ? "text-green-500" : "text-red-500"
                }`}
              >
                {tx.type === "credit" ? "+" : "-"}${tx.amount}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
};

export { RiderWalletPage };
