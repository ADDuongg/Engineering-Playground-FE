import {
  trackDetailSchema,
  trackListResponseSchema,
} from "@/features/tracks/schemas/track-schema";
import type {
  TrackDetail,
  TrackListResponse,
} from "@/features/tracks/types/track";
import { assertValidTrackSlug } from "@/features/tracks/utils/track-slug";
import { apiRequest } from "@/shared/services/api-client";

export async function fetchTracks(): Promise<TrackListResponse> {
  const data = await apiRequest<TrackListResponse>({
    path: "/tracks",
    method: "GET",
    auth: false,
  });

  return trackListResponseSchema.parse(data);
}

export async function fetchTrackBySlug(slug: string): Promise<TrackDetail> {
  assertValidTrackSlug(slug);

  const data = await apiRequest<TrackDetail>({
    path: `/tracks/${encodeURIComponent(slug)}`,
    method: "GET",
    auth: false,
  });

  return trackDetailSchema.parse(data);
}
