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
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ADMIN_LOGIN_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  RIDER_LOGIN_REDIRECT,
  SELLER_LOGIN_REDIRECT,
} from "@/routes";
import { Eye, EyeOff } from "lucide-react";

const SellerLoginForm = () => {
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
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md border rounded-md shadow-md p-8 space-y-6">
        {/* Logo / Title */}
        <h1 className="text-3xl font-semibold text-center text-gray-900">
          Seller Central Login
        </h1>
        <p className="text-center text-sm text-gray-600 -mt-2">
          Sign in to manage your store and sales
        </p>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        {/* Login Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onKeyUp={() => setError("")}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              disabled={isPending}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seller@example.com"
                      type="email"
                      {...field}
                      className="h-11 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password with Amazon-style toggle */}
            <FormField
              control={form.control}
              disabled={isPending}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>

                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="h-11 pr-12 rounded-md"
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

            {/* CTA Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-[15px] font-semibold bg-yellow-400 hover:bg-yellow-500 text-black rounded-md"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Footer links */}
        <p className="text-center text-sm text-gray-700 mt-2">
          Don't have a seller account?{" "}
          <Link
            href="/register-seller"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>

        <p className="text-xs text-center text-gray-500 pt-1">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
};

export default SellerLoginForm;
