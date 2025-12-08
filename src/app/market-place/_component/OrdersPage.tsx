"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  {
    id: "ORD-001",
    product: "Nike Air Max 270",
    date: "2025-11-07",
    status: "Pending",
    amount: "$120.00",
  },
  {
    id: "ORD-002",
    product: "Adidas Ultraboost",
    date: "2025-11-05",
    status: "Delivered",
    amount: "$150.00",
  },
  {
    id: "ORD-003",
    product: "Puma Running Jacket",
    date: "2025-11-03",
    status: "In Process",
    amount: "$80.00",
  },
  {
    id: "ORD-004",
    product: "Apple AirPods Pro",
    date: "2025-11-01",
    status: "Cancelled",
    amount: "$250.00",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "In Process":
      return (
        <Badge className="bg-blue-500 text-white hover:bg-blue-600">
          In Process
        </Badge>
      );
    case "Delivered":
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          Delivered
        </Badge>
      );
    case "Cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const OrdersPage = () => {
  return (
    <div className="space-y-6 md:ml-62 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>

      <Card className="border border-muted">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
