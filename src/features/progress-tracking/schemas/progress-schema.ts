import { z } from "zod";

export const labPathItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  sequenceOrder: z.number(),
});

export const trackLearningPathResponseSchema = z.object({
  trackSlug: z.string().min(1),
  labs: z.array(labPathItemSchema),
});

export const trackProgressLabItemSchema = labPathItemSchema.extend({
  completed: z.boolean(),
});

export const trackProgressSummaryResponseSchema = z.object({
  trackSlug: z.string().min(1),
  totalLabs: z.number().int().nonnegative(),
  completedCount: z.number().int().nonnegative(),
  percentComplete: z.number().int().min(0).max(100),
  completedLabSlugs: z.array(z.string()),
  labs: z.array(trackProgressLabItemSchema),
});

export const completeLabResultSchema = z.object({
  labSlug: z.string().min(1),
  trackSlug: z.string().min(1),
  completedAt: z.string().min(1),
  alreadyCompleted: z.boolean(),
});
