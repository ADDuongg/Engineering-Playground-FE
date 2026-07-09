import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import { metricContractSchema } from "@/features/metrics-pipeline/schemas/metrics-schema";
import { sqlStatementKindSchema } from "@/features/sql-sandbox/schemas/sandbox-schema";
import { z } from "zod";

export const experimentDatasetIdentitySchema = z.object({
  family: z.string().min(1),
  tier: datasetTierSchema,
  version: z.string().optional(),
});

export const runExperimentSqlInputSchema = z.object({
  sql: z.string().min(1),
  parameters: z.array(z.unknown()),
  dataset: experimentDatasetIdentitySchema,
  sessionId: z.string().optional(),
  context: z
    .object({
      trackSlug: z.string().optional(),
      labSlug: z.string().optional(),
    })
    .optional(),
});

export const experimentResultFieldSchema = z.object({
  name: z.string(),
  dataTypeId: z.number(),
});

export const experimentRunResultSchema = z.object({
  rows: z.array(z.record(z.unknown())),
  rowCount: z.number(),
  truncated: z.boolean(),
  executionTimeMs: z.number(),
  fields: z.array(experimentResultFieldSchema).optional(),
  dataset: z.object({
    family: z.string(),
    tier: datasetTierSchema,
    version: z.string(),
  }),
  statementKind: sqlStatementKindSchema,
  metrics: z.array(metricContractSchema),
  runId: z.string(),
});
