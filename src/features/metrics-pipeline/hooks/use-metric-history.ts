import { useQuery } from "@tanstack/react-query";
import { metricsKeys } from "@/features/metrics-pipeline/constants/query-keys";
import { fetchMetricHistory } from "@/features/metrics-pipeline/services/metrics-service";
import type { GetMetricHistoryQuery } from "@/features/metrics-pipeline/types/metrics";

interface UseMetricHistoryOptions {
  enabled?: boolean;
}

export function useMetricHistory(
  query: GetMetricHistoryQuery | undefined,
  options?: UseMetricHistoryOptions,
) {
  return useQuery({
    queryKey: metricsKeys.history(query ?? { sessionId: "" }),
    queryFn: () => fetchMetricHistory(query!),
    enabled: (options?.enabled ?? true) && Boolean(query?.sessionId),
  });
}
