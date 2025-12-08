import { auth } from "@/auth/auth";

export const CurrentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const CurrentUserId = async () => {
  const session = await auth();

  return session?.user.id;
};

export const CurrentRole = async () => {
  const session = await auth();

  return session?.user.role;
};
