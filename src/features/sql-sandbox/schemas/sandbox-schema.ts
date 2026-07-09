import { z } from "zod";

export const sqlStatementKindSchema = z.enum([
  "SELECT",
  "EXPLAIN",
  "EXPLAIN_ANALYZE",
  "CREATE_INDEX",
  "DROP_INDEX",
]);

export const sandboxResultFieldSchema = z.object({
  name: z.string(),
  dataTypeId: z.number(),
});

export const sandboxExecuteResultSchema = z.object({
  rows: z.array(z.record(z.unknown())),
  rowCount: z.number(),
  truncated: z.boolean(),
  executionTimeMs: z.number(),
  fields: z.array(sandboxResultFieldSchema).optional(),
});

export const sqlValidationResultSchema = z.object({
  valid: z.literal(true),
  normalizedSql: z.string(),
  statementKind: sqlStatementKindSchema,
});

export const sandboxExecuteInputSchema = z.object({
  sql: z.string().min(1),
  parameters: z.array(z.unknown()),
  sessionId: z.string().optional(),
  context: z
    .object({
      trackSlug: z.string().optional(),
      labSlug: z.string().optional(),
    })
    .optional(),
});
