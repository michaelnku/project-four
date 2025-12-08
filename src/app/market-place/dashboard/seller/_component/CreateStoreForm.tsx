"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, Loader2, Trash } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storeSchema, storeFormType } from "@/lib/zodValidation";
import { createStoreAction } from "@/actions/auth/store";
import { deleteLogoAction } from "@/actions/actions";

export default function CreateStoreForm() {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoKey, setLogoKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<storeFormType>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      address: "",
      logo: "",
    },
  });

  const handleDeleteLogo = async () => {
    if (!logoKey) return;
    setDeleting(true);

    try {
      await deleteLogoAction(logoKey);
      setLogoUrl(null);
      setLogoKey(null);
      form.setValue("logo", "");
      toast.success("Logo removed");
    } catch {
      toast.error("Unable to delete logo");
    }

    setDeleting(false);
  };

  const onSubmit = (values: storeFormType) => {
    startTransition(async () => {
      const res = await createStoreAction(values);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Store created successfully!");
      router.push("/market-place/dashboard/seller/store");
    });
  };

  return (
    <main className="px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 border rounded-2xl shadow p-10 space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Your Storefront</h1>
          <p className="text-sm text-muted-foreground">
            Add your brand details customers will see before ordering.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* STORE DETAILS */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">
                Store Information
              </h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nexa Fashion Hub" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (City / State)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lagos, Nigeria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup / Warehouse Address</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Full pickup or return address..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Your Store</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Tell customers what makes your store unique..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* LOGO UPLOADER */}
            <section className="space-y-4">
              <FormLabel>Store Logo</FormLabel>

              <div className="relative w-32 h-32 group mx-auto">
                {/* Logo Preview */}
                <div className="w-32 h-32 rounded-full overflow-hidden border shadow flex items-center justify-center bg-gray-100">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt="logo"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  ) : (
                    <Camera className="text-gray-400 w-10 h-10" />
                  )}
                </div>

                {/* 📌 Uploading overlay stays visible all the time */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center text-white text-xs gap-2 z-20">
                    <Loader2 className="animate-spin w-6 h-6" />
                    Uploading...
                  </div>
                )}

                {/* Hover Action Panel */}
                {!uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 text-white text-sm cursor-pointer z-10">
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={handleDeleteLogo}
                        className="flex items-center gap-1 hover:text-red-300"
                      >
                        <Trash className="w-4 h-4" /> Remove
                      </button>
                    )}

                    <UploadButton
                      endpoint="storeLogo"
                      onUploadBegin={() => setUploading(true)}
                      onClientUploadComplete={(res) => {
                        setUploading(false);
                        const file = res[0];
                        setLogoUrl(file.url);
                        setLogoKey(file.key);
                        form.setValue("logo", file.url);
                        toast.success("Logo uploaded!");
                      }}
                      appearance={{
                        button:
                          "text-xs text-white font-medium p-1 rounded hover:text-gray-200",
                        container: "flex flex-col items-center gap-1",
                      }}
                      content={{
                        button: () => (logoUrl ? "Change" : "Add Logo"),
                      }}
                    />
                  </div>
                )}
              </div>

              <FormMessage>{form.formState.errors.logo?.message}</FormMessage>
            </section>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-4 text-lg rounded-lg bg-[#146EB4] hover:bg-[#125c99] text-white font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Saving...
                </>
              ) : (
                "Create Store"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
