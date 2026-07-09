import {
  sandboxExecuteResultSchema,
  sqlValidationResultSchema,
} from "@/features/sql-sandbox/schemas/sandbox-schema";
import type {
  SandboxExecuteInput,
  SandboxExecuteResult,
  SqlValidationResult,
} from "@/features/sql-sandbox/types/sandbox";
import { apiRequest } from "@/shared/services/api-client";

export async function executeSandboxedSql(
  input: SandboxExecuteInput,
): Promise<SandboxExecuteResult> {
  const data = await apiRequest<SandboxExecuteResult>({
    path: "/sql/sandbox/execute",
    method: "POST",
    body: input,
    auth: true,
  });

  return sandboxExecuteResultSchema.parse(data);
}

export async function validateSqlStatement(
  input: Pick<SandboxExecuteInput, "sql" | "parameters">,
): Promise<SqlValidationResult> {
  const data = await apiRequest<SqlValidationResult>({
    path: "/sql/sandbox/validate",
    method: "POST",
    body: input,
    auth: true,
  });

  return sqlValidationResultSchema.parse(data);
}
