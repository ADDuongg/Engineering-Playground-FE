export const quizKeys = {
  all: ["quiz-engine"] as const,
  definition: (labSlug: string) =>
    [...quizKeys.all, "definition", labSlug] as const,
  result: (labSlug: string) => [...quizKeys.all, "result", labSlug] as const,
};
