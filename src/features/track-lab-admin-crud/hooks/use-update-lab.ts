import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { updateAdminLab } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";
import type { UpdateLabRequest } from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";
import { progressKeys } from "@/features/progress-tracking/constants/query-keys";

interface UpdateLabVariables {
  labSlug: string;
  data: UpdateLabRequest;
}

export function useUpdateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ labSlug, data }: UpdateLabVariables) =>
      updateAdminLab(labSlug, data),
    onSuccess: (lab) => {
      void queryClient.invalidateQueries({
        queryKey: adminTrackLabKeys.labs(lab.trackSlug),
      });
      void queryClient.invalidateQueries({
        queryKey: adminTrackLabKeys.lab(lab.slug),
      });
      void queryClient.invalidateQueries({
        queryKey: progressKeys.learningPath(lab.trackSlug),
      });
      void queryClient.invalidateQueries({
        queryKey: progressKeys.track(lab.trackSlug),
      });
    },
  });
}
