import { explainRunResultSchema } from "@/features/explain-runner/schemas/explain-schema";
import type {
  ExplainRunResult,
  RunExplainInput,
} from "@/features/explain-runner/types/explain";
import { apiRequest } from "@/shared/services/api-client";

export async function runExplainSql(
  input: RunExplainInput,
): Promise<ExplainRunResult> {
  const data = await apiRequest<ExplainRunResult>({
    path: "/experiments/sql/explain",
    method: "POST",
    body: input,
    auth: true,
  });

  return explainRunResultSchema.parse(data);
}
