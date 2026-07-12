import { z } from "zod";
import { labPathItemSchema } from "@/features/progress-tracking/schemas/progress-schema";

export const labListItemSchema = labPathItemSchema.extend({
  trackSlug: z.string().min(1),
  trackName: z.string().min(1),
});

export const labListResponseSchema = z.object({
  labs: z.array(labListItemSchema),
});
