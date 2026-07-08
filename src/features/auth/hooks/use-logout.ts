import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authKeys } from "@/features/auth/constants/query-keys";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getRefreshToken } from "@/features/auth/lib/auth-store";
import { logout } from "@/features/auth/services/auth-service";
import { ROUTES } from "@/shared/constants/routes";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logout({ refreshToken });
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace(ROUTES.login);
    },
  });
}
