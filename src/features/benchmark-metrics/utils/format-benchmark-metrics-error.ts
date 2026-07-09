import { ApiRequestError } from "@/shared/types/api";

export function formatBenchmarkMetricsErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "VALIDATION_ERROR") {
      return error.message || "Invalid benchmark metrics request.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Benchmark metrics not found for this job.";
    }

    if (error.code === "FORBIDDEN") {
      return error.message || "You do not have access to these benchmark metrics.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Benchmark metrics could not be loaded.";
}

export function formatBenchmarkMetricsStatusMessage(
  metricsStatus: "pending" | "ready" | "unavailable",
  hint?: string,
): string {
  if (metricsStatus === "pending") {
    return hint || "Collecting benchmark metrics…";
  }

  if (metricsStatus === "unavailable") {
    return (
      hint ||
      "Benchmark metrics could not be collected for this run."
    );
  }

  return hint || "";
}
