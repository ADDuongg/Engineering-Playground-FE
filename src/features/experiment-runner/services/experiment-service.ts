import { experimentRunResultSchema } from "@/features/experiment-runner/schemas/experiment-schema";
import type {
  ExperimentRunResult,
  RunExperimentSqlInput,
} from "@/features/experiment-runner/types/experiment";
import { apiRequest } from "@/shared/services/api-client";

export async function runExperimentSql(
  input: RunExperimentSqlInput,
): Promise<ExperimentRunResult> {
  const data = await apiRequest<ExperimentRunResult>({
    path: "/experiments/sql/run",
    method: "POST",
    body: input,
    auth: true,
  });

  return experimentRunResultSchema.parse(data);
}
