import { useQuery } from "@tanstack/react-query";
import { benchmarkKeys } from "@/features/benchmark-runner/constants/query-keys";
import { mapJobStatusToBenchmark } from "@/features/benchmark-runner/services/benchmark-service";
import type { BenchmarkJobStatus } from "@/features/benchmark-runner/types/benchmark";
import { fetchJobStatus } from "@/features/worker-queue/services/job-service";

const POLLING_STATUSES: BenchmarkJobStatus[] = ["queued", "running"];

interface UseBenchmarkStatusOptions {
  enabled?: boolean;
  /** When false, never poll — used after SSE terminal handoff for a one-shot status read. */
  pollWhileLive?: boolean;
  fallbackProfile?: {
    rps: number;
    durationSeconds: number;
  };
}

export function useBenchmarkStatus(
  jobId: string | undefined,
  options?: UseBenchmarkStatusOptions,
) {
  const fallbackProfile = options?.fallbackProfile;
  const pollWhileLive = options?.pollWhileLive ?? true;

  return useQuery({
    queryKey: benchmarkKeys.status(jobId ?? ""),
    queryFn: async () => {
      const job = await fetchJobStatus(jobId!);
      return mapJobStatusToBenchmark(job, fallbackProfile);
    },
    enabled: Boolean(jobId) && (options?.enabled ?? true),
    refetchInterval: (query) => {
      if (!pollWhileLive) {
        return false;
      }
      const status = query.state.data?.status;
      return status && POLLING_STATUSES.includes(status) ? 2000 : false;
    },
  });
}
