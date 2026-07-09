import { useMutation } from "@tanstack/react-query";
import { sandboxKeys } from "@/features/sql-sandbox/constants/query-keys";
import { executeSandboxedSql } from "@/features/sql-sandbox/services/sandbox-service";
import type { SandboxExecuteInput } from "@/features/sql-sandbox/types/sandbox";

export function useExecuteSql() {
  return useMutation({
    mutationKey: sandboxKeys.execute(),
    mutationFn: (input: SandboxExecuteInput) => executeSandboxedSql(input),
  });
}
