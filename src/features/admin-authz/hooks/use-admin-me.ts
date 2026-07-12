"use client";

import { useQuery } from "@tanstack/react-query";
import { adminAuthzKeys } from "@/features/admin-authz/constants/query-keys";
import { useIsAdmin } from "@/features/admin-authz/hooks/use-is-admin";
import { getAdminMe } from "@/features/admin-authz/services/admin-authz-service";
import { isAdminForbiddenError } from "@/features/admin-authz/utils/format-admin-authz-error";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function useAdminMe() {
  const { isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: adminAuthzKeys.me(),
    queryFn: getAdminMe,
    enabled: isAuthenticated && isAdmin,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (isAdminForbiddenError(error)) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
