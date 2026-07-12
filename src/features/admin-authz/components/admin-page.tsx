"use client";

import Link from "next/link";
import { Database, ShieldCheck, Users } from "lucide-react";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { useAdminMe } from "@/features/admin-authz/hooks/use-admin-me";
import { formatAdminAuthzErrorMessage } from "@/features/admin-authz/utils/format-admin-authz-error";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";

function getInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminPage() {
  const { data: admin, isLoading, error } = useAdminMe();

  return (
    <>
      <AuthAppTopbar title="Admin" badge="Console" />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        <Card className="mb-4 flex items-start gap-4 p-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Admin console</h2>
            <p className="text-sm text-muted-foreground">
              Session verified via <code className="text-xs">GET /admin/me</code>.
              Manage tracks, labs, and users from here.
            </p>
          </div>
        </Card>

        <Card className="mb-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent">
                <Database className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold">Tracks & labs</h3>
                <p className="text-sm text-muted-foreground">
                  Create and update tracks, labs, and publication status.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={ROUTES.adminTracks}>Manage tracks</Link>
            </Button>
          </div>
        </Card>

        <Card className="mb-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent">
                <Users className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold">Users</h3>
                <p className="text-sm text-muted-foreground">
                  Search the user directory and change roles.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={ROUTES.adminUsers}>Manage users</Link>
            </Button>
          </div>
        </Card>

        {isLoading && (
          <Card className="p-5 text-sm text-muted-foreground">
            Verifying admin session…
          </Card>
        )}

        {error && (
          <Card className="border-destructive/30 p-5 text-sm text-destructive">
            {formatAdminAuthzErrorMessage(error)}
          </Card>
        )}

        {admin && (
          <Card className="p-5">
            <h3 className="mb-4 font-semibold">Signed-in admin</h3>
            <div className="mb-5 flex flex-wrap items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback>{getInitials(admin.displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-semibold">{admin.displayName}</div>
                <div className="text-sm text-muted-foreground">{admin.email}</div>
                <Badge variant="accent" className="mt-2">
                  {admin.role}
                </Badge>
              </div>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="font-mono text-xs break-all">{admin.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date(admin.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </Card>
        )}
      </main>
    </>
  );
}
