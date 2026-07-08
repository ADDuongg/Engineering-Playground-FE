export const AUTH_STORAGE_KEY = "auth-session";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};
