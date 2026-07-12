import { useQuery } from "@tanstack/react-query";
import { quizAdminKeys } from "@/features/quiz-admin-crud/constants/query-keys";
import { fetchAdminLabQuiz } from "@/features/quiz-admin-crud/services/quiz-admin-service";

export function useAdminLabQuiz(labSlug: string | undefined) {
  return useQuery({
    queryKey: quizAdminKeys.quiz(labSlug ?? ""),
    queryFn: () => fetchAdminLabQuiz(labSlug!),
    enabled: Boolean(labSlug),
    staleTime: 60 * 1000,
    retry: false,
  });
}
