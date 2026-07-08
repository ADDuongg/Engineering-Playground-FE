import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/constants/query-keys";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/features/auth/lib/auth-store";
import { getMe } from "@/features/auth/services/auth-service";

export function useMe() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const user = await getMe();
      const tokens = useAuthStore.getState().tokens;
      if (tokens) {
        useAuthStore.getState().setAuth(user, tokens);
      }
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
