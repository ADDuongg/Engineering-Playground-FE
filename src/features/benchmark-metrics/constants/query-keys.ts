import type {
  GetBenchmarkMetricHistoryQuery,
  GetBenchmarkMetricsQuery,
} from "@/features/benchmark-metrics/types/benchmark-metrics";

export const benchmarkMetricsKeys = {
  all: ["benchmark-metrics"] as const,
  byJob: (jobId: string, query?: GetBenchmarkMetricsQuery) =>
    [...benchmarkMetricsKeys.all, "by-job", jobId, query ?? {}] as const,
  history: (query: GetBenchmarkMetricHistoryQuery) =>
    [...benchmarkMetricsKeys.all, "history", query] as const,
};
