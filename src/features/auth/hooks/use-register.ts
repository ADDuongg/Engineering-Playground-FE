import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { register } from "@/features/auth/services/auth-service";
import type { RegisterRequest } from "@/features/auth/types/auth";

export function useRegister() {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.tokens);
    },
  });
}
