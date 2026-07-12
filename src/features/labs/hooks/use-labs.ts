"use client";

import { useQuery } from "@tanstack/react-query";
import { labsKeys } from "@/features/labs/constants/query-keys";
import { fetchLabs } from "@/features/labs/services/labs-service";

export function useLabs() {
  return useQuery({
    queryKey: labsKeys.list(),
    queryFn: fetchLabs,
    staleTime: 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
