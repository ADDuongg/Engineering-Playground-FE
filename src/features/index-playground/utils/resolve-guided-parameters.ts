import type { LabGuidedStep, LabSummaryResponse } from "@/shared/labs";
import { resolveApplySql } from "@/shared/labs";
import { stripExplainPrefix } from "@/features/explain-runner/utils/strip-explain-prefix";

function normalizeSql(sql: string): string {
  return stripExplainPrefix(sql).replace(/\s+/g, " ").trim().toLowerCase();
}

function collectGuidedSqlCandidates(
  summary: LabSummaryResponse,
): Array<{ sql: string; parameters: unknown[] }> {
  const candidates: Array<{ sql: string; parameters: unknown[] }> = [];

  for (const step of summary.guidedSteps) {
    const apply = resolveApplySql(step);
    if (apply) {
      candidates.push(apply);
    }
  }

  // Legacy top-level fallback for older clients / partial payloads
  if (summary.recommendedQuery?.sql) {
    candidates.push({
      sql: summary.recommendedQuery.sql,
      parameters: summary.recommendedQuery.exampleParameters,
    });
  }
  if (summary.recommendedCreateIndexSql) {
    candidates.push({
      sql: summary.recommendedCreateIndexSql,
      parameters: [],
    });
  }
  if (summary.recommendedDropIndexSql) {
    candidates.push({
      sql: summary.recommendedDropIndexSql,
      parameters: [],
    });
  }

  return candidates;
}

/**
 * Resolve bound parameters for guided lab runs.
 * Prefer matching against step.payload Apply SQL; fall back to top-level fields.
 * CREATE/DROP INDEX use `[]`. Keep `$1` in SQL — never inline bound values.
 */
export function resolveGuidedParameters(
  sql: string,
  summary: LabSummaryResponse | undefined,
): unknown[] {
  if (!summary) {
    return [];
  }

  const normalized = normalizeSql(sql);
  const candidates = collectGuidedSqlCandidates(summary);

  for (const candidate of candidates) {
    if (normalizeSql(candidate.sql) === normalized) {
      return candidate.parameters;
    }
  }

  // User kept $n placeholders from a guided SELECT but edited whitespace lightly
  const placeholderCount = (sql.match(/\$\d+/g) ?? []).length;
  if (placeholderCount === 0) {
    return [];
  }

  const selectCandidates = candidates.filter(
    (candidate) => candidate.parameters.length === placeholderCount,
  );

  for (const candidate of selectCandidates) {
    const candidateNormalized = normalizeSql(candidate.sql);
    if (
      candidateNormalized.includes("from users") &&
      candidateNormalized.includes("email") &&
      normalized.includes("from users") &&
      normalized.includes("email")
    ) {
      return candidate.parameters;
    }
  }

  return [];
}

export function resolveApplySqlFromSummaryStep(
  step: LabGuidedStep,
  summary: LabSummaryResponse,
): { sql: string; parameters: unknown[] } | null {
  const fromPayload = resolveApplySql(step);
  if (fromPayload) {
    return fromPayload;
  }

  // Legacy fallback when payload is missing
  switch (step.action) {
    case "run_sql":
    case "run_explain":
    case "run_explain_analyze":
      if (!summary.recommendedQuery?.sql) {
        return null;
      }
      return {
        sql: summary.recommendedQuery.sql,
        parameters: summary.recommendedQuery.exampleParameters,
      };
    case "create_index_sql":
      if (!summary.recommendedCreateIndexSql) {
        return null;
      }
      return {
        sql: summary.recommendedCreateIndexSql,
        parameters: [],
      };
    case "drop_index_sql":
      if (!summary.recommendedDropIndexSql) {
        return null;
      }
      return {
        sql: summary.recommendedDropIndexSql,
        parameters: [],
      };
    default:
      return null;
  }
}
