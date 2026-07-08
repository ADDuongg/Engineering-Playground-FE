"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { TracksGrid } from "@/features/tracks/components/tracks-grid";
import { useTrack } from "@/features/tracks/hooks/use-track";
import { useTracks } from "@/features/tracks/hooks/use-tracks";
import type { TrackSummary } from "@/features/tracks/types/track";
import { LABS_CATALOG } from "@/shared/constants/labs-catalog";
import { ROUTES } from "@/shared/constants/routes";
import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";

const PATH_STEPS = [
  { title: "SQL Basics", status: "done" },
  { title: "Indexes", status: "active" },
  { title: "Query Optimization", status: "pending" },
  { title: "EXPLAIN ANALYZE", status: "pending" },
  { title: "Transactions", status: "pending" },
  { title: "Isolation Levels", status: "pending" },
  { title: "Redis Cache", status: "pending" },
  { title: "Load Testing", status: "pending" },
];

function getDefaultTrackSlug(tracks: TrackSummary[]): string | undefined {
  return tracks.find((track) => track.status === "active")?.slug ?? tracks[0]?.slug;
}

function TrackPathContent({ slug }: { slug: string }) {
  const { data: track, isLoading } = useTrack(slug);

  if (isLoading) {
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

  return (
    <>
      <div className="mb-8">
        <Badge variant="success" className="mb-3">
          Active track
        </Badge>
        <h2 className="text-2xl font-semibold">{track.name}</h2>
        <p className="mt-2 text-muted-foreground">{track.description}</p>
        {track.isLabStartable && (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Progressive path from indexes to load testing. 2 of 8 labs
              completed.
            </p>
            <Progress value={25} className="mt-4 max-w-md" />
          </>
        )}
      </div>

      {track.isLabStartable && (
        <>
          <div className="mb-10 space-y-2">
            {PATH_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-border bg-surface p-4"
              >
                {step.status === "done" ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                ) : step.status === "active" ? (
                  <Circle className="h-5 w-5 shrink-0 text-accent" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 font-medium">{step.title}</span>
                {step.status === "active" && (
                  <Badge variant="accent">In progress</Badge>
                )}
                {step.status === "done" && (
                  <Badge variant="success">Completed</Badge>
                )}
              </div>
            ))}
          </div>

          <h3 className="mb-4 text-lg font-semibold">All labs in path</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LABS_CATALOG.map((lab) => (
              <Link key={lab.slug} href={ROUTES.labDetail(lab.slug)}>
                <Card className="transition-colors hover:border-accent">
                  <h4 className="font-semibold">{lab.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lab.duration}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
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
      <AppTopbar title="Learning path" />
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
