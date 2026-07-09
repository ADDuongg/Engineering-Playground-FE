"use client";

import { useQuery } from "@tanstack/react-query";
import { progressKeys } from "@/features/progress-tracking/constants/query-keys";
import { fetchTrackLearningPath } from "@/features/progress-tracking/services/progress-service";
import { isValidTrackSlug } from "@/features/tracks/utils/track-slug";

interface UseTrackLearningPathOptions {
  enabled?: boolean;
}

export function useTrackLearningPath(
  trackSlug: string | undefined,
  options?: UseTrackLearningPathOptions,
) {
  return useQuery({
    queryKey: progressKeys.learningPath(trackSlug ?? ""),
    queryFn: () => fetchTrackLearningPath(trackSlug!),
    enabled:
      Boolean(trackSlug) &&
      isValidTrackSlug(trackSlug!) &&
      (options?.enabled ?? true),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
