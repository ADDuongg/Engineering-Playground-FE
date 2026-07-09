import { formatMetricValue } from "@/features/metrics-pipeline/utils/format-metric-value";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";
import type { LabMetric } from "@/shared/types/lab";

function inferMetricVariant(
  metric: MetricContract,
): LabMetric["variant"] | undefined {
  if (metric.key === "execution_time_ms" || metric.key === "time") {
    if (metric.value > 1000) return "bad";
    if (metric.value < 100) return "good";
  }

  if (
    metric.key === "latency_avg_ms" ||
    metric.key === "latency_p95_ms" ||
    metric.key === "latency_p99_ms"
  ) {
    if (metric.value > 500) return "bad";
    if (metric.value < 50) return "good";
  }

  if (metric.key === "error_rate_pct") {
    if (metric.value > 1) return "bad";
    if (metric.value === 0) return "good";
  }

  if (metric.key === "index_used" || metric.key === "index") {
    return metric.value > 0 ? "good" : "bad";
  }

  if (metric.key === "seq_scan_used") {
    return metric.value > 0 ? "bad" : "good";
  }

  if (metric.key === "index_scan_used") {
    return metric.value > 0 ? "good" : "bad";
  }

  if (metric.key === "rows_scanned") {
    if (metric.value > 100_000) return "bad";
    if (metric.value < 100) return "good";
  }

  return undefined;
}

export function mapMetricsToLabMetrics(metrics: MetricContract[]): LabMetric[] {
  return metrics.map((metric) => ({
    id: metric.key,
    label: metric.label,
    value: formatMetricValue(metric.value, metric.unit),
    variant: inferMetricVariant(metric),
  }));
}
