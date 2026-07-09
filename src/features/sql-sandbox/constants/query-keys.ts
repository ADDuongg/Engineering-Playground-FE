export const sandboxKeys = {
  all: ["sql-sandbox"] as const,
  execute: () => [...sandboxKeys.all, "execute"] as const,
  validate: () => [...sandboxKeys.all, "validate"] as const,
};
