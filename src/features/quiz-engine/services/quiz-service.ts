import {
  quizDefinitionResponseSchema,
  quizResultSummaryResponseSchema,
  submitQuizRequestSchema,
  submitQuizResultSchema,
} from "@/features/quiz-engine/schemas/quiz-schema";
import type {
  QuizDefinitionResponse,
  QuizResultSummaryResponse,
  SubmitQuizRequest,
  SubmitQuizResult,
} from "@/features/quiz-engine/types/quiz";
import { apiRequest } from "@/shared/services/api-client";

function assertLabSlug(labSlug: string): void {
  if (!labSlug.trim()) {
    throw new Error("Lab slug is required.");
  }
}

export async function fetchQuizDefinition(
  labSlug: string,
): Promise<QuizDefinitionResponse> {
  assertLabSlug(labSlug);

  const data = await apiRequest<QuizDefinitionResponse>({
    path: `/quizzes/labs/${encodeURIComponent(labSlug)}`,
    method: "GET",
    auth: true,
  });

  return quizDefinitionResponseSchema.parse(data);
}

export async function submitQuiz(
  labSlug: string,
  body: SubmitQuizRequest,
): Promise<SubmitQuizResult> {
  assertLabSlug(labSlug);
  const parsedBody = submitQuizRequestSchema.parse(body);

  const data = await apiRequest<SubmitQuizResult>({
    path: `/quizzes/labs/${encodeURIComponent(labSlug)}/submit`,
    method: "POST",
    body: parsedBody,
    auth: true,
  });

  return submitQuizResultSchema.parse(data);
}

export async function fetchQuizResult(
  labSlug: string,
): Promise<QuizResultSummaryResponse> {
  assertLabSlug(labSlug);

  const data = await apiRequest<QuizResultSummaryResponse>({
    path: `/quizzes/labs/${encodeURIComponent(labSlug)}/result`,
    method: "GET",
    auth: true,
  });

  const parsed = quizResultSummaryResponseSchema.parse(data);

  return {
    labSlug: parsed.labSlug,
    status: parsed.status,
    attemptCount: parsed.attemptCount,
    correctCount: parsed.correctCount ?? undefined,
    totalQuestions: parsed.totalQuestions ?? undefined,
    percentCorrect: parsed.percentCorrect ?? undefined,
    bestAttemptedAt: parsed.bestAttemptedAt ?? undefined,
  };
}
