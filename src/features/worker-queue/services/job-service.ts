import { getJobStatusResultSchema } from "@/features/worker-queue/schemas/job-schema";
import type { GetJobStatusResult } from "@/features/worker-queue/types/job";
import { apiRequest } from "@/shared/services/api-client";

export async function fetchJobStatus(jobId: string): Promise<GetJobStatusResult> {
  const data = await apiRequest<GetJobStatusResult>({
    path: `/jobs/${encodeURIComponent(jobId)}`,
    method: "GET",
    auth: true,
  });

  return getJobStatusResultSchema.parse(data);
}
