import { useQuery } from "@tanstack/react-query";
import { experimentSessionKeys } from "@/features/experiment-isolation/constants/query-keys";
import { fetchExperimentSession } from "@/features/experiment-isolation/services/isolation-service";
import type { ExperimentSessionStatus } from "@/features/experiment-isolation/types/experiment-session";

const POLLING_STATUSES: ExperimentSessionStatus[] = ["provisioning"];

interface UseExperimentSessionOptions {
  enabled?: boolean;
}

export function useExperimentSession(
  sessionId: string | undefined,
  options?: UseExperimentSessionOptions,
) {
  return useQuery({
    queryKey: experimentSessionKeys.detail(sessionId ?? ""),
    queryFn: () => fetchExperimentSession(sessionId!),
    enabled: (options?.enabled ?? true) && !!sessionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && POLLING_STATUSES.includes(status) ? 2000 : false;
    },
  });
}
