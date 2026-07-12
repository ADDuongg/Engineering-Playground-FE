"use client";

import Link from "next/link";
import { RoleForm } from "@/features/user-admin/components/role-form";
import { useAdminUser } from "@/features/user-admin/hooks/use-admin-user";
import {
  formatUserAdminErrorMessage,
  isNotFoundError,
} from "@/features/user-admin/utils/format-user-admin-error";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants/routes";

interface AdminUserDetailPageProps {
  userId: string;
}

export function AdminUserDetailPage({ userId }: AdminUserDetailPageProps) {
  const userQuery = useAdminUser(userId);

  if (userQuery.isLoading) {
    return (
      <>
        <AuthAppTopbar title="User" badge="Admin" />
        <main className="mx-auto max-w-3xl flex-1 overflow-auto p-4 sm:p-6">
          <Skeleton className="mb-4 h-8 w-48" />
          <Skeleton className="mb-6 h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </main>
      </>
    );
  }

  if (userQuery.error || !userQuery.data) {
    return (
      <>
        <AuthAppTopbar title="User" badge="Admin" />
        <main className="mx-auto max-w-3xl flex-1 overflow-auto p-4 sm:p-6">
          <EmptyState
            title={
              isNotFoundError(userQuery.error)
                ? "User not found"
                : "Could not load user"
            }
            description={formatUserAdminErrorMessage(userQuery.error)}
            action={
              <Button variant="secondary" asChild>
                <Link href={ROUTES.adminUsers}>Back to users</Link>
              </Button>
            }
            className="py-12"
          />
        </main>
      </>
    );
  }

  const user = userQuery.data;

  return (
    <>
      <AuthAppTopbar title={user.displayName} badge="Admin" />
      <main className="mx-auto max-w-3xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant={user.role === "admin" ? "accent" : "muted"}>
            {user.role}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {user.id}
          </span>
        </div>

        <Card className="mb-6 p-5">
          <h2 className="mb-4 text-lg font-semibold">Profile</h2>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Display name</dt>
              <dd className="font-medium">{user.displayName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(user.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Updated</dt>
              <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Updated by</dt>
              <dd className="font-mono text-xs break-all">
                {user.updatedBy ?? "—"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="mb-6 p-5">
          <h2 className="mb-4 text-lg font-semibold">Role</h2>
          <RoleForm user={user} />
        </Card>

        <Button asChild variant="secondary" size="sm">
          <Link href={ROUTES.adminUsers}>Back to users</Link>
        </Button>
      </main>
    </>
  );
}
