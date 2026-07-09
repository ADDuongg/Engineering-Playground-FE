import { useMutation } from "@tanstack/react-query";
import { datasetKeys } from "@/features/dataset-loader/constants/query-keys";
import { prepareDataset } from "@/features/dataset-loader/services/dataset-service";
import type { PrepareDatasetInput } from "@/features/dataset-loader/types/dataset";

export function usePrepareDataset(sessionId?: string) {
  return useMutation({
    mutationKey: datasetKeys.prepare(sessionId),
    mutationFn: (input: PrepareDatasetInput) => prepareDataset(input),
  });
}
