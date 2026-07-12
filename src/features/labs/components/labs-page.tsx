"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { useLabs } from "@/features/labs/hooks/use-labs";
import type { LabListItem } from "@/features/labs/types/labs";
import { formatLabsErrorMessage } from "@/features/labs/utils/format-labs-error";
import { progressKeys } from "@/features/progress-tracking/constants/query-keys";
import { fetchTrackProgress } from "@/features/progress-tracking/services/progress-service";
import type { TrackProgressSummaryResponse } from "@/features/progress-tracking/types/progress";
import { ROUTES } from "@/shared/constants/routes";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

type StatusFilter = "all" | "active" | "coming-soon";

function isLabCompleted(
  slug: string,
  progressByTrack: Map<string, TrackProgressSummaryResponse>,
  trackSlug: string,
): boolean {
  const progress = progressByTrack.get(trackSlug);
  if (!progress) return false;
  if (progress.completedLabSlugs.includes(slug)) return true;
  return progress.labs.some((lab) => lab.slug === slug && lab.completed);
}

function LabCard({
  lab,
  completed,
}: {
  lab: LabListItem;
  completed: boolean;
}) {
  const isComingSoon = lab.status === "coming-soon";
  const href = isComingSoon ? undefined : ROUTES.labDetail(lab.slug);

  const card = (
    <Card
      className={cn(
        "flex h-full flex-col transition-colors",
        isComingSoon
          ? "opacity-75"
          : "hover:border-accent hover:bg-surface-2",
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <Badge variant={isComingSoon ? "muted" : "success"}>
          {isComingSoon ? "coming soon" : "active"}
        </Badge>
        <Badge variant="muted">{lab.trackName}</Badge>
      </div>
      <h3 className="mb-2 truncate text-lg font-semibold">{lab.title}</h3>
      <p className="flex-1 text-sm text-muted-foreground">
        {lab.description?.trim() || "No description yet."}
      </p>
      <div className="mt-4 flex gap-3 font-mono text-xs text-muted-foreground">
        <span>#{lab.sequenceOrder}</span>
        <span
          className={cn(completed && "text-success")}
        >
          {completed
            ? "Completed ✓"
            : isComingSoon
              ? "Coming soon"
              : "Not started"}
        </span>
      </div>
    </Card>
  );

  if (!href) {
    return <div>{card}</div>;
  }

  return <Link href={href}>{card}</Link>;
}

export function LabsPage() {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { isAuthenticated, isHydrated } = useAuth();
  const labsQuery = useLabs();

  const labs = labsQuery.data?.labs ?? [];

  const trackOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const lab of labs) {
      if (!seen.has(lab.trackSlug)) {
        seen.set(lab.trackSlug, lab.trackName);
      }
    }
    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }));
  }, [labs]);

  const trackSlugs = useMemo(
    () => [...new Set(labs.map((lab) => lab.trackSlug))],
    [labs],
  );

  const progressQueries = useQueries({
    queries: trackSlugs.map((trackSlug) => ({
      queryKey: progressKeys.track(trackSlug),
      queryFn: () => fetchTrackProgress(trackSlug),
      enabled: isHydrated && isAuthenticated && trackSlugs.length > 0,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    })),
  });

  const progressByTrack = useMemo(() => {
    const map = new Map<string, TrackProgressSummaryResponse>();
    trackSlugs.forEach((trackSlug, index) => {
      const data = progressQueries[index]?.data;
      if (data) map.set(trackSlug, data);
    });
    return map;
  }, [progressQueries, trackSlugs]);

  const filtered = labs.filter((lab) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lab.title.toLowerCase().includes(q) ||
      (lab.description ?? "").toLowerCase().includes(q) ||
      lab.trackName.toLowerCase().includes(q);

    const matchesTrack =
      trackFilter === "all" || lab.trackSlug === trackFilter;

    const matchesStatus =
      statusFilter === "all" || lab.status === statusFilter;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  return (
    <>
      <AuthAppTopbar
        title="Lab browser"
        actions={
          <Input
            placeholder="Search labs…"
            className="w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4 sm:hidden">
          <Input
            placeholder="Search labs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button
            variant={trackFilter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTrackFilter("all")}
          >
            All tracks
          </Button>
          {trackOptions.map((track) => (
            <Button
              key={track.slug}
              variant={trackFilter === track.slug ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTrackFilter(track.slug)}
            >
              {track.name}
            </Button>
          ))}
          <div className="flex w-full flex-wrap gap-2 sm:ms-auto sm:w-auto">
            {(
              [
                ["all", "All"],
                ["active", "Active"],
                ["coming-soon", "Coming soon"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                variant={statusFilter === value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {labsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : labsQuery.error ? (
          <EmptyState
            title="Could not load labs"
            description={formatLabsErrorMessage(labsQuery.error)}
            className="py-12"
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No labs match"
            description={
              labs.length === 0
                ? "No active tracks have labs yet."
                : "Try a different search or filter."
            }
            className="py-12"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((lab) => (
              <LabCard
                key={`${lab.trackSlug}:${lab.slug}`}
                lab={lab}
                completed={isLabCompleted(
                  lab.slug,
                  progressByTrack,
                  lab.trackSlug,
                )}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
