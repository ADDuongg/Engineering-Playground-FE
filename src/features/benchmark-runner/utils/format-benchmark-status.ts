import type { BenchmarkJobStatus } from "@/features/benchmark-runner/types/benchmark";

const STATUS_LABELS: Record<BenchmarkJobStatus, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export function formatBenchmarkStatusLabel(status: BenchmarkJobStatus): string {
  return STATUS_LABELS[status];
}

export function isBenchmarkTerminalStatus(status: BenchmarkJobStatus): boolean {
  return status === "completed" || status === "failed" || status === "cancelled";
}

export function formatBenchmarkRemainingSeconds(
  profileDurationSeconds: number,
  startedAt: string | undefined,
): number | null {
  if (!startedAt) {
    return profileDurationSeconds;
  }

  const elapsedMs = Date.now() - new Date(startedAt).getTime();
  const remaining = profileDurationSeconds - Math.floor(elapsedMs / 1000);

  return Math.max(0, remaining);
}
