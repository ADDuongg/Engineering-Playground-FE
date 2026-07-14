import { useMutation } from "@tanstack/react-query";
import { reactSandboxKeys } from "@/features/react-sandbox-runtime/constants/query-keys";
import { runReactExperiment } from "@/features/react-sandbox-runtime/services/react-sandbox-service";
import type { RunReactExperimentInput } from "@/features/react-sandbox-runtime/types/react-sandbox";

export function useRunReactExperiment() {
  return useMutation({
    mutationKey: reactSandboxKeys.run(),
    mutationFn: (input: RunReactExperimentInput) => runReactExperiment(input),
  });
}
