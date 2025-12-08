"use client";

import MarketPlaceNavbar from "@/components/layout/MarketPlaceNavbar";
import { DashboardSidebar } from "../_component/SideNavbar";
import { useCurrentUser } from "@/hooks/getCurrentUser";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();

  // in marketplace layout
  if (user?.role === "USER") redirect("/");

  return (
    <div>
      {/* TOP NAVBAR */}
      <MarketPlaceNavbar initialUser={user} />

      <div className="flex">
        {/* LEFT SIDEBAR */}
        <DashboardSidebar initialUser={user} />

        {/* MAIN CONTENT */}
        <main className="flex-1 ml-0 md:ml-64 px-6 py-4">{children}</main>
      </div>
    </div>
  );
}
