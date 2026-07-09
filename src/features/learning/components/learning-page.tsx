"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { TrackLearningPath } from "@/features/progress-tracking/components/track-learning-path";
import { useTrackLearningPath } from "@/features/progress-tracking/hooks/use-track-learning-path";
import { useTrackProgress } from "@/features/progress-tracking/hooks/use-track-progress";
import { formatProgressErrorMessage } from "@/features/progress-tracking/utils/format-progress-error";
import { TracksGrid } from "@/features/tracks/components/tracks-grid";
import { useTrack } from "@/features/tracks/hooks/use-track";
import { useTracks } from "@/features/tracks/hooks/use-tracks";
import type { TrackSummary } from "@/features/tracks/types/track";
import { ROUTES } from "@/shared/constants/routes";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

function getDefaultTrackSlug(tracks: TrackSummary[]): string | undefined {
  return tracks.find((track) => track.status === "active")?.slug ?? tracks[0]?.slug;
}

function TrackPathContent({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuth();
  const { data: track, isLoading: isTrackLoading } = useTrack(slug);
  const learningPathQuery = useTrackLearningPath(slug, {
    enabled: track?.status === "active" || track?.isLabStartable === true,
  });
  const progressQuery = useTrackProgress(slug, {
    enabled: track?.status === "active" || track?.isLabStartable === true,
  });

  if (isTrackLoading) {
    return (
      <div className="mb-10 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-2 max-w-md" />
      </div>
    );
  }

  if (!track) {
    return null;
  }

  if (track.status === "coming-soon") {
    return (
      <EmptyState
        icon={<Clock className="h-8 w-8" />}
        title={`${track.name} is coming soon`}
        description={track.description}
        action={
          <Button variant="secondary" asChild>
            <Link href={ROUTES.labs}>Browse available labs</Link>
          </Button>
        }
        className="mb-10 py-12"
      />
    );
  }

  const showProgress = isAuthenticated && Boolean(progressQuery.data);

  return (
    <>
      <div className="mb-8">
        <Badge variant="success" className="mb-3">
          Active track
        </Badge>
        <h2 className="text-2xl font-semibold">{track.name}</h2>
        <p className="mt-2 text-muted-foreground">{track.description}</p>
        {track.isLabStartable && !isAuthenticated && (
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to track which labs you have completed on this path.
          </p>
        )}
      </div>

      {track.isLabStartable && (
        <>
          {isAuthenticated && progressQuery.error && !progressQuery.data ? (
            <p className="mb-4 text-sm text-danger" role="alert">
              {formatProgressErrorMessage(progressQuery.error)}
            </p>
          ) : null}
          <TrackLearningPath
            labs={learningPathQuery.data?.labs ?? []}
            progress={progressQuery.data}
            isLoading={
              learningPathQuery.isLoading ||
              (isAuthenticated &&
                progressQuery.isLoading &&
                !progressQuery.data)
            }
            error={learningPathQuery.error}
            showProgress={showProgress}
          />
        </>
      )}
    </>
  );
}

export function LearningPage() {
  const { data } = useTracks();
  const defaultSlug = useMemo(
    () => getDefaultTrackSlug(data?.tracks ?? []),
    [data?.tracks],
  );
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>();

  const activeSlug = selectedSlug ?? defaultSlug;

  return (
    <>
      <AuthAppTopbar title="Learning path" />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <section className="mb-10">
          <h2 className="mb-2 text-lg font-semibold">Choose a track</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Tracks group labs by topic. Select an active track to view your
            learning path.
          </p>
          <TracksGrid
            selectedSlug={activeSlug}
            onSelectTrack={(track) => setSelectedSlug(track.slug)}
          />
        </section>

        {activeSlug && <TrackPathContent slug={activeSlug} />}
      </main>
    </>
  );
}
