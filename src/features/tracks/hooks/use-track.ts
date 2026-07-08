import { useQuery } from "@tanstack/react-query";
import { tracksKeys } from "@/features/tracks/constants/query-keys";
import { fetchTrackBySlug } from "@/features/tracks/services/tracks-service";
import {
  isTrackNotFoundError,
  isValidTrackSlug,
} from "@/features/tracks/utils/track-slug";

export function useTrack(slug: string) {
  const slugValid = isValidTrackSlug(slug);

  return useQuery({
    queryKey: tracksKeys.detail(slug),
    queryFn: () => fetchTrackBySlug(slug),
    enabled: slugValid,
    staleTime: 5 * 60 * 1000,
    retry: (_, error) => !isTrackNotFoundError(error),
  });
}
