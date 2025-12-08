"use client";

import { registerSchema, registerSchemaType } from "@/lib/zodValidation";
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
import { createUser } from "@/actions/auth/user";
import Link from "next/link";
import SocialLogin from "@/components/auth/SocialLogin";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [strength, setStrength] = useState<"Weak" | "Medium" | "Strong" | "">(
    ""
  );

  const [isPending, startTransition] = useTransition();

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: registerSchemaType) => {
    startTransition(async () => {
      createUser(values).then((res) => {
        if (res?.error) {
          setError(res.error);
          setSuccess("");
        } else if (res?.success) {
          setSuccess(res.success);
          setError("");
          form.reset();
        }
      });
    });
  };

  const updateStrength = (value: string) => {
    if (!value) return setStrength("");
    const strong = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])/.test(value);
    const medium = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(value);
    if (strong) setStrength("Strong");
    else if (medium && value.length >= 6) setStrength("Medium");
    else setStrength("Weak");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-lg p-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--brand-blue)" }}
          >
            Create your account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You're just a step away from shopping on NexaMart.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              disabled={isPending}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="rounded-lg h-11 focus:ring-2 focus:ring-[var(--brand-blue)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              disabled={isPending}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@email.com"
                      type="email"
                      {...field}
                      className="rounded-lg h-11 focus:ring-2 focus:ring-[var(--brand-blue)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              disabled={isPending}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="At least 6 characters"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateStrength(e.target.value);
                        }}
                        onKeyUp={(e) =>
                          setCapsLock(e.getModifierState("CapsLock"))
                        }
                        className="rounded-lg h-11 focus:ring-2 focus:ring-[var(--brand-blue)]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--brand-blue)] transition"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  {/* Caps Lock */}
                  {capsLock && (
                    <p className="text-xs text-yellow-500 mt-1">
                      ⚠ Caps Lock is ON
                    </p>
                  )}

                  {/* Strength Meter */}
                  {strength && (
                    <div className="mt-1">
                      <div
                        className={`h-1 rounded-full transition-all
                          ${strength === "Weak" && "bg-red-500 w-1/3"}
                          ${strength === "Medium" && "bg-yellow-500 w-2/3"}
                          ${strength === "Strong" && "bg-green-600 w-full"}
                        `}
                      />
                      <p
                        className={`text-xs mt-1 font-medium
                          ${strength === "Weak" && "text-red-600"}
                          ${strength === "Medium" && "text-yellow-600"}
                          ${strength === "Strong" && "text-green-600"}
                        `}
                      >
                        {strength} password
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONFIRM PASSWORD */}
            <FormField
              control={form.control}
              disabled={isPending}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Re-enter password"
                        type={showConfirm ? "text" : "password"}
                        {...field}
                        onKeyUp={(e) =>
                          setCapsLock(e.getModifierState("CapsLock"))
                        }
                        className="rounded-lg h-11 focus:ring-2 focus:ring-[var(--brand-blue)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--brand-blue)] transition"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  {capsLock && (
                    <p className="text-xs text-yellow-500 mt-1">
                      ⚠ Caps Lock is ON
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback */}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 text-center">{success}</p>
            )}

            {/* SUBMIT */}
            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-11 rounded-lg font-semibold text-white shadow-md bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-hover)] transition disabled:opacity-70"
            >
              {isPending ? "Creating account..." : "Create your account"}
            </Button>
          </form>

          <SocialLogin />
        </Form>

        {/* Already have an account */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--brand-blue)] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
