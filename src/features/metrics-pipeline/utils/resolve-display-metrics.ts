import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";

export function resolveDisplayMetrics(
  executionMetrics?: MetricContract[],
  explainMetrics?: MetricContract[],
): MetricContract[] {
  const primary = executionMetrics?.length ? executionMetrics : explainMetrics;

  if (!primary?.length) {
    return [];
  }

  if (!executionMetrics?.length || !explainMetrics?.length) {
    return primary;
  }

  const merged = new Map<string, MetricContract>();

  for (const metric of executionMetrics) {
    merged.set(metric.key, metric);
  }

  for (const metric of explainMetrics) {
    if (!merged.has(metric.key)) {
      merged.set(metric.key, metric);
    }
  }

  return Array.from(merged.values());
}
