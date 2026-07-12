import { labListResponseSchema } from "@/features/labs/schemas/labs-schema";
import type {
  LabListItem,
  LabListResponse,
} from "@/features/labs/types/labs";
import { fetchTrackLearningPath } from "@/features/progress-tracking/services/progress-service";
import { fetchTracks } from "@/features/tracks/services/tracks-service";
import { ApiRequestError } from "@/shared/types/api";

export async function fetchLabs(): Promise<LabListResponse> {
  const { tracks } = await fetchTracks();
  const activeTracks = tracks
    .filter((track) => track.status === "active")
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));

  const pathResults = await Promise.all(
    activeTracks.map(async (track) => {
      const path = await fetchTrackLearningPath(track.slug);
      return { track, labs: path.labs };
    }),
  );

  const labs: LabListItem[] = pathResults.flatMap(({ track, labs: trackLabs }) =>
    trackLabs
      .slice()
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder || a.slug.localeCompare(b.slug))
      .map((lab) => ({
        slug: lab.slug,
        title: lab.title,
        description: lab.description,
        sequenceOrder: lab.sequenceOrder,
        status: lab.status,
        trackSlug: track.slug,
        trackName: track.name,
      })),
  );

  return labListResponseSchema.parse({ labs });
}

export async function fetchLabBySlug(slug: string): Promise<LabListItem> {
  if (!slug.trim()) {
    throw new ApiRequestError(400, "VALIDATION_ERROR", "Lab slug is required.");
  }

  const { labs } = await fetchLabs();
  const lab = labs.find((item) => item.slug === slug);

  if (!lab) {
    throw new ApiRequestError(
      404,
      "NOT_FOUND",
      `Lab "${slug}" is not available on this platform.`,
    );
  }

  return lab;
}
