import { z } from "zod";

export const quizQuestionTypeSchema = z.literal("single_select");

export const adminQuizOptionViewSchema = z.object({
  id: z.string(),
  label: z.string(),
  sequenceOrder: z.number(),
  isCorrect: z.boolean(),
  createdAt: z.string(),
});

export const adminQuizQuestionViewSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  questionType: quizQuestionTypeSchema,
  sequenceOrder: z.number(),
  options: z.array(adminQuizOptionViewSchema),
  createdAt: z.string(),
});

export const adminQuizViewSchema = z.object({
  id: z.string(),
  labSlug: z.string(),
  title: z.string().nullable(),
  questions: z.array(adminQuizQuestionViewSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const adminQuizQuestionListResponseSchema = z.object({
  questions: z.array(adminQuizQuestionViewSchema),
});

export const adminQuizOptionListResponseSchema = z.object({
  options: z.array(adminQuizOptionViewSchema),
});

export const quizShellFormSchema = z.object({
  title: z.string().max(200).optional(),
});

export const createQuestionOptionFormSchema = z.object({
  label: z.string().min(1, "Option label is required"),
  isCorrect: z.boolean(),
});

export const createQuestionFormSchema = z
  .object({
    prompt: z.string().min(1, "Prompt is required"),
    sequenceOrder: z.coerce.number().int().min(0),
    options: z
      .array(createQuestionOptionFormSchema)
      .min(2, "At least 2 options are required"),
  })
  .superRefine((value, ctx) => {
    const correctCount = value.options.filter((option) => option.isCorrect).length;
    if (correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Exactly one option must be marked correct",
        path: ["options"],
      });
    }
  });

export const updateQuestionFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  sequenceOrder: z.coerce.number().int().min(0),
});

export const optionFormSchema = z.object({
  label: z.string().min(1, "Label is required"),
  sequenceOrder: z.coerce.number().int().min(0),
  isCorrect: z.enum(["true", "false"]),
});

export type QuizShellFormValues = z.infer<typeof quizShellFormSchema>;
export type CreateQuestionFormValues = z.infer<typeof createQuestionFormSchema>;
export type UpdateQuestionFormValues = z.infer<typeof updateQuestionFormSchema>;
export type OptionFormValues = z.infer<typeof optionFormSchema>;
