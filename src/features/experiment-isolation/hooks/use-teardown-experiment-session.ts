import { useMutation } from "@tanstack/react-query";
import { experimentSessionKeys } from "@/features/experiment-isolation/constants/query-keys";
import { teardownExperimentSession } from "@/features/experiment-isolation/services/isolation-service";

export function useTeardownExperimentSession() {
  return useMutation({
    mutationKey: experimentSessionKeys.teardown(),
    mutationFn: (sessionId: string) => teardownExperimentSession(sessionId),
  });
}
