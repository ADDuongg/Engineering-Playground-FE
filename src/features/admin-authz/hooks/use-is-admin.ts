"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === "admin";
}
