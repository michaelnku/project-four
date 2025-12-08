"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateUserSchema, updateUserSchemaType } from "@/lib/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import ProfileUpload from "@/components/profile/ProfileUpload";
import { updateUserAction } from "@/actions/auth/user";
import { toast } from "sonner";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

const ProfilePage = ({
  initialUser,
}: {
  initialUser: {
    name: string | null;
    username: string | null;
    email: string | null;
    userAddress: string | null;
    profileImage: string | null;
  } | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const form = useForm<updateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      userAddress: "",
      email: "",
      profileImage: "",
      password: "",
      confirmPassword: "",
    },
  });

  const previousValues = useRef(initialUser);

  const hasChanges = () => {
    const current = form.getValues();
    const original = previousValues.current;

    if (!original) return false;

    return (
      current.name !== (original.name || "") ||
      current.username !== (original.username || "") ||
      current.email !== (original.email || "") ||
      current.userAddress !== (original.userAddress || "") ||
      current.profileImage !== (original.profileImage || "") ||
      (current.password && current.password.trim() !== "")
    );
  };

  useEffect(() => {
    if (initialUser) {
      form.reset({
        name: initialUser.name || "",
        username: initialUser.username || "",
        email: initialUser.email || "",
        userAddress: initialUser.userAddress || "",
        profileImage: initialUser.profileImage || "",
        password: "",
        confirmPassword: "",
      });

      setLoading(false);
    }
  }, [initialUser]);

  const handleSubmit = (data: updateUserSchemaType) => {
    startTransition(async () => {
      toast.loading("Updating profile...", { id: "update" });

      const res = await updateUserAction(data);

      if (res?.error) {
        toast.error(res.error, { id: "update" });
        return;
      }

      if (res?.success) {
        toast.success(res.success, { id: "update" });

        // Reset previous values to the new ones
        previousValues.current = {
          ...previousValues.current,
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          userAddress: data.userAddress || "",
          profileImage: data.profileImage || "",
        };

        // Reset password fields
        form.setValue("password", "");
        form.setValue("confirmPassword", "");

        form.clearErrors();
      }
    });
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <main className="md:ml-62">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              {/* Avatar shown from form value */}

              {/* Upload button here */}
              <ProfileUpload
                initialImage={form.watch("profileImage")}
                onUpload={(url) => form.setValue("profileImage", url)}
              />
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid md:grid-cols-2 gap-4"
            >
              {/* Name */}
              <FormField
                control={form.control}
                disabled={isPending}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                disabled={isPending}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                disabled={isPending}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seller@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                disabled={isPending}
                name="userAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>My Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                disabled={isPending}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                disabled={isPending}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending || !hasChanges()}
                >
                  {isPending ? "Updating profile..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;
