import { z } from "zod";

export const quizOptionPublicSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  sequenceOrder: z.number(),
});

export const quizQuestionPublicSchema = z.object({
  id: z.string().uuid(),
  prompt: z.string().min(1),
  sequenceOrder: z.number(),
  questionType: z.literal("single_select"),
  options: z.array(quizOptionPublicSchema),
});

export const quizDefinitionResponseSchema = z.object({
  labSlug: z.string().min(1),
  trackSlug: z.string().min(1),
  title: z.string().nullable(),
  questions: z.array(quizQuestionPublicSchema),
});

export const submitQuizAnswerSchema = z.object({
  questionId: z.string().uuid(),
  optionId: z.string().uuid(),
});

export const submitQuizRequestSchema = z.object({
  answers: z.array(submitQuizAnswerSchema).min(1),
});

export const submitQuizResultSchema = z.object({
  labSlug: z.string().min(1),
  trackSlug: z.string().min(1),
  correctCount: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  percentCorrect: z.number().int().min(0).max(100),
  passed: z.boolean(),
  attemptedAt: z.string().min(1),
  incorrectQuestionIds: z.array(z.string().uuid()),
  labCompleted: z.boolean(),
  alreadyLabCompleted: z.boolean(),
});

export const quizResultStatusSchema = z.enum([
  "not_attempted",
  "failed",
  "passed",
]);

export const quizResultSummaryResponseSchema = z.object({
  labSlug: z.string().min(1),
  status: quizResultStatusSchema,
  attemptCount: z.number().int().nonnegative(),
  correctCount: z.number().int().nonnegative().optional().nullable(),
  totalQuestions: z.number().int().positive().optional().nullable(),
  percentCorrect: z.number().int().min(0).max(100).optional().nullable(),
  bestAttemptedAt: z.string().optional().nullable(),
});
