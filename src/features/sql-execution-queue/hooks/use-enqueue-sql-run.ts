import { useMutation } from "@tanstack/react-query";
import { sqlRunKeys } from "@/features/sql-execution-queue/constants/query-keys";
import { enqueueSqlRun } from "@/features/sql-execution-queue/services/sql-run-service";
import type { EnqueueSqlRunInput } from "@/features/sql-execution-queue/types/sql-run";

export function useEnqueueSqlRun() {
  return useMutation({
    mutationKey: sqlRunKeys.enqueue(),
    mutationFn: (input: EnqueueSqlRunInput) => enqueueSqlRun(input),
  });
}
