export type Permission =
  | "PRODUCT_CREATE"
  | "PRODUCT_UPDATE"
  | "PRODUCT_DELETE"
  | "ORDER_ACCEPT"
  | "ORDER_CANCEL"
  | "ORDER_SHIP"
  | "PAYOUT_REQUEST"
  | "VIEW_FINANCES"
  | "MANAGE_USERS"; // admin only

export type UserRole = "USER" | "ADMIN" | "SELLER" | "RIDER";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: [],

  SELLER: [
    "PRODUCT_CREATE",
    "PRODUCT_UPDATE",
    "PRODUCT_DELETE",
    "ORDER_ACCEPT",
    "ORDER_CANCEL",
    "ORDER_SHIP",
    "PAYOUT_REQUEST",
    "VIEW_FINANCES",
  ],

  RIDER: ["ORDER_SHIP"],

  ADMIN: [
    "PRODUCT_CREATE",
    "PRODUCT_UPDATE",
    "PRODUCT_DELETE",
    "ORDER_ACCEPT",
    "ORDER_CANCEL",
    "ORDER_SHIP",
    "PAYOUT_REQUEST",
    "VIEW_FINANCES",
    "MANAGE_USERS",
  ],
};
