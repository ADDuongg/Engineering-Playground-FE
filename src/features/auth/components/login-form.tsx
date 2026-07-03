"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login-schema";
import { ROUTES } from "@/shared/constants/routes";
import { Logo } from "@/shared/components/common/logo";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (_data: LoginFormValues) => {
    // Service not implemented — navigate to dashboard for prototype
    window.location.href = ROUTES.dashboard;
  };

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
          <Link href={ROUTES.login} className="text-accent">
            Create account
          </Link>
        </p>
        <Button variant="secondary" className="mt-6 w-full">
          <Github className="h-4 w-4" />
          Continue with GitHub
        </Button>
        <div className="my-6 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
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
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to Terms and Privacy
        </p>
      </div>
    </div>
  );
}
