"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { progressKeys } from "@/features/progress-tracking/constants/query-keys";
import { completeLab } from "@/features/progress-tracking/services/progress-service";

export function useCompleteLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...progressKeys.all, "complete"] as const,
    mutationFn: (labSlug: string) => completeLab(labSlug),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: progressKeys.track(result.trackSlug),
      });
    },
  });
}
