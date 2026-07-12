"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAdminMe } from "@/features/admin-authz/hooks/use-admin-me";
import { useIsAdmin } from "@/features/admin-authz/hooks/use-is-admin";
import { formatAdminAuthzErrorMessage } from "@/features/admin-authz/utils/format-admin-authz-error";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

interface AdminGuardProps {
  children: React.ReactNode;
}

function LoadingState() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />
    </div>
  );
}

function ForbiddenState({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <ShieldAlert className="h-12 w-12 text-muted-foreground" aria-hidden />
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Admin access required</h1>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      <Button asChild variant="outline">
        <Link href={ROUTES.dashboard}>Back to dashboard</Link>
      </Button>
    </div>
  );
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const isAdmin = useIsAdmin();
  const { isLoading, isError, error } = useAdminMe();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return <ForbiddenState message="Admin role required" />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ForbiddenState message={formatAdminAuthzErrorMessage(error)} />
    );
  }

  return <>{children}</>;
}
