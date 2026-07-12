"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { formatProgressErrorMessage } from "@/features/progress-tracking/utils/format-progress-error";
import type {
  LabPathItem,
  TrackProgressSummaryResponse,
} from "@/features/progress-tracking/types/progress";
import { ROUTES } from "@/shared/constants/routes";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface TrackLearningPathProps {
  labs: LabPathItem[];
  progress?: TrackProgressSummaryResponse;
  isLoading?: boolean;
  error?: unknown;
  showProgress?: boolean;
}

function isLabCompleted(
  slug: string,
  progress?: TrackProgressSummaryResponse,
): boolean {
  if (!progress) {
    return false;
  }

  if (progress.completedLabSlugs.includes(slug)) {
    return true;
  }

  return progress.labs.some((lab) => lab.slug === slug && lab.completed);
}

export function TrackLearningPath({
  labs,
  progress,
  isLoading = false,
  error,
  showProgress = false,
}: TrackLearningPathProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-2 max-w-md" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load learning path"
        description={formatProgressErrorMessage(error)}
        className="py-12"
      />
    );
  }

  if (labs.length === 0) {
    return (
      <EmptyState
        title="No labs in this path yet"
        description="Labs for this track have not been seeded."
        className="py-12"
      />
    );
  }

  return (
    <div className="space-y-6">
      {showProgress && progress && (
        <div>
          <p className="text-sm text-muted-foreground">
            {progress.completedCount} of {progress.totalLabs} labs completed.
          </p>
          <Progress value={progress.percentComplete} className="mt-4 max-w-md" />
          <p className="mt-2 text-xs text-muted-foreground">
            {progress.percentComplete}% complete
          </p>
        </div>
      )}

      <div className="space-y-2">
        {labs.map((lab, index) => {
          const completed = isLabCompleted(lab.slug, progress);
          const isComingSoon = lab.status === "coming-soon";
          const isNext =
            !isComingSoon &&
            showProgress &&
            progress &&
            !completed &&
            labs
              .slice(0, index)
              .every(
                (prior) =>
                  prior.status === "coming-soon" ||
                  isLabCompleted(prior.slug, progress),
              );

          const rowClassName = cn(
            "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-border bg-surface p-4 transition-colors",
            isComingSoon
              ? "opacity-75"
              : "hover:border-accent",
          );

          const content = (
            <>
              {completed ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              ) : isComingSoon ? (
                <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
              ) : (
                <Circle
                  className={`h-5 w-5 shrink-0 ${
                    isNext ? "text-accent" : "text-muted-foreground"
                  }`}
                />
              )}
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-medium">{lab.title}</span>
                {lab.description ? (
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                    {lab.description}
                  </p>
                ) : null}
              </div>
              {isComingSoon && <Badge variant="muted">Coming soon</Badge>}
              {completed && <Badge variant="success">Completed</Badge>}
              {isNext && <Badge variant="accent">Up next</Badge>}
            </>
          );

          if (isComingSoon) {
            return (
              <div key={lab.slug} className={rowClassName} aria-disabled>
                {content}
              </div>
            );
          }

          return (
            <Link key={lab.slug} href={ROUTES.labDetail(lab.slug)} className={rowClassName}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
