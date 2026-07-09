export const realtimeProgressKeys = {
  all: ["realtime-progress"] as const,
  stream: (jobId: string) =>
    [...realtimeProgressKeys.all, "stream", jobId] as const,
};
