import { useQuery } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { fetchAdminLabsByTrack } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";

export function useAdminLabs(trackSlug: string | undefined) {
  return useQuery({
    queryKey: adminTrackLabKeys.labs(trackSlug ?? ""),
    queryFn: () => fetchAdminLabsByTrack(trackSlug!),
    enabled: Boolean(trackSlug),
    staleTime: 60 * 1000,
  });
}
