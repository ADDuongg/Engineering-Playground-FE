"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { quizKeys } from "@/features/quiz-engine/constants/query-keys";
import { fetchQuizDefinition } from "@/features/quiz-engine/services/quiz-service";

interface UseQuizDefinitionOptions {
  enabled?: boolean;
}

export function useQuizDefinition(
  labSlug: string | undefined,
  options?: UseQuizDefinitionOptions,
) {
  const { isAuthenticated, isHydrated } = useAuth();

  return useQuery({
    queryKey: quizKeys.definition(labSlug ?? ""),
    queryFn: () => fetchQuizDefinition(labSlug!),
    enabled:
      isHydrated &&
      isAuthenticated &&
      Boolean(labSlug) &&
      (options?.enabled ?? true),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
