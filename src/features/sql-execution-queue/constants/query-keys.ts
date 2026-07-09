export const sqlRunKeys = {
  all: ["sql-execution-queue"] as const,
  enqueue: () => [...sqlRunKeys.all, "enqueue"] as const,
  status: (jobId: string) => [...sqlRunKeys.all, "status", jobId] as const,
};
