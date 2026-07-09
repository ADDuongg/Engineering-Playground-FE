"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { progressKeys } from "@/features/progress-tracking/constants/query-keys";
import { fetchTrackProgress } from "@/features/progress-tracking/services/progress-service";
import { isValidTrackSlug } from "@/features/tracks/utils/track-slug";

interface UseTrackProgressOptions {
  enabled?: boolean;
}

export function useTrackProgress(
  trackSlug: string | undefined,
  options?: UseTrackProgressOptions,
) {
  const { isAuthenticated, isHydrated } = useAuth();

  return useQuery({
    queryKey: progressKeys.track(trackSlug ?? ""),
    queryFn: () => fetchTrackProgress(trackSlug!),
    enabled:
      isHydrated &&
      isAuthenticated &&
      Boolean(trackSlug) &&
      isValidTrackSlug(trackSlug!) &&
      (options?.enabled ?? true),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
