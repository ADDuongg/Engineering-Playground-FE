import { useQuery } from "@tanstack/react-query";
import { sqlRunKeys } from "@/features/sql-execution-queue/constants/query-keys";
import { fetchSqlRunStatus } from "@/features/sql-execution-queue/services/sql-run-service";
import { isSqlRunPollingStatus } from "@/features/sql-execution-queue/utils/format-sql-run-error";

interface UseSqlRunStatusOptions {
  enabled?: boolean;
}

export function useSqlRunStatus(
  jobId: string | undefined,
  options?: UseSqlRunStatusOptions,
) {
  return useQuery({
    queryKey: sqlRunKeys.status(jobId ?? ""),
    queryFn: () => fetchSqlRunStatus(jobId!),
    enabled: Boolean(jobId) && (options?.enabled ?? true),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && isSqlRunPollingStatus(status) ? 2000 : false;
    },
  });
}
