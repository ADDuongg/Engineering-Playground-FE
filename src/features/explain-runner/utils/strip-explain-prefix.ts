const EXPLAIN_PREFIX_PATTERN = /^\s*EXPLAIN\s*(\([^)]*\))?\s*/i;

export function stripExplainPrefix(sql: string): string {
  return sql.replace(EXPLAIN_PREFIX_PATTERN, "").trim();
}
