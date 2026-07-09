import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import type { ExplainPlanNode } from "@/features/explain-runner/types/explain";
import { metricContractSchema } from "@/features/metrics-pipeline/schemas/metrics-schema";
import { z } from "zod";

export const explainModeSchema = z.enum(["explain", "explain_analyze"]);

export const explainStatementKindSchema = z.enum(["explain", "explain_analyze"]);

export const explainDatasetIdentitySchema = z.object({
  family: z.string().min(1),
  tier: datasetTierSchema,
  version: z.string().optional(),
});

export const runExplainInputSchema = z.object({
  sql: z.string().min(1),
  parameters: z.array(z.unknown()),
  explainMode: explainModeSchema,
  dataset: explainDatasetIdentitySchema,
  sessionId: z.string().optional(),
  context: z
    .object({
      trackSlug: z.string().optional(),
      labSlug: z.string().optional(),
    })
    .optional(),
});

export const explainPlanNodeSchema: z.ZodType<ExplainPlanNode> = z.lazy(() =>
  z.object({
    nodeType: z.string(),
    relationName: z.string().optional(),
    alias: z.string().optional(),
    startupCost: z.number().optional(),
    totalCost: z.number().optional(),
    planRows: z.number().optional(),
    planWidth: z.number().optional(),
    actualStartupTime: z.number().optional(),
    actualTotalTime: z.number().optional(),
    actualRows: z.number().optional(),
    actualLoops: z.number().optional(),
    filter: z.string().optional(),
    indexName: z.string().optional(),
    indexCond: z.string().optional(),
    joinType: z.string().optional(),
    hashCond: z.string().optional(),
    mergeCond: z.string().optional(),
    sortKey: z.array(z.string()).optional(),
    groupKey: z.array(z.string()).optional(),
    output: z.array(z.string()).optional(),
    children: z.array(explainPlanNodeSchema).optional(),
  }),
);

export const explainRunResultSchema = z.object({
  plan: explainPlanNodeSchema,
  planningTimeMs: z.number().optional(),
  executionTimeMs: z.number(),
  explainMode: explainModeSchema,
  statementKind: explainStatementKindSchema,
  dataset: z.object({
    family: z.string(),
    tier: datasetTierSchema,
    version: z.string(),
  }),
  truncated: z.boolean().optional(),
  rawPlanText: z.string().optional(),
  metrics: z.array(metricContractSchema),
  runId: z.string(),
});
