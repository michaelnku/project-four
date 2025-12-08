"use client";

import {
  AdminSettingsPage,
  BuyerSettingsPage,
  RiderSettingsPage,
  SellerSettingsPage,
} from "./SettingsPage";
import { RiderWalletPage } from "./WalletPage";
import AdminPage from "./AdminPage";
import RiderPage from "./RiderPage";
import SellerPage from "./SellerPage";
import { useCurrentUserQuery } from "@/stores/getCurrentUser";

const RoleBasedPageContent = ({ initialUser }: { initialUser: any }) => {
  const { data: user } = useCurrentUserQuery(initialUser);

  return (
    <div>
      {user?.role === "SELLER" && <SellerPage />}
      {user?.role === "RIDER" && <RiderPage />}
      {user?.role === "ADMIN" && <AdminPage />}
    </div>
  );
};

const RoleBasedSettingsPage = ({ initialUser }: { initialUser: any }) => {
  const { data: user } = useCurrentUserQuery(initialUser);

  return (
    <div>
      {user?.role === "USER" && <BuyerSettingsPage />}
      {user?.role === "SELLER" && <SellerSettingsPage />}
      {user?.role === "RIDER" && <RiderSettingsPage />}
      {user?.role === "ADMIN" && <AdminSettingsPage />}
    </div>
  );
};

const RoleBasedWalletPage = ({ initialUser }: { initialUser: any }) => {
  const { data: user } = useCurrentUserQuery(initialUser);

  return <div>{user?.role === "RIDER" && <RiderWalletPage />}</div>;
};

export { RoleBasedPageContent, RoleBasedSettingsPage, RoleBasedWalletPage };
