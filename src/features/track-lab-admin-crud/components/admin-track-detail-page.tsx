"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import {
  StatusBadge,
} from "@/features/track-lab-admin-crud/components/admin-form-field";
import { UpdateTrackForm } from "@/features/track-lab-admin-crud/components/track-form";
import {
  getOptionLabel,
  INPUT_SURFACE_OPTIONS,
  METRIC_CATALOG_OPTIONS,
  RUNTIME_ADAPTER_OPTIONS,
  VISUALIZATION_KIT_OPTIONS,
} from "@/features/track-lab-admin-crud/constants/track-lab-options";
import { useAdminLabs } from "@/features/track-lab-admin-crud/hooks/use-admin-labs";
import { useAdminTrack } from "@/features/track-lab-admin-crud/hooks/use-admin-track";
import { useUpdateTrack } from "@/features/track-lab-admin-crud/hooks/use-update-track";
import type { UpdateTrackFormValues } from "@/features/track-lab-admin-crud/schemas/track-lab-admin-schema";
import { formatAdminCrudErrorMessage } from "@/features/track-lab-admin-crud/utils/format-admin-crud-error";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants/routes";

interface AdminTrackDetailPageProps {
  slug: string;
}

export function AdminTrackDetailPage({ slug }: AdminTrackDetailPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const trackQuery = useAdminTrack(slug);
  const labsQuery = useAdminLabs(slug);
  const updateTrack = useUpdateTrack();

  const handleUpdate = async (values: UpdateTrackFormValues) => {
    try {
      await updateTrack.mutateAsync({ slug, data: values });
      toast.success("Track updated");
      setIsEditing(false);
    } catch (error) {
      toast.error(formatAdminCrudErrorMessage(error));
    }
  };

  const track = trackQuery.data;

  return (
    <>
      <AuthAppTopbar title={track?.name ?? "Track"} badge="Admin" />
      <main className="mx-auto max-w-5xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4">
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.adminTracks}>All tracks</Link>
          </Button>
        </div>

        {trackQuery.isLoading ? (
          <Skeleton className="mb-6 h-48 w-full" />
        ) : null}

        {trackQuery.error ? (
          <EmptyState
            title="Track not found"
            description={formatAdminCrudErrorMessage(trackQuery.error)}
            className="py-12"
          />
        ) : null}

        {track && !isEditing ? (
          <Card className="mb-8 p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {track.slug}
                  </span>
                  <StatusBadge status={track.status} />
                </div>
                <h1 className="text-2xl font-semibold">{track.name}</h1>
              </div>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Edit track
              </Button>
            </div>

            <p className="mb-5 text-muted-foreground">{track.description}</p>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Display order</dt>
                <dd>{track.displayOrder}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Runtime adapter</dt>
                <dd>
                  {getOptionLabel(RUNTIME_ADAPTER_OPTIONS, track.runtimeAdapterType)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Input surface</dt>
                <dd>
                  {getOptionLabel(INPUT_SURFACE_OPTIONS, track.inputSurfaceType)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Metric catalog</dt>
                <dd>
                  {getOptionLabel(METRIC_CATALOG_OPTIONS, track.metricCatalogId)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Visualization kit</dt>
                <dd>
                  {getOptionLabel(
                    VISUALIZATION_KIT_OPTIONS,
                    track.visualizationKitId,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Updated</dt>
                <dd>{new Date(track.updatedAt).toLocaleString()}</dd>
              </div>
            </dl>
          </Card>
        ) : null}

        {track && isEditing ? (
          <Card className="mb-8 p-5">
            <h2 className="mb-4 text-lg font-semibold">Edit track</h2>
            <UpdateTrackForm
              track={track}
              onSubmit={handleUpdate}
              isSubmitting={updateTrack.isPending}
              onCancel={() => setIsEditing(false)}
            />
          </Card>
        ) : null}

        {track ? (
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Labs</h2>
              <Button asChild size="sm">
                <Link href={ROUTES.adminTrackLabNew(slug)}>
                  <Plus className="h-4 w-4" />
                  Add lab
                </Link>
              </Button>
            </div>

            {labsQuery.isLoading ? <Skeleton className="h-32 w-full" /> : null}

            {labsQuery.error ? (
              <p className="text-sm text-danger">
                {formatAdminCrudErrorMessage(labsQuery.error)}
              </p>
            ) : null}

            {labsQuery.data?.labs.length === 0 ? (
              <EmptyState
                title="No labs in this track"
                description="Add labs to build the learning path."
                action={
                  <Button asChild>
                    <Link href={ROUTES.adminTrackLabNew(slug)}>Add lab</Link>
                  </Button>
                }
                className="py-10"
              />
            ) : null}

            {labsQuery.data?.labs.length ? (
              <div className="space-y-2">
                {labsQuery.data.labs.map((lab) => (
                  <Link key={lab.id} href={ROUTES.adminLabDetail(lab.slug)}>
                    <Card className="p-4 transition-colors hover:border-accent hover:bg-surface-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {lab.slug}
                            </span>
                            <StatusBadge status={lab.status} />
                          </div>
                          <div className="font-medium">{lab.title}</div>
                          {lab.description ? (
                            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                              {lab.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Seq {lab.sequenceOrder}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {!track && !trackQuery.isLoading && !trackQuery.error ? (
          <Button variant="secondary" onClick={() => router.push(ROUTES.adminTracks)}>
            Back to tracks
          </Button>
        ) : null}
      </main>
    </>
  );
}
