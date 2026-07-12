"use client";

import { useQuery } from "@tanstack/react-query";
import { userAdminKeys } from "@/features/user-admin/constants/query-keys";
import { fetchAdminUsers } from "@/features/user-admin/services/user-admin-service";

interface UseAdminUsersOptions {
  page?: number;
  limit?: number;
  q?: string;
  enabled?: boolean;
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const page = options.page ?? 1;
  const limit = options.limit ?? 20;
  const q = options.q?.trim() ?? "";

  return useQuery({
    queryKey: userAdminKeys.list({ page, limit, q }),
    queryFn: () =>
      fetchAdminUsers({
        page,
        limit,
        q: q || undefined,
      }),
    enabled: options.enabled ?? true,
    staleTime: 30 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    placeholderData: (previous) => previous,
  });
}
