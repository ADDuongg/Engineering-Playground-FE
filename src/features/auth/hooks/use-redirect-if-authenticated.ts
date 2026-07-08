"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/shared/constants/routes";

export function useRedirectIfAuthenticated(redirectTo = ROUTES.dashboard) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isHydrated, redirectTo, router]);

  return { isHydrated, isAuthenticated };
}
