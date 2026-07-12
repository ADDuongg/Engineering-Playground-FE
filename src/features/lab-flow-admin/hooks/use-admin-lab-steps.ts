import { useQuery } from "@tanstack/react-query";
import { labFlowAdminKeys } from "@/features/lab-flow-admin/constants/query-keys";
import { fetchAdminLabSteps } from "@/features/lab-flow-admin/services/lab-flow-admin-service";

export function useAdminLabSteps(labSlug: string | undefined) {
  return useQuery({
    queryKey: labFlowAdminKeys.steps(labSlug ?? ""),
    queryFn: () => fetchAdminLabSteps(labSlug!),
    enabled: Boolean(labSlug),
    staleTime: 60 * 1000,
  });
}
