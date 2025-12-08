"use client";

import Footer from "@/components/layout/Footer";
import MarketPlaceNavbar from "@/components/layout/MarketPlaceNavbar";
import SiteNavbar from "@/components/layout/NavBar";
import { useCurrentUser } from "@/hooks/getCurrentUser";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();

  const isMarketplaceDashboard =
    user?.role === "SELLER" || user?.role === "RIDER" || user?.role === "ADMIN";

  return (
    <>
      <main>
        {!user && <SiteNavbar initialUser={user} />}
        {user?.role === "USER" && <SiteNavbar initialUser={user} />}
        {isMarketplaceDashboard && <MarketPlaceNavbar initialUser={user} />}
        {children}
        <Footer />
      </main>
    </>
  );
}
