import { useQuery } from "@tanstack/react-query";
import { adminTrackLabKeys } from "@/features/track-lab-admin-crud/constants/query-keys";
import { fetchAdminLabBySlug } from "@/features/track-lab-admin-crud/services/admin-track-lab-service";

export function useAdminLab(labSlug: string | undefined) {
  return useQuery({
    queryKey: adminTrackLabKeys.lab(labSlug ?? ""),
    queryFn: () => fetchAdminLabBySlug(labSlug!),
    enabled: Boolean(labSlug),
    staleTime: 60 * 1000,
  });
}
