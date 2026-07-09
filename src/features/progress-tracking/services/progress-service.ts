import {
  completeLabResultSchema,
  trackLearningPathResponseSchema,
  trackProgressSummaryResponseSchema,
} from "@/features/progress-tracking/schemas/progress-schema";
import type {
  CompleteLabResult,
  TrackLearningPathResponse,
  TrackProgressSummaryResponse,
} from "@/features/progress-tracking/types/progress";
import { assertValidTrackSlug } from "@/features/tracks/utils/track-slug";
import { apiRequest } from "@/shared/services/api-client";

export async function fetchTrackLearningPath(
  trackSlug: string,
): Promise<TrackLearningPathResponse> {
  assertValidTrackSlug(trackSlug);

  const data = await apiRequest<TrackLearningPathResponse>({
    path: `/tracks/${encodeURIComponent(trackSlug)}/learning-path`,
    method: "GET",
    auth: false,
  });

  return trackLearningPathResponseSchema.parse(data);
}

export async function fetchTrackProgress(
  trackSlug: string,
): Promise<TrackProgressSummaryResponse> {
  assertValidTrackSlug(trackSlug);

  const data = await apiRequest<TrackProgressSummaryResponse>({
    path: `/progress/tracks/${encodeURIComponent(trackSlug)}`,
    method: "GET",
    auth: true,
  });

  return trackProgressSummaryResponseSchema.parse(data);
}

export async function completeLab(labSlug: string): Promise<CompleteLabResult> {
  if (!labSlug.trim()) {
    throw new Error("Lab slug is required.");
  }

  const data = await apiRequest<CompleteLabResult>({
    path: `/progress/labs/${encodeURIComponent(labSlug)}/complete`,
    method: "POST",
    body: {},
    auth: true,
  });

  return completeLabResultSchema.parse(data);
}
