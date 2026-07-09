import type { LabSummaryResponse } from "@/shared/labs";
import { stripExplainPrefix } from "@/features/explain-runner/utils/strip-explain-prefix";

function normalizeSql(sql: string): string {
  return stripExplainPrefix(sql).replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Resolve bound parameters for Index Playground runs.
 * Guided SELECT/EXPLAIN must send `exampleParameters` (keep `$1` in SQL).
 * CREATE/DROP INDEX use `[]`.
 */
export function resolveGuidedParameters(
  sql: string,
  summary: LabSummaryResponse | undefined,
): unknown[] {
  if (!summary) {
    return [];
  }

  const normalized = normalizeSql(sql);
  const recommended = normalizeSql(summary.recommendedQuery.sql);
  const createIndex = normalizeSql(summary.recommendedCreateIndexSql);
  const dropIndex = normalizeSql(summary.recommendedDropIndexSql);

  if (normalized === createIndex || normalized === dropIndex) {
    return [];
  }

  if (normalized === recommended) {
    return summary.recommendedQuery.exampleParameters;
  }

  // User kept $n placeholders from the guided query but edited whitespace/comments lightly
  const placeholderCount = (sql.match(/\$\d+/g) ?? []).length;
  if (
    placeholderCount > 0 &&
    placeholderCount === summary.recommendedQuery.exampleParameters.length &&
    normalized.includes("from users") &&
    normalized.includes("email")
  ) {
    return summary.recommendedQuery.exampleParameters;
  }

  return [];
}
