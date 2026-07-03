import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../constants/query-keys";
import { fetchDashboardStats } from "../services/dashboard-service";

/** @unimplemented — returns static placeholder until API is wired */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
    enabled: false,
  });
}
