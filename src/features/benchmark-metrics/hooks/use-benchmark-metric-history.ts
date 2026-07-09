import { useQuery } from "@tanstack/react-query";
import { benchmarkMetricsKeys } from "@/features/benchmark-metrics/constants/query-keys";
import { fetchBenchmarkMetricHistory } from "@/features/benchmark-metrics/services/benchmark-metrics-service";
import type { GetBenchmarkMetricHistoryQuery } from "@/features/benchmark-metrics/types/benchmark-metrics";

interface UseBenchmarkMetricHistoryOptions {
  enabled?: boolean;
}

export function useBenchmarkMetricHistory(
  query: GetBenchmarkMetricHistoryQuery | undefined,
  options?: UseBenchmarkMetricHistoryOptions,
) {
  return useQuery({
    queryKey: benchmarkMetricsKeys.history(query ?? { sessionId: "" }),
    queryFn: () => fetchBenchmarkMetricHistory(query!),
    enabled: (options?.enabled ?? true) && Boolean(query?.sessionId),
  });
}
