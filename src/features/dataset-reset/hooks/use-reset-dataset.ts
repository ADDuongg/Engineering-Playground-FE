import { useMutation } from "@tanstack/react-query";
import { datasetResetKeys } from "@/features/dataset-reset/constants/query-keys";
import { resetDataset } from "@/features/dataset-reset/services/reset-service";
import type { ResetDatasetInput } from "@/features/dataset-loader/types/dataset";

export function useResetDataset(sessionId?: string) {
  return useMutation({
    mutationKey: datasetResetKeys.reset(sessionId),
    mutationFn: (input: ResetDatasetInput) => resetDataset(input),
  });
}
