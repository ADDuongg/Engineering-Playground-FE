import { useQuery } from "@tanstack/react-query";
import { workerQueueKeys } from "@/features/worker-queue/constants/query-keys";
import { fetchJobStatus } from "@/features/worker-queue/services/job-service";
import {
  isJobPollingStatus,
} from "@/features/worker-queue/utils/format-job-error";

interface UseJobStatusOptions {
  enabled?: boolean;
}

export function useJobStatus(
  jobId: string | undefined,
  options?: UseJobStatusOptions,
) {
  return useQuery({
    queryKey: workerQueueKeys.status(jobId ?? ""),
    queryFn: () => fetchJobStatus(jobId!),
    enabled: Boolean(jobId) && (options?.enabled ?? true),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && isJobPollingStatus(status) ? 2000 : false;
    },
  });
}
