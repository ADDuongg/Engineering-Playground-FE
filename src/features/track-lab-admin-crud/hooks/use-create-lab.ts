import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { createAdminLab } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";
import type { CreateLabRequest } from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";
import { progressKeys } from "@/features/progress-tracking/constants/query-keys";

interface CreateLabVariables {
  trackSlug: string;
  data: CreateLabRequest;
}

export function useCreateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trackSlug, data }: CreateLabVariables) =>
      createAdminLab(trackSlug, data),
    onSuccess: (lab) => {
      void queryClient.invalidateQueries({
        queryKey: adminTrackLabKeys.labs(lab.trackSlug),
      });
      void queryClient.setQueryData(adminTrackLabKeys.lab(lab.slug), lab);
      void queryClient.invalidateQueries({
        queryKey: progressKeys.learningPath(lab.trackSlug),
      });
      void queryClient.invalidateQueries({
        queryKey: progressKeys.track(lab.trackSlug),
      });
    },
  });
}
