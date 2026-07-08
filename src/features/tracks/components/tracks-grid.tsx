"use client";

import { AlertCircle } from "lucide-react";
import { TrackCard } from "@/features/tracks/components/track-card";
import { useTracks } from "@/features/tracks/hooks/use-tracks";
import type { TrackSummary } from "@/features/tracks/types/track";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface TracksGridProps {
  selectedSlug?: string;
  onSelectTrack?: (track: TrackSummary) => void;
  getTrackHref?: (track: TrackSummary) => string | undefined;
  className?: string;
  columns?: "2" | "3" | "4";
}

function TracksGridSkeleton({ columns }: { columns: TracksGridProps["columns"] }) {
  const count = columns === "4" ? 4 : 3;

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === "4" && "sm:grid-cols-2 lg:grid-cols-4",
        columns === "3" && "sm:grid-cols-2 lg:grid-cols-3",
        columns === "2" && "sm:grid-cols-2",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-lg" />
      ))}
    </div>
  );
}

export function TracksGrid({
  selectedSlug,
  onSelectTrack,
  getTrackHref,
  className,
  columns = "3",
}: TracksGridProps) {
  const { data, isLoading, isError, refetch } = useTracks();
  const tracks = data?.tracks ?? [];

  if (isLoading) {
    return <TracksGridSkeleton columns={columns} />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-8 w-8" />}
        title="Could not load tracks"
        description="The track catalog is temporarily unavailable. Try again in a moment."
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  if (tracks.length === 0) {
    return (
      <EmptyState
        title="No tracks available"
        description="Learning tracks will appear here once the catalog is published."
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        columns === "4" && "sm:grid-cols-2 lg:grid-cols-4",
        columns === "3" && "sm:grid-cols-2 lg:grid-cols-3",
        columns === "2" && "sm:grid-cols-2",
        className,
      )}
    >
      {tracks.map((track) => (
        <TrackCard
          key={track.slug}
          track={track}
          selected={selectedSlug === track.slug}
          onSelect={onSelectTrack ? () => onSelectTrack(track) : undefined}
          href={getTrackHref?.(track)}
        />
      ))}
    </div>
  );
}
