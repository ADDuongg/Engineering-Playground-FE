import { useQuery } from "@tanstack/react-query";
import { datasetKeys } from "@/features/dataset-loader/constants/query-keys";
import { fetchDatasetStatus } from "@/features/dataset-loader/services/dataset-service";
import type {
  DatasetIdentity,
  DatasetPreparationState,
} from "@/features/dataset-loader/types/dataset";

const POLLING_STATUSES: DatasetPreparationState[] = ["preparing", "resetting"];

interface UseDatasetStatusOptions {
  enabled?: boolean;
  sessionId?: string;
}

export function useDatasetStatus(
  identity: DatasetIdentity,
  options?: UseDatasetStatusOptions,
) {
  const sessionId = options?.sessionId;

  return useQuery({
    queryKey: datasetKeys.status({ identity, sessionId }),
    queryFn: () => fetchDatasetStatus(identity, sessionId),
    enabled: options?.enabled ?? true,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && POLLING_STATUSES.includes(status) ? 2000 : false;
    },
  });
}
