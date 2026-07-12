"use client";

import { useQuery } from "@tanstack/react-query";
import { userAdminKeys } from "@/features/user-admin/constants/query-keys";
import { fetchAdminUserById } from "@/features/user-admin/services/user-admin-service";

export function useAdminUser(userId: string | undefined) {
  return useQuery({
    queryKey: userAdminKeys.detail(userId ?? ""),
    queryFn: () => fetchAdminUserById(userId!),
    enabled: Boolean(userId?.trim()),
    staleTime: 30 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
