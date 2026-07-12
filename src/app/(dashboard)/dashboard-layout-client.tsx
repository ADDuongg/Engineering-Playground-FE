"use client";

import { AdminSidebarLink } from "@/features/admin-authz/components/admin-sidebar-link";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { DashboardShell } from "@/shared/components/layout/dashboard-shell";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  return (
    <AuthGuard>
      <DashboardShell sidebarExtraNav={<AdminSidebarLink />}>
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}
