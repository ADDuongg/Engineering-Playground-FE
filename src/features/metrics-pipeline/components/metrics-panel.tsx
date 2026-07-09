import { MetricCell, MetricGrid } from "@/shared/components/common/metric-cell";
import { mapMetricsToLabMetrics } from "@/features/metrics-pipeline/utils/map-metrics-to-lab-metrics";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";
import { cn } from "@/shared/lib/utils";

interface MetricsPanelProps {
  metrics: MetricContract[];
  className?: string;
}

export function MetricsPanel({ metrics, className }: MetricsPanelProps) {
  const labMetrics = mapMetricsToLabMetrics(metrics);

  if (labMetrics.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Run a query to collect engineering metrics.
      </p>
    );
  }

  return (
    <MetricGrid className={className}>
      {labMetrics.map((metric) => (
        <MetricCell
          key={metric.id}
          label={metric.label}
          value={metric.value}
          variant={metric.variant}
        />
      ))}
    </MetricGrid>
  );
}
