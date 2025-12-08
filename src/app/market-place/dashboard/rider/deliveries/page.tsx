"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";

const RiderDeliveriesPage = () => {
  const [activeTab, setActiveTab] = useState<string>("Pending Pickup");

  // Mock delivery data
  const deliveries = [
    {
      id: 1,
      orderId: "ORD12345",
      customer: "John Doe",
      address: "123 Main St, Lagos",
      status: "Pending Pickup",
      amount: 500,
      date: "2025-11-10",
    },
    {
      id: 2,
      orderId: "ORD12346",
      customer: "Jane Smith",
      address: "45 Victoria Island, Lagos",
      status: "In Process",
      amount: 800,
      date: "2025-11-10",
    },
    {
      id: 3,
      orderId: "ORD12347",
      customer: "Mike Johnson",
      address: "78 Ikeja, Lagos",
      status: "Completed",
      amount: 1200,
      date: "2025-11-09",
    },
    {
      id: 4,
      orderId: "ORD12348",
      customer: "Alice Brown",
      address: "12 Lekki, Lagos",
      status: "Cancelled",
      amount: 0,
      date: "2025-11-08",
    },
    {
      id: 5,
      orderId: "ORD12349",
      customer: "Tom Hanks",
      address: "34 Surulere, Lagos",
      status: "Pending Pickup",
      amount: 650,
      date: "2025-11-10",
    },
    {
      id: 6,
      orderId: "ORD12350",
      customer: "Nku Michael",
      address: "34 Surulere, Lagos",
      status: "Pending Pickup",
      amount: 20,
      date: "2025-11-10",
    },
  ];

  const tabs = ["Pending Pickup", "In Process", "Completed", "Cancelled"];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending Pickup":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "In Process":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Pickup":
        return <Clock className="w-5 h-5" />;
      case "In Process":
        return <Truck className="w-5 h-5" />;
      case "Completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const filteredDeliveries = deliveries.filter((d) => d.status === activeTab);

  const deliveryStats = tabs.map((tab) => ({
    status: tab,
    count: deliveries.filter((d) => d.status === tab).length,
  }));

  const totalEarnings = deliveries
    .filter((d) => d.status === "Completed")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <main className="min-h-screen">
      <main className="md:ml-62 py-12 p-2 space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          My Deliveries
        </h2>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-3 sm:grid-cols-2  gap-4 pb-2">
          <Card className="flex-shrink-0 flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-700" />
              <span className="font-medium text-sm md:text-base">
                Total Earnings
              </span>
            </div>
            <span className="text-xl md:text-2xl font-bold">
              ${totalEarnings}
            </span>
          </Card>

          {deliveryStats.map((stat) => (
            <Card
              key={stat.status}
              className="flex-shrink-0 flex flex-col items-center p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(stat.status)}
                <span className="font-medium text-sm md:text-base">
                  {stat.status}
                </span>
              </div>
              <span className="text-xl md:text-2xl font-bold">
                {stat.count}
              </span>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Delivery Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredDeliveries.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center">
              No deliveries in this category.
            </p>
          ) : (
            filteredDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className="hover:shadow transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span>{delivery.orderId}</span>
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-semibold ${getStatusStyle(
                        delivery.status
                      )}`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(delivery.status)}
                        {delivery.status}
                      </div>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm sm:text-base">
                  <div>
                    <span className="font-medium">Customer:</span>{" "}
                    {delivery.customer}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {delivery.address}
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> $
                    {delivery.amount}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {delivery.date}
                  </div>
                  {delivery.status === "Pending Pickup" && (
                    <Button size="sm" className="mt-2 w-full sm:w-auto">
                      Start Delivery
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </main>
  );
};

export default RiderDeliveriesPage;
