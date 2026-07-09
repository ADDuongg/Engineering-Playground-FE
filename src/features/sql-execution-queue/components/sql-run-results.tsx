"use client";

import { ExperimentResultsTable } from "@/features/experiment-runner/components/experiment-results-table";
import type { SqlRunStatusResult } from "@/features/sql-execution-queue/types/sql-run";
import { cn } from "@/shared/lib/utils";

interface SqlRunResultsProps {
  status: SqlRunStatusResult;
  className?: string;
}

export function SqlRunResults({ status, className }: SqlRunResultsProps) {
  if (status.status !== "completed" || !status.executionResult) {
    return null;
  }

  return (
    <ExperimentResultsTable
      result={status.executionResult}
      className={cn(className)}
    />
  );
}
