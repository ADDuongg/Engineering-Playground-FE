"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ROUTES } from "@/shared/constants/routes";
import { formatAuthErrorMessage } from "@/features/auth/utils/format-auth-error";
import { Logo } from "@/shared/components/common/logo";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useRegister } from "@/features/auth/hooks/use-register";
import { useRedirectIfAuthenticated } from "@/features/auth/hooks/use-redirect-if-authenticated";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register-schema";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { isHydrated, isAuthenticated } = useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", displayName: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync(data);
      router.push(ROUTES.dashboard);
    } catch (error) {
      toast.error(formatAuthErrorMessage(error));
    }
  };

  if (!isHydrated || isAuthenticated) {
    return null;
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col justify-center border-e border-border p-12 md:flex">
        <Logo className="mb-10" />
        <h1 className="text-4xl font-semibold">Start your database journey</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Create a free account to track progress, save bookmarks, and unlock
          interactive SQL labs.
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center p-6 sm:p-12">
        <h2 className="text-2xl font-semibold">Create account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="text-accent">
            Sign in
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="mt-2"
              {...register("displayName")}
            />
            {errors.displayName && (
              <p className="mt-1 text-xs text-danger">
                {errors.displayName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="mt-2"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="mt-2"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-danger">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to Terms and Privacy
        </p>
      </div>
    </div>
  );
}
