import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";
import {
  INDEX_PLAYGROUND_SCAN_METRIC_KEYS,
  type IndexPlaygroundScanMetricKey,
} from "@/shared/labs";

export type ScanMetricsMap = Partial<
  Record<IndexPlaygroundScanMetricKey, number>
>;

const PRIMARY_SCAN_KEYS: IndexPlaygroundScanMetricKey[] = [
  "rows_scanned",
  "seq_scan_used",
  "index_scan_used",
];

export function extractScanMetrics(
  metrics: MetricContract[] | undefined,
): ScanMetricsMap {
  if (!metrics?.length) {
    return {};
  }

  const result: ScanMetricsMap = {};

  for (const key of INDEX_PLAYGROUND_SCAN_METRIC_KEYS) {
    const match = metrics.find((metric) => metric.key === key);
    if (match) {
      result[key] = match.value;
    }
  }

  return result;
}

export function hasPrimaryScanMetrics(metrics: ScanMetricsMap): boolean {
  return PRIMARY_SCAN_KEYS.some((key) => metrics[key] !== undefined);
}
