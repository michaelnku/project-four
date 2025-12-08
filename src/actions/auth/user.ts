"use server";

import { prisma } from "@/lib/prisma";
import {
  loggedInUserSchema,
  loggedInUserSchemaType,
  registerSchemaType,
  registerSchema,
  updateUserSchemaType,
  updateUserSchema,
} from "@/lib/zodValidation";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/components/helper/data";
import { signIn } from "@/auth/auth";
import { AuthError } from "next-auth";
import { CurrentUser } from "@/lib/currentUser";

//create user action
export const createUser = async (values: registerSchemaType) => {
  try {
    const validatedFields = registerSchema.safeParse(values);
    if (!validatedFields.success) {
      return {
        error: "Invalid user data",
      };
    }

    const { email, name, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser)
      return {
        error: "This email already exist! please login.",
      };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: "New user created!" };
  } catch (error) {
    console.error("error creating user", error);
  }
};

//login user action
export const loggedInUser = async (values: loggedInUserSchemaType) => {
  const validatedFields = loggedInUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid user data",
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password)
    return {
      error: "Invalid credentials",
    };

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      // redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    const loggedUser = await getUserByEmail(email);

    return {
      success: true,
      role: loggedUser?.role,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return {
            error: "An unknown error occured during sign-in, please try again!",
          };
      }
    }
  }

  //if all checks proceed with user login
};

//update user action
export const updateUserAction = async (values: updateUserSchemaType) => {
  try {
    const authUser = await CurrentUser();
    if (!authUser) return { error: "Unauthorized access" };

    const validated = updateUserSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Invalid form data" };
    }

    const data = validated.data;

    if (data.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existing && existing.id !== authUser.id) {
        return { error: "Email already in use by another account" };
      }
    }

    const updatePayload: any = {
      name: data.name || undefined,
      username: data.username || undefined,
      email: data.email || undefined,
      userAddress: data.userAddress || undefined,
      profileImage: data.profileImage || undefined,
    };

    if (data.password && data.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updatePayload.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: authUser.id },
      data: updatePayload,
    });

    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("ERROR UPDATING USER:", error);
    return { error: "Something went wrong while updating profile" };
  }
};
