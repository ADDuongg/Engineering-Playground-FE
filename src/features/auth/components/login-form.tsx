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
import { useLogin } from "@/features/auth/hooks/use-login";
import { useRedirectIfAuthenticated } from "@/features/auth/hooks/use-redirect-if-authenticated";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { isHydrated, isAuthenticated } = useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(data);
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
        <h1 className="text-4xl font-semibold">Experiment. Observe. Learn.</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Join 12,400+ developers learning database performance through
          interactive labs — not slide decks.
        </p>
        <div className="mt-10 flex gap-6">
          <div>
            <div className="font-mono-tabular text-2xl">8</div>
            <div className="text-sm text-muted-foreground">MVP labs</div>
          </div>
          <div>
            <div className="font-mono-tabular text-2xl">0</div>
            <div className="text-sm text-muted-foreground">Setup required</div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center p-6 sm:p-12">
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          New here?{" "}
          <Link href={ROUTES.register} className="text-accent">
            Create account
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
              autoComplete="current-password"
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
            disabled={isSubmitting || loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to Terms and Privacy
        </p>
      </div>
    </div>
  );
}
