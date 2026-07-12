import { useQuery } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { fetchAdminTracks } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";

export function useAdminTracks() {
  return useQuery({
    queryKey: adminTrackLabKeys.tracks(),
    queryFn: fetchAdminTracks,
    staleTime: 60 * 1000,
  });
}
