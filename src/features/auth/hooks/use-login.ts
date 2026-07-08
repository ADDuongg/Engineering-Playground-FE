import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { login } from "@/features/auth/services/auth-service";
import type { LoginRequest } from "@/features/auth/types/auth";

export function useLogin() {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.tokens);
    },
  });
}
