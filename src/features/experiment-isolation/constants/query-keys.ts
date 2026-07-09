export const experimentSessionKeys = {
  all: ["experiment-isolation"] as const,
  detail: (sessionId: string) =>
    [...experimentSessionKeys.all, "session", sessionId] as const,
  provision: () => [...experimentSessionKeys.all, "provision"] as const,
  teardown: () => [...experimentSessionKeys.all, "teardown"] as const,
};
