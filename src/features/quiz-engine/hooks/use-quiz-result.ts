"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { quizKeys } from "@/features/quiz-engine/constants/query-keys";
import { fetchQuizResult } from "@/features/quiz-engine/services/quiz-service";

interface UseQuizResultOptions {
  enabled?: boolean;
}

export function useQuizResult(
  labSlug: string | undefined,
  options?: UseQuizResultOptions,
) {
  const { isAuthenticated, isHydrated } = useAuth();

  return useQuery({
    queryKey: quizKeys.result(labSlug ?? ""),
    queryFn: () => fetchQuizResult(labSlug!),
    enabled:
      isHydrated &&
      isAuthenticated &&
      Boolean(labSlug) &&
      (options?.enabled ?? true),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
