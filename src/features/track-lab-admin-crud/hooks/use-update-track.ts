import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { updateAdminTrack } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";
import type { UpdateTrackRequest } from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";
import { tracksKeys } from "@/features/tracks/constants/query-keys";

interface UpdateTrackVariables {
  slug: string;
  data: UpdateTrackRequest;
}

export function useUpdateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: UpdateTrackVariables) =>
      updateAdminTrack(slug, data),
    onSuccess: (track) => {
      void queryClient.invalidateQueries({ queryKey: adminTrackLabKeys.tracks() });
      void queryClient.invalidateQueries({
        queryKey: adminTrackLabKeys.track(track.slug),
      });
      void queryClient.invalidateQueries({ queryKey: tracksKeys.list() });
      void queryClient.invalidateQueries({
        queryKey: tracksKeys.detail(track.slug),
      });
      void queryClient.setQueryData(adminTrackLabKeys.track(track.slug), track);
    },
  });
}
