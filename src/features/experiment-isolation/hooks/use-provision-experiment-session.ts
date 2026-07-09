import { useMutation } from "@tanstack/react-query";
import { experimentSessionKeys } from "@/features/experiment-isolation/constants/query-keys";
import { provisionExperimentSession } from "@/features/experiment-isolation/services/isolation-service";
import type { ProvisionExperimentSessionInput } from "@/features/experiment-isolation/types/experiment-session";

export function useProvisionExperimentSession() {
  return useMutation({
    mutationKey: experimentSessionKeys.provision(),
    mutationFn: (input: ProvisionExperimentSessionInput) =>
      provisionExperimentSession(input),
  });
}
