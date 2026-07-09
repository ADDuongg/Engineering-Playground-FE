import { labSummaryResponseSchema } from "@/features/index-playground/schemas/lab-summary-schema";
import type { LabSummaryResponse } from "@/shared/labs";
import { apiRequest } from "@/shared/services/api-client";

export async function fetchLabSummary(
  labSlug: string,
): Promise<LabSummaryResponse> {
  if (!labSlug.trim()) {
    throw new Error("Lab slug is required.");
  }

  const data = await apiRequest<LabSummaryResponse>({
    path: `/labs/${encodeURIComponent(labSlug)}/summary`,
    method: "GET",
    auth: true,
  });

  return labSummaryResponseSchema.parse(data);
}
