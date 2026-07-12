"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userAdminKeys } from "@/features/user-admin/constants/query-keys";
import { updateAdminUserRole } from "@/features/user-admin/services/user-admin-service";
import type { UpdateAdminUserRoleRequest } from "@/features/user-admin/types/user-admin";

export function useUpdateAdminUserRole(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateAdminUserRoleRequest) =>
      updateAdminUserRole(userId, body),
    onSuccess: (user) => {
      void queryClient.setQueryData(userAdminKeys.detail(userId), user);
      void queryClient.invalidateQueries({ queryKey: userAdminKeys.lists() });
    },
  });
}
