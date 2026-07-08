import { initApiClient } from "@/shared/services/api-client";
import {
  getAccessToken,
  getRefreshToken,
  useAuthStore,
} from "@/features/auth/lib/auth-store";
import * as authService from "@/features/auth/services/auth-service";

let initialized = false;

export function initAuthApiClient() {
  if (initialized) return;
  initialized = true;

  initApiClient({
    getAccessToken,
    refreshSession: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;

      try {
        const response = await authService.refreshTokens({ refreshToken });
        useAuthStore.getState().setAuth(response.user, response.tokens);
        return true;
      } catch {
        return false;
      }
    },
    onSessionExpired: () => {
      useAuthStore.getState().clearAuth();
    },
  });
}
