export const reactSandboxKeys = {
  all: ["react-sandbox-runtime"] as const,
  run: () => [...reactSandboxKeys.all, "run"] as const,
};
