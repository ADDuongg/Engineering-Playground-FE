"use client";

import { useEffect } from "react";
import { initAuthApiClient } from "@/features/auth/lib/init-auth-api";
import { useMe } from "@/features/auth/hooks/use-me";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAuthApiClient();
  }, []);

  return (
    <>
      <AuthSessionSync />
      {children}
    </>
  );
}

function AuthSessionSync() {
  useMe();
  return null;
}
