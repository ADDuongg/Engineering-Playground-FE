"use client";

import type { BenchmarkProgressSnapshot } from "@/features/realtime-progress/types/progress";
import {
  formatElapsedMs,
  formatProgressPhaseLabel,
} from "@/features/realtime-progress/utils/format-progress-error";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

interface BenchmarkProgressPanelProps {
  snapshot?: BenchmarkProgressSnapshot;
  isStreaming?: boolean;
  className?: string;
}

function formatRps(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export function BenchmarkProgressPanel({
  snapshot,
  isStreaming = false,
  className,
}: BenchmarkProgressPanelProps) {
  if (!snapshot) {
    return (
      <div
        className={cn(
          "flex h-40 items-center justify-center gap-2 rounded-md border border-dashed border-border text-sm text-muted-foreground",
          className,
        )}
      >
        {isStreaming ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to live progress…
          </>
        ) : (
          "Waiting for progress…"
        )}
      </div>
    );
  }

  const partials = snapshot.partialMetrics ?? [];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border border-border bg-surface p-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {isStreaming && !snapshot.terminal ? (
            <span className="flex items-center gap-2 font-mono text-xs text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              LIVE
            </span>
          ) : null}

          <Badge variant="muted">
            {formatProgressPhaseLabel(snapshot.phase)}
          </Badge>

          <Badge variant="muted">
            {formatElapsedMs(snapshot.elapsedMs)} · {snapshot.elapsedBasis}
          </Badge>

          <Badge variant="muted">
            {formatRps(snapshot.currentRps)} RPS (provisional)
          </Badge>

          {snapshot.profile ? (
            <Badge variant="muted">
              Target {snapshot.profile.rps} RPS · {snapshot.profile.durationSeconds}s
            </Badge>
          ) : null}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          In-run values are provisional. Final collected metrics appear after the
          job finishes.
        </p>

        {snapshot.hint ? (
          <p className="mt-2 text-muted-foreground">{snapshot.hint}</p>
        ) : null}
      </div>

      {partials.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-medium">
            Partial metrics{" "}
            <span className="font-normal text-muted-foreground">
              (provisional)
            </span>
          </h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {partials.map((metric) => (
              <div
                key={metric.key}
                className="rounded-md border border-border bg-surface px-3 py-2"
              >
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="font-mono text-sm tabular-nums">
                  {metric.value.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-muted-foreground">{metric.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
          {snapshot.phase === "queued"
            ? "Queued — waiting for execution to start."
            : "Live RPS and partial metrics appear as the load test runs."}
        </div>
      )}
    </div>
  );
}
