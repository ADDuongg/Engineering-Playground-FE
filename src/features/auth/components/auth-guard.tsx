"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/shared/constants/routes";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
