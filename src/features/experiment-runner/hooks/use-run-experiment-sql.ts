import { useMutation } from "@tanstack/react-query";
import { experimentKeys } from "@/features/experiment-runner/constants/query-keys";
import { runExperimentSql } from "@/features/experiment-runner/services/experiment-service";
import type { RunExperimentSqlInput } from "@/features/experiment-runner/types/experiment";

export function useRunExperimentSql() {
  return useMutation({
    mutationKey: experimentKeys.runSql(),
    mutationFn: (input: RunExperimentSqlInput) => runExperimentSql(input),
  });
}
