"use server";

import { CurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { storeFormType, storeSchema } from "@/lib/zodValidation";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

interface UpdateStoreInput {
  id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  tagline?: string;
  logo?: string | null;
  logoKey?: string | null;
  bannerImage?: string | null;
  bannerKey?: string | null;
  isActive: boolean;
  emailNotificationsEnabled: boolean;
}

export const createStoreAction = async (values: storeFormType) => {
  const user = await CurrentUser();
  if (!user) return { error: "Unauthorized access" };

  try {
    // Only sellers can create a store
    if (user.role !== "SELLER") {
      return { error: "Only sellers can create a store" };
    }

    const validated = storeSchema.safeParse(values);
    if (!validated.success) return { error: "Invalid store data" };

    const { name, description, location, logo } = validated.data;

    // Seller must not already have a store
    const existingStore = await prisma.store.findUnique({
      where: { userId: user.id },
    });

    if (existingStore) {
      return {
        error: "You already created a store. You can't create more than one.",
      };
    }

    if (!user.id) return { error: "Invalid user account" };

    // Create new store
    await prisma.store.create({
      data: {
        name,
        description,
        location,
        logo,
        userId: user.id,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        isActive: true,
      },
    });

    revalidatePath("/market-place/dashboard/seller/store");

    return { success: "Store created successfully!" };
  } catch (error) {
    console.error("Error creating store", error);
    return { error: "Something went wrong while creating the store" };
  }
};

export const UpdateStoreAction = async (values: UpdateStoreInput) => {
  const user = await CurrentUser();
  if (!user) return { error: "Unauthorized access" };

  try {
    const store = await prisma.store.findUnique({
      where: { id: values.id },
    });

    if (!store) return { error: "Store not found" };

    // If user is not the owner
    if (store.userId !== user.id) {
      return { error: "Unauthorized — not your store" };
    }

    // Detect logo change
    const newLogoUrl = values.logo;
    const isLogoChanged = newLogoUrl && newLogoUrl !== store.logo;

    // Delete old logo from UploadThing if changed
    if (isLogoChanged && store.logoKey) {
      try {
        await utapi.deleteFiles([store.logoKey]);
      } catch {
        console.error("⚠ Failed to delete previous logo from UploadThing");
      }
    }

    /** BANNER CLEANUP IF UPDATED */
    const newBannerUrl = values.bannerImage;
    const bannerChanged = newBannerUrl && newBannerUrl !== store.bannerImage;
    if (bannerChanged && store.bannerKey) {
      try {
        await utapi.deleteFiles([store.bannerKey]);
      } catch {
        console.warn("⚠ Failed to delete previous banner");
      }
    }

    // Update DB
    await prisma.store.update({
      where: { id: values.id },
      data: {
        name: values.name,
        description: values.description,
        location: values.location,
        address: values.address ?? null,
        tagline: values.tagline ?? null,

        logo: newLogoUrl ?? null,
        logoKey: values.logoKey ?? null,

        bannerImage: values.bannerImage ?? null,
        bannerKey: values.bannerKey ?? null,

        isActive: values.isActive,
        emailNotificationsEnabled: values.emailNotificationsEnabled,
      },
    });

    revalidatePath("/market-place/dashboard/seller/store");
    revalidatePath(`/store/${store.slug}`);

    return { success: "Store updated successfully!" };
  } catch (error) {
    console.error("Error updating store:", error);
    return { error: "Something went wrong while updating the store" };
  }
};
