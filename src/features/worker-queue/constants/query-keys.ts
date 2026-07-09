export const workerQueueKeys = {
  all: ["worker-queue"] as const,
  status: (jobId: string) => [...workerQueueKeys.all, "status", jobId] as const,
};
