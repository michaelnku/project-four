"use client";

import {
  loggedInUserSchema,
  loggedInUserSchemaType,
} from "@/lib/zodValidation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { loggedInUser } from "@/actions/auth/user";
import Link from "next/link";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const RiderLoginForm = () => {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<loggedInUserSchemaType>({
    resolver: zodResolver(loggedInUserSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = (values: loggedInUserSchemaType) => {
    startTransition(() => {
      loggedInUser(values).then(async (res) => {
        if (res?.error) {
          setError(res.error);
          form.reset();
          return;
        }
        if (res?.success) router.push("/redirecting");
        router.refresh();
      });
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-orange-100 px-4">
      <div className="w-full max-w-md border bg-white p-8 rounded-md shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Delivery Partner Login</h1>
          <p className="text-sm text-gray-600 mt-1">
            Sign in to start accepting delivery tasks
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onKeyUp={() => setError("")}
            className="space-y-5"
          >
            {/* Email */}
            <FormField
              control={form.control}
              disabled={isPending}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="rider@example.com"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              disabled={isPending}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-11 pr-12"
                        {...field}
                      />
                    </FormControl>

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 font-semibold bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 pt-3">
          New rider?{" "}
          <Link
            href="/register-rider"
            className="text-blue-600 font-medium hover:underline"
          >
            Apply to Become a Delivery Partner
          </Link>
        </div>

        <p className="text-[11px] text-center text-gray-400">
          By signing in, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </main>
  );
};

export default RiderLoginForm;
