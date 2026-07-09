"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { indexPlaygroundKeys } from "@/features/index-playground/constants/query-keys";
import { fetchLabSummary } from "@/features/index-playground/services/lab-summary-service";

interface UseLabSummaryOptions {
  enabled?: boolean;
}

export function useLabSummary(
  labSlug: string | undefined,
  options?: UseLabSummaryOptions,
) {
  const { isAuthenticated, isHydrated } = useAuth();

  return useQuery({
    queryKey: indexPlaygroundKeys.summary(labSlug ?? ""),
    queryFn: () => fetchLabSummary(labSlug!),
    enabled:
      isHydrated &&
      isAuthenticated &&
      Boolean(labSlug) &&
      (options?.enabled ?? true),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
