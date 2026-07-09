import {
  experimentSessionSchema,
  teardownExperimentSessionResultSchema,
} from "@/features/experiment-isolation/schemas/isolation-schema";
import type {
  ExperimentSession,
  ProvisionExperimentSessionInput,
  TeardownExperimentSessionResult,
} from "@/features/experiment-isolation/types/experiment-session";
import { apiRequest } from "@/shared/services/api-client";

export async function provisionExperimentSession(
  input: ProvisionExperimentSessionInput,
): Promise<ExperimentSession> {
  const data = await apiRequest<ExperimentSession>({
    path: "/experiments/sessions",
    method: "POST",
    body: input,
    auth: true,
  });

  return experimentSessionSchema.parse(data);
}

export async function fetchExperimentSession(
  sessionId: string,
): Promise<ExperimentSession> {
  const data = await apiRequest<ExperimentSession>({
    path: `/experiments/sessions/${encodeURIComponent(sessionId)}`,
    method: "GET",
    auth: true,
  });

  return experimentSessionSchema.parse(data);
}

export async function teardownExperimentSession(
  sessionId: string,
): Promise<TeardownExperimentSessionResult> {
  const data = await apiRequest<TeardownExperimentSessionResult>({
    path: `/experiments/sessions/${encodeURIComponent(sessionId)}`,
    method: "DELETE",
    auth: true,
  });

  return teardownExperimentSessionResultSchema.parse(data);
}
