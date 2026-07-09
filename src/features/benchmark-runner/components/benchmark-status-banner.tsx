"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { BenchmarkJobStatusResult } from "@/features/benchmark-runner/types/benchmark";
import {
  formatBenchmarkRemainingSeconds,
  formatBenchmarkStatusLabel,
} from "@/features/benchmark-runner/utils/format-benchmark-status";
import { formatBenchmarkStatusMessage } from "@/features/benchmark-runner/utils/format-benchmark-error";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface BenchmarkStatusBannerProps {
  status: BenchmarkJobStatusResult;
  className?: string;
}

export function BenchmarkStatusBanner({
  status,
  className,
}: BenchmarkStatusBannerProps) {
  const isLive = status.status === "queued" || status.status === "running";
  const [, setTick] = useState(0);

  useEffect(() => {
    if (status.status !== "running") {
      return;
    }

    const id = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [status.status, status.startedAt]);

  const remainingSeconds =
    status.status === "running"
      ? formatBenchmarkRemainingSeconds(
          status.profile.durationSeconds,
          status.startedAt,
        )
      : null;
  const statusMessage = formatBenchmarkStatusMessage(status);

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface p-4 text-sm",
        status.status === "failed" && "border-danger/40 bg-danger/5",
        status.status === "completed" && "border-success/40 bg-success/5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isLive ? (
          <span className="flex items-center gap-2 font-mono text-xs text-success">
            {status.status === "running" ? (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                LIVE
                {remainingSeconds !== null
                  ? ` · ${remainingSeconds}s remaining`
                  : null}
              </>
            ) : (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Queued
              </>
            )}
          </span>
        ) : (
          <Badge
            variant={
              status.status === "completed"
                ? "success"
                : status.status === "failed"
                  ? "danger"
                  : "muted"
            }
          >
            {formatBenchmarkStatusLabel(status.status)}
          </Badge>
        )}

        <Badge variant="muted">
          {status.profile.rps} RPS · {status.profile.durationSeconds}s
        </Badge>
      </div>

      {statusMessage ? (
        <p className="mt-2 text-muted-foreground">{statusMessage}</p>
      ) : null}
    </div>
  );
}
