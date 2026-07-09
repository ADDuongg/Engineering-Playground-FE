"use client";

import { Loader2 } from "lucide-react";
import {
  formatBenchmarkMetricsStatusMessage,
} from "@/features/benchmark-metrics/utils/format-benchmark-metrics-error";
import type { BenchmarkMetricsStatus } from "@/features/benchmark-metrics/types/benchmark-metrics";
import { MetricsPanel } from "@/features/metrics-pipeline/components/metrics-panel";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";
import { cn } from "@/shared/lib/utils";

interface BenchmarkMetricsPanelProps {
  metricsStatus?: BenchmarkMetricsStatus;
  metrics?: MetricContract[];
  hint?: string;
  isLoading?: boolean;
  className?: string;
}

export function BenchmarkMetricsPanel({
  metricsStatus,
  metrics,
  hint,
  isLoading,
  className,
}: BenchmarkMetricsPanelProps) {
  if (!metricsStatus && !isLoading) {
    return null;
  }

  if (metricsStatus === "pending" || isLoading) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground",
          className,
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {formatBenchmarkMetricsStatusMessage("pending", hint)}
      </div>
    );
  }

  if (metricsStatus === "unavailable") {
    return (
      <div
        className={cn(
          "rounded-md border border-warning/40 bg-warning/5 p-4 text-sm",
          className,
        )}
      >
        <p className="font-medium text-foreground">
          Metrics unavailable
        </p>
        <p className="mt-1 text-muted-foreground">
          {formatBenchmarkMetricsStatusMessage("unavailable", hint)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          The load test finished, but collected metrics were incomplete so
          results are not shown as success metrics.
        </p>
      </div>
    );
  }

  if (metricsStatus === "ready" && metrics?.length) {
    return <MetricsPanel metrics={metrics} className={className} />;
  }

  if (metricsStatus === "ready") {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Metrics collection finished but no metric values were returned.
      </p>
    );
  }

  return null;
}
