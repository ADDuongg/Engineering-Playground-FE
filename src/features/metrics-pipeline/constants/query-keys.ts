import type { GetMetricHistoryQuery } from "@/features/metrics-pipeline/types/metrics";

export const metricsKeys = {
  all: ["metrics-pipeline"] as const,
  history: (query: GetMetricHistoryQuery) =>
    [...metricsKeys.all, "history", query] as const,
};
