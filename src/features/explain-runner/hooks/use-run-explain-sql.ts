import { useMutation } from "@tanstack/react-query";
import { explainKeys } from "@/features/explain-runner/constants/query-keys";
import { runExplainSql } from "@/features/explain-runner/services/explain-service";
import type { RunExplainInput } from "@/features/explain-runner/types/explain";

export function useRunExplainSql() {
  return useMutation({
    mutationKey: explainKeys.runSql(),
    mutationFn: (input: RunExplainInput) => runExplainSql(input),
  });
}
