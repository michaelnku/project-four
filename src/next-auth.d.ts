import { UserRole } from "@/generated/prisma/client";
import { DefaultSession } from "next-auth";

export type Extendeduser = DefaultSession["user"] & {
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: Extendeduser;
  }
}
