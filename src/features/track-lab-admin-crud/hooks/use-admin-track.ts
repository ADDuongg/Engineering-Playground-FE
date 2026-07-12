import { useQuery } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { fetchAdminTrackBySlug } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";

export function useAdminTrack(slug: string | undefined) {
  return useQuery({
    queryKey: adminTrackLabKeys.track(slug ?? ""),
    queryFn: () => fetchAdminTrackBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  });
}
