import { useQuery } from "@tanstack/react-query";
import { datasetResetKeys } from "@/features/dataset-reset/constants/query-keys";
import { fetchResetStatus } from "@/features/dataset-reset/services/reset-service";
import type {
  DatasetIdentity,
  DatasetPreparationState,
} from "@/features/dataset-loader/types/dataset";

const POLLING_STATUSES: DatasetPreparationState[] = ["resetting"];

interface UseResetStatusOptions {
  enabled?: boolean;
}

export function useResetStatus(
  identity: DatasetIdentity,
  options?: UseResetStatusOptions,
) {
  return useQuery({
    queryKey: datasetResetKeys.status(identity),
    queryFn: () => fetchResetStatus(identity),
    enabled: options?.enabled ?? true,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && POLLING_STATUSES.includes(status) ? 2000 : false;
    },
  });
}
