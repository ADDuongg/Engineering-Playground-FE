import { useQuery } from "@tanstack/react-query";
import { datasetKeys } from "@/features/dataset-loader/constants/query-keys";
import { fetchDatasetMetadata } from "@/features/dataset-loader/services/dataset-service";
import type { DatasetIdentity } from "@/features/dataset-loader/types/dataset";

interface UseDatasetMetadataOptions {
  enabled?: boolean;
  sessionId?: string;
}

export function useDatasetMetadata(
  identity: DatasetIdentity,
  options?: UseDatasetMetadataOptions,
) {
  const sessionId = options?.sessionId;

  return useQuery({
    queryKey: datasetKeys.metadata({ identity, sessionId }),
    queryFn: () => fetchDatasetMetadata(identity, sessionId),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });
}
