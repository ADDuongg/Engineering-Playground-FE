export const benchmarkKeys = {
  all: ["benchmark-runner"] as const,
  enqueue: () => [...benchmarkKeys.all, "enqueue"] as const,
  status: (jobId: string) => [...benchmarkKeys.all, "status", jobId] as const,
};
