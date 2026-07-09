export type SqlStatementKind =
  | "SELECT"
  | "EXPLAIN"
  | "EXPLAIN_ANALYZE"
  | "CREATE_INDEX"
  | "DROP_INDEX";

export type SandboxViolationCode =
  | "EMPTY_SQL"
  | "MULTI_STATEMENT"
  | "DISALLOWED_STATEMENT"
  | "BLOCKED_PATTERN"
  | "NON_PARAMETERIZED"
  | "QUERY_TIMEOUT"
  | "ROW_LIMIT_EXCEEDED"
  | "EXECUTION_FAILED";

export interface SandboxExecutionContext {
  requestId?: string;
  trackSlug?: string;
  labSlug?: string;
  userId?: string;
}

export interface SandboxExecuteInput {
  sql: string;
  parameters: unknown[];
  sessionId?: string;
  context?: Pick<SandboxExecutionContext, "trackSlug" | "labSlug">;
}

export interface SandboxResultField {
  name: string;
  dataTypeId: number;
}

export interface SandboxExecuteResult {
  rows: Record<string, unknown>[];
  rowCount: number;
  truncated: boolean;
  executionTimeMs: number;
  fields?: SandboxResultField[];
}

export interface SqlValidationResult {
  valid: true;
  normalizedSql: string;
  statementKind: SqlStatementKind;
}

export interface SandboxErrorDetails {
  violationCode?: SandboxViolationCode;
  hint?: string;
  policyVersion?: string;
}
