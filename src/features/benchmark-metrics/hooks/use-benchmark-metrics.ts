import { useQuery } from "@tanstack/react-query";
import { benchmarkMetricsKeys } from "@/features/benchmark-metrics/constants/query-keys";
import { fetchBenchmarkMetricsByJob } from "@/features/benchmark-metrics/services/benchmark-metrics-service";
import type {
  BenchmarkMetricsStatus,
  GetBenchmarkMetricsQuery,
} from "@/features/benchmark-metrics/types/benchmark-metrics";

interface UseBenchmarkMetricsOptions {
  enabled?: boolean;
  sessionId?: string;
  /** When status embed already has a terminal metricsStatus, skip dedicated fetch. */
  embeddedMetricsStatus?: BenchmarkMetricsStatus;
}

function isTerminalMetricsStatus(
  status: BenchmarkMetricsStatus | undefined,
): boolean {
  return status === "ready" || status === "unavailable";
}

export function useBenchmarkMetrics(
  jobId: string | undefined,
  options?: UseBenchmarkMetricsOptions,
) {
  const query: GetBenchmarkMetricsQuery | undefined = options?.sessionId
    ? { sessionId: options.sessionId }
    : undefined;

  const embeddedTerminal = isTerminalMetricsStatus(
    options?.embeddedMetricsStatus,
  );

  return useQuery({
    queryKey: benchmarkMetricsKeys.byJob(jobId ?? "", query),
    queryFn: () => fetchBenchmarkMetricsByJob(jobId!, query),
    enabled:
      Boolean(jobId) && (options?.enabled ?? true) && !embeddedTerminal,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (queryResult) => {
      if (queryResult.state.error) {
        return false;
      }

      const metricsStatus = queryResult.state.data?.metricsStatus;
      return metricsStatus === "pending" ? 2000 : false;
    },
  });
}
