"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { useAdminUsers } from "@/features/user-admin/hooks/use-admin-users";
import type { AdminUserRole } from "@/features/user-admin/types/user-admin";
import { formatUserAdminErrorMessage } from "@/features/user-admin/utils/format-user-admin-error";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants/routes";

const PAGE_SIZE = 20;

function roleBadgeVariant(role: AdminUserRole) {
  return role === "admin" ? ("accent" as const) : ("muted" as const);
}

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = searchInput.trim();
      setDebouncedQ(next);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const usersQuery = useAdminUsers({
    page,
    limit: PAGE_SIZE,
    q: debouncedQ,
  });

  const users = usersQuery.data?.users ?? [];
  const pagination = usersQuery.data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (pagination?.limit ?? PAGE_SIZE)));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <>
      <AuthAppTopbar
        title="Users"
        badge="Admin"
        actions={
          <Input
            placeholder="Search email or name…"
            className="w-64"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        }
      />
      <main className="mx-auto max-w-5xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Directory of platform users. Change roles from a user&apos;s detail
            page.
          </p>
          <div className="mt-4 sm:hidden">
            <Input
              placeholder="Search email or name…"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </div>

        {usersQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : null}

        {usersQuery.error ? (
          <EmptyState
            title="Could not load users"
            description={formatUserAdminErrorMessage(usersQuery.error)}
            className="py-12"
          />
        ) : null}

        {!usersQuery.isLoading && !usersQuery.error && users.length === 0 ? (
          <EmptyState
            title={debouncedQ ? "No users match" : "No users yet"}
            description={
              debouncedQ
                ? "Try a different email or display name."
                : "Users will appear here after they register."
            }
            className="py-12"
          />
        ) : null}

        {users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => (
              <Link key={user.id} href={ROUTES.adminUserDetail(user.id)}>
                <Card className="p-4 transition-colors hover:border-accent hover:bg-surface-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant={roleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          {user.id}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold">{user.displayName}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Created {new Date(user.createdAt).toLocaleString()}</div>
                      <div className="mt-1">
                        Updated {new Date(user.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}

        {pagination && total > 0 ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={!canGoPrev || usersQuery.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!canGoNext || usersQuery.isFetching}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.admin}>Back to admin</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
