import { useMutation, useQueryClient } from "@tanstack/react-query";
import { indexPlaygroundKeys } from "@/features/index-playground/constants/query-keys";
import { labFlowAdminKeys } from "@/features/lab-flow-admin/constants/query-keys";
import {
  createAdminLabCurriculum,
  updateAdminLabCurriculum,
} from "@/features/lab-flow-admin/services/lab-flow-admin-service";
import type {
  CreateLabCurriculumRequest,
  UpdateLabCurriculumRequest,
} from "@/features/lab-flow-admin/types/lab-flow-admin";

function invalidateCurriculumQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  labSlug: string,
) {
  void queryClient.invalidateQueries({
    queryKey: labFlowAdminKeys.curriculum(labSlug),
  });
  void queryClient.invalidateQueries({
    queryKey: indexPlaygroundKeys.summary(labSlug),
  });
}

export function useCreateLabCurriculum(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabCurriculumRequest) =>
      createAdminLabCurriculum(labSlug, data),
    onSuccess: (curriculum) => {
      void queryClient.setQueryData(
        labFlowAdminKeys.curriculum(labSlug),
        curriculum,
      );
      invalidateCurriculumQueries(queryClient, labSlug);
    },
  });
}

export function useUpdateLabCurriculum(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLabCurriculumRequest) =>
      updateAdminLabCurriculum(labSlug, data),
    onSuccess: (curriculum) => {
      void queryClient.setQueryData(
        labFlowAdminKeys.curriculum(labSlug),
        curriculum,
      );
      invalidateCurriculumQueries(queryClient, labSlug);
    },
  });
}
