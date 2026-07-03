import type { DashboardStats } from "../types/dashboard";

/** @unimplemented — wire to API when backend is available */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  throw new Error("fetchDashboardStats is not implemented");
}
