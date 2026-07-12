import { useMutation, useQueryClient } from "@tanstack/react-query";
import { indexPlaygroundKeys } from "@/features/index-playground/constants/query-keys";
import { labFlowAdminKeys } from "@/features/lab-flow-admin/constants/query-keys";
import {
  createAdminLabStep,
  deleteAdminLabStep,
  reorderAdminLabSteps,
  updateAdminLabStep,
} from "@/features/lab-flow-admin/services/lab-flow-admin-service";
import type {
  CreateLabGuidedStepRequest,
  ReorderLabGuidedStepsRequest,
  UpdateLabGuidedStepRequest,
} from "@/features/lab-flow-admin/types/lab-flow-admin";

function invalidateStepQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  labSlug: string,
) {
  void queryClient.invalidateQueries({
    queryKey: labFlowAdminKeys.steps(labSlug),
  });
  void queryClient.invalidateQueries({
    queryKey: indexPlaygroundKeys.summary(labSlug),
  });
}

export function useCreateLabStep(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabGuidedStepRequest) =>
      createAdminLabStep(labSlug, data),
    onSuccess: () => {
      invalidateStepQueries(queryClient, labSlug);
    },
  });
}

export function useUpdateLabStep(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stepId,
      data,
    }: {
      stepId: string;
      data: UpdateLabGuidedStepRequest;
    }) => updateAdminLabStep(labSlug, stepId, data),
    onSuccess: () => {
      invalidateStepQueries(queryClient, labSlug);
    },
  });
}

export function useDeleteLabStep(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stepId: string) => deleteAdminLabStep(labSlug, stepId),
    onSuccess: () => {
      invalidateStepQueries(queryClient, labSlug);
    },
  });
}

export function useReorderLabSteps(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderLabGuidedStepsRequest) =>
      reorderAdminLabSteps(labSlug, data),
    onSuccess: () => {
      invalidateStepQueries(queryClient, labSlug);
    },
  });
}
