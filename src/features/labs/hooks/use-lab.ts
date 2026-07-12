"use client";

import { useQuery } from "@tanstack/react-query";
import { labsKeys } from "@/features/labs/constants/query-keys";
import { fetchLabBySlug } from "@/features/labs/services/labs-service";

export function useLab(slug: string | undefined) {
  return useQuery({
    queryKey: labsKeys.detail(slug ?? ""),
    queryFn: () => fetchLabBySlug(slug!),
    enabled: Boolean(slug?.trim()),
    staleTime: 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
