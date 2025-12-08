"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const RiderEarningsPage = () => {
  // Mock data for chart
  const earningsData = [
    { day: "Mon", amount: 80 },
    { day: "Tue", amount: 100 },
    { day: "Wed", amount: 60 },
    { day: "Thu", amount: 120 },
    { day: "Fri", amount: 90 },
    { day: "Sat", amount: 150 },
    { day: "Sun", amount: 130 },
  ];

  // Mock completed deliveries
  const recentDeliveries = [
    {
      id: 1,
      orderId: "ORD12345",
      customer: "John Doe",
      amount: 500,
      date: "2025-11-09",
    },
    {
      id: 2,
      orderId: "ORD12346",
      customer: "Jane Smith",
      amount: 750,
      date: "2025-11-08",
    },
    {
      id: 3,
      orderId: "ORD12347",
      customer: "Mike Johnson",
      amount: 900,
      date: "2025-11-07",
    },
  ];

  const totalEarnings = recentDeliveries.reduce((sum, d) => sum + d.amount, 0);

  return (
    <main className="min-h-screen">
      <main className="md:ml-64 px-4 py-12 space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Earnings Overview
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex flex-col items-center light:bg-green-50 border border-green-200 w-40">
            <DollarSign className="text-green-600 w-6 h-6 mb-2" />
            <CardTitle>Total Earnings</CardTitle>
            <p className="text-2xl font-bold mt-1">${totalEarnings}</p>
          </Card>

          <Card className="p-4 flex flex-col items-center light:bg-blue-50 border border-blue-200 w-40">
            <TrendingUp className="text-blue-600 w-6 h-6 mb-2" />
            <CardTitle>This Week</CardTitle>
            <p className="text-2xl font-bold mt-1">$630</p>
          </Card>

          <Card className="p-4 flex flex-col items-center light:bg-purple-50 border border-purple-200 w-40">
            <Calendar className="text-purple-600 w-6 h-6 mb-2" />
            <CardTitle>This Month</CardTitle>
            <p className="text-2xl font-bold mt-1">$2,740</p>
          </Card>

          <Card className="p-4 flex flex-col items-center light:bg-yellow-50 border border-yellow-200 w-40">
            <CreditCard className="text-yellow-600 w-6 h-6 mb-2" />
            <CardTitle>Pending Payout</CardTitle>
            <p className="text-2xl font-bold mt-1">$210</p>
          </Card>
        </div>

        {/* Earnings Chart */}
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Earnings</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#16a34a" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deliveries */}
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-gray-600">
                    <tr>
                      <th className="py-2 px-4">Order ID</th>
                      <th className="py-2 px-4">Customer</th>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeliveries.map((delivery) => (
                      <tr
                        key={delivery.id}
                        className="border-b hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-2 px-4 font-medium">
                          {delivery.orderId}
                        </td>
                        <td className="py-2 px-4">{delivery.customer}</td>
                        <td className="py-2 px-4">{delivery.date}</td>
                        <td className="py-2 px-4 font-semibold text-green-600">
                          ${delivery.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </main>
  );
};

export default RiderEarningsPage;
