export const adminAuthzKeys = {
  all: ["admin-authz"] as const,
  me: () => [...adminAuthzKeys.all, "me"] as const,
};
