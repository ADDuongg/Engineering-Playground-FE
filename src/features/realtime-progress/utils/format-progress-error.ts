import { ApiRequestError } from "@/shared/types/api";

export function formatProgressErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "VALIDATION_ERROR") {
      return error.message || "Invalid progress request. Session may be required.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Benchmark job not found for progress.";
    }

    if (error.code === "FORBIDDEN") {
      return (
        error.message || "You do not have access to this benchmark progress stream."
      );
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Benchmark progress stream failed.";
}

export function formatProgressPhaseLabel(
  phase: "queued" | "running" | "completed" | "failed" | "cancelled",
): string {
  switch (phase) {
    case "queued":
      return "Queued";
    case "running":
      return "Running";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
  }
}

export function formatElapsedMs(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}
