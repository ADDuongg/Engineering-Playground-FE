import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AUTH_STORAGE_KEY } from "@/features/auth/constants/query-keys";
import type { AuthTokens, UserProfile } from "@/features/auth/types/auth";

interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isHydrated: boolean;
  setAuth: (user: UserProfile, tokens: AuthTokens) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isHydrated: false,
      setAuth: (user, tokens) => set({ user, tokens }),
      clearAuth: () => set({ user: null, tokens: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function getAccessToken(): string | null {
  return useAuthStore.getState().tokens?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().tokens?.refreshToken ?? null;
}

export function isAuthenticated(): boolean {
  const { tokens } = useAuthStore.getState();
  return Boolean(tokens?.accessToken && tokens?.refreshToken);
}
