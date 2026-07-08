import { useQuery } from "@tanstack/react-query";
import { tracksKeys } from "@/features/tracks/constants/query-keys";
import { fetchTracks } from "@/features/tracks/services/tracks-service";

export function useTracks() {
  return useQuery({
    queryKey: tracksKeys.list(),
    queryFn: fetchTracks,
    staleTime: 5 * 60 * 1000,
  });
}
