import { useQuery } from "@tanstack/react-query";
import { labFlowAdminKeys } from "@/features/lab-flow-admin/constants/query-keys";
import { fetchAdminLabCurriculum } from "@/features/lab-flow-admin/services/lab-flow-admin-service";

export function useAdminLabCurriculum(labSlug: string | undefined) {
  return useQuery({
    queryKey: labFlowAdminKeys.curriculum(labSlug ?? ""),
    queryFn: () => fetchAdminLabCurriculum(labSlug!),
    enabled: Boolean(labSlug),
    staleTime: 60 * 1000,
    retry: false,
  });
}
