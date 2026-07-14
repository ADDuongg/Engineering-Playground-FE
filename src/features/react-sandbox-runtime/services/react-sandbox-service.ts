import { reactExperimentRunResultSchema } from "@/features/react-sandbox-runtime/schemas/react-sandbox-schema";
import type {
  ReactExperimentRunResult,
  RunReactExperimentInput,
} from "@/features/react-sandbox-runtime/types/react-sandbox";
import { apiRequest } from "@/shared/services/api-client";

export async function runReactExperiment(
  input: RunReactExperimentInput,
): Promise<ReactExperimentRunResult> {
  const data = await apiRequest<ReactExperimentRunResult>({
    path: "/experiments/react/run",
    method: "POST",
    body: input,
    auth: true,
  });

  return reactExperimentRunResultSchema.parse(data);
}
