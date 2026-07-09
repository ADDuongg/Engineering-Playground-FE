import { useMutation } from "@tanstack/react-query";
import { sandboxKeys } from "@/features/sql-sandbox/constants/query-keys";
import { validateSqlStatement } from "@/features/sql-sandbox/services/sandbox-service";

export function useValidateSql() {
  return useMutation({
    mutationKey: sandboxKeys.validate(),
    mutationFn: validateSqlStatement,
  });
}
