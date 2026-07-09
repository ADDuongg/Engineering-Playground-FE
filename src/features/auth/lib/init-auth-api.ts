import {
  getAccessToken,
  getRefreshToken,
  useAuthStore,
} from "@/features/auth/lib/auth-store";
import * as authService from "@/features/auth/services/auth-service";
import { ROUTES } from "@/shared/constants/routes";
import { initApiClient } from "@/shared/services/api-client";

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

      if (typeof window === "undefined") {
        return;
      }

      const path = window.location.pathname;
      if (path !== ROUTES.login && path !== ROUTES.register) {
        window.location.assign(ROUTES.login);
      }
    },
  });
}
