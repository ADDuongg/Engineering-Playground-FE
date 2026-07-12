export const quizAdminKeys = {
  all: ["quiz-admin-crud"] as const,
  quiz: (labSlug: string) => [...quizAdminKeys.all, "quiz", labSlug] as const,
};
