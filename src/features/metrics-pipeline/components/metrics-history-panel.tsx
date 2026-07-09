import { formatMetricValue } from "@/features/metrics-pipeline/utils/format-metric-value";
import type { MetricSnapshot } from "@/features/metrics-pipeline/types/metrics";
import { cn } from "@/shared/lib/utils";

interface MetricsHistoryPanelProps {
  snapshots: MetricSnapshot[];
  currentRunId?: string;
  className?: string;
}

function formatSnapshotTime(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function MetricsHistoryPanel({
  snapshots,
  currentRunId,
  className,
}: MetricsHistoryPanelProps) {
  if (snapshots.length === 0) {
    return null;
  }

  const ordered = [...snapshots].reverse();

  return (
    <div className={cn("space-y-2", className)}>
      <h5 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Run History
      </h5>
      <div className="space-y-2">
        {ordered.map((snapshot) => {
          const isCurrent = snapshot.runId === currentRunId;

          return (
            <div
              key={snapshot.runId}
              className={cn(
                "rounded-md border border-border-subtle bg-surface-2 p-3",
                isCurrent && "border-accent/40 bg-accent/5",
              )}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono uppercase">{snapshot.runType}</span>
                <span>·</span>
                <span>{formatSnapshotTime(snapshot.createdAt)}</span>
                {isCurrent && (
                  <span className="rounded-sm bg-accent/10 px-1.5 py-0.5 text-accent">
                    Current
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {snapshot.metrics.map((metric) => (
                  <div key={`${snapshot.runId}-${metric.key}`}>
                    <dt className="text-xs text-muted-foreground">{metric.label}</dt>
                    <dd className="font-mono-tabular text-sm">
                      {formatMetricValue(metric.value, metric.unit)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
