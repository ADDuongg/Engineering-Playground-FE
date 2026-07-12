"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { StatusBadge } from "@/features/track-lab-admin-crud/components/admin-form-field";
import { useAdminTracks } from "@/features/track-lab-admin-crud/hooks/use-admin-tracks";
import { formatAdminCrudErrorMessage } from "@/features/track-lab-admin-crud/utils/format-admin-crud-error";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants/routes";

export function AdminTracksPage() {
  const { data, isLoading, error } = useAdminTracks();

  return (
    <>
      <AuthAppTopbar
        title="Tracks"
        badge="Admin"
        actions={
          <Button asChild size="sm">
            <Link href={ROUTES.adminTrackNew}>
              <Plus className="h-4 w-4" />
              New track
            </Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-5xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Manage learning tracks and their runtime configuration.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm" className="sm:hidden">
            <Link href={ROUTES.adminTrackNew}>New track</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : null}

        {error ? (
          <EmptyState
            title="Could not load tracks"
            description={formatAdminCrudErrorMessage(error)}
            className="py-12"
          />
        ) : null}

        {data?.tracks.length === 0 ? (
          <EmptyState
            title="No tracks yet"
            description="Create the first track to start adding labs."
            action={
              <Button asChild>
                <Link href={ROUTES.adminTrackNew}>Create track</Link>
              </Button>
            }
            className="py-12"
          />
        ) : null}

        {data?.tracks.length ? (
          <div className="space-y-3">
            {data.tracks.map((track) => (
              <Link key={track.id} href={ROUTES.adminTrackDetail(track.slug)}>
                <Card className="p-4 transition-colors hover:border-accent hover:bg-surface-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {track.slug}
                        </span>
                        <StatusBadge status={track.status} />
                      </div>
                      <h2 className="text-lg font-semibold">{track.name}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {track.description}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Order {track.displayOrder}</div>
                      <div className="mt-1">{track.runtimeAdapterType}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
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
