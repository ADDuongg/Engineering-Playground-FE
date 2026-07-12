import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { createAdminTrack } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";
import type { CreateTrackRequest } from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";
import { tracksKeys } from "@/features/tracks/constants/query-keys";

export function useCreateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrackRequest) => createAdminTrack(data),
    onSuccess: (track) => {
      void queryClient.invalidateQueries({ queryKey: adminTrackLabKeys.tracks() });
      void queryClient.invalidateQueries({ queryKey: tracksKeys.list() });
      void queryClient.setQueryData(adminTrackLabKeys.track(track.slug), track);
    },
  });
}
