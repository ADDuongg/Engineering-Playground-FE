import { useMutation } from "@tanstack/react-query";
import { benchmarkKeys } from "@/features/benchmark-runner/constants/query-keys";
import { enqueueBenchmark } from "@/features/benchmark-runner/services/benchmark-service";
import type { EnqueueBenchmarkInput } from "@/features/benchmark-runner/types/benchmark";

export function useEnqueueBenchmark() {
  return useMutation({
    mutationKey: benchmarkKeys.enqueue(),
    mutationFn: (input: EnqueueBenchmarkInput) => enqueueBenchmark(input),
  });
}
