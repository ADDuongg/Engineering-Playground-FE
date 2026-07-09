"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { progressKeys } from "@/features/progress-tracking/constants/query-keys";
import { quizKeys } from "@/features/quiz-engine/constants/query-keys";
import { submitQuiz } from "@/features/quiz-engine/services/quiz-service";
import type { SubmitQuizRequest } from "@/features/quiz-engine/types/quiz";

export function useSubmitQuiz(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...quizKeys.all, "submit", labSlug] as const,
    mutationFn: (body: SubmitQuizRequest) => submitQuiz(labSlug, body),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: quizKeys.result(result.labSlug),
      });

      if (result.passed || result.labCompleted) {
        void queryClient.invalidateQueries({
          queryKey: progressKeys.track(result.trackSlug),
        });
      }
    },
  });
}
