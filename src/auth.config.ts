import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loggedInUserSchema } from "./lib/zodValidation";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loggedInUserSchema.safeParse(credentials);
        if (!validatedFields.success) return null;
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
