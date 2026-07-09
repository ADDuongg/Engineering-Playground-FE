"use client";

import { useCallback, useEffect, useState } from "react";
import { useEnqueueSqlRun } from "@/features/sql-execution-queue/hooks/use-enqueue-sql-run";
import { useSqlRunStatus } from "@/features/sql-execution-queue/hooks/use-sql-run-status";
import type {
  SqlRunContext,
  SqlRunDatasetIdentity,
  SqlRunStatusResult,
} from "@/features/sql-execution-queue/types/sql-run";

interface UseSqlRunOptions {
  sessionId?: string;
  context?: SqlRunContext;
  enabled?: boolean;
  onEnqueueError?: (error: unknown) => void;
  onCompleted?: (result: SqlRunStatusResult) => void;
  onFailed?: (result: SqlRunStatusResult) => void;
}

export interface SqlRunState {
  run: (input: {
    sql: string;
    parameters?: unknown[];
    dataset: SqlRunDatasetIdentity;
  }) => void;
  reset: () => void;
  jobId: string | undefined;
  status: SqlRunStatusResult | undefined;
  isEnqueueing: boolean;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  enqueueError: unknown;
  statusError: unknown;
  canRun: boolean;
}

export function useSqlRun({
  sessionId,
  context,
  enabled = true,
  onEnqueueError,
  onCompleted,
  onFailed,
}: UseSqlRunOptions): SqlRunState {
  const enqueueMutation = useEnqueueSqlRun();
  const [jobId, setJobId] = useState<string | undefined>();
  const [terminalNotified, setTerminalNotified] = useState(false);

  const statusQuery = useSqlRunStatus(jobId, {
    enabled: enabled && Boolean(jobId),
  });

  const status = statusQuery.data;
  const isActive =
    Boolean(jobId) &&
    (!status || status.status === "queued" || status.status === "running");
  const isCompleted = status?.status === "completed";
  const isFailed =
    status?.status === "failed" || status?.status === "cancelled";
  const canRun =
    enabled && Boolean(sessionId) && !isActive && !enqueueMutation.isPending;

  useEffect(() => {
    if (!status || terminalNotified) {
      return;
    }

    if (status.status === "completed") {
      setTerminalNotified(true);
      onCompleted?.(status);
      return;
    }

    if (status.status === "failed" || status.status === "cancelled") {
      setTerminalNotified(true);
      onFailed?.(status);
    }
  }, [onCompleted, onFailed, status, terminalNotified]);

  const run = useCallback(
    (input: {
      sql: string;
      parameters?: unknown[];
      dataset: SqlRunDatasetIdentity;
    }) => {
      if (!sessionId || !canRun) {
        return;
      }

      setTerminalNotified(false);

      enqueueMutation.mutate(
        {
          sql: input.sql,
          parameters: input.parameters,
          sessionId,
          dataset: input.dataset,
          context,
        },
        {
          onSuccess: (result) => {
            setJobId(result.jobId);
          },
          onError: (error) => {
            onEnqueueError?.(error);
          },
        },
      );
    },
    [canRun, context, enqueueMutation, onEnqueueError, sessionId],
  );

  const reset = useCallback(() => {
    setJobId(undefined);
    setTerminalNotified(false);
    enqueueMutation.reset();
  }, [enqueueMutation]);

  return {
    run,
    reset,
    jobId,
    status,
    isEnqueueing: enqueueMutation.isPending,
    isActive,
    isCompleted,
    isFailed,
    enqueueError: enqueueMutation.error,
    statusError: statusQuery.error,
    canRun,
  };
}
