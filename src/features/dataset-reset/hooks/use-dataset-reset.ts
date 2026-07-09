"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { datasetKeys } from "@/features/dataset-loader/constants/query-keys";
import type { DatasetIdentity } from "@/features/dataset-loader/types/dataset";
import { useResetDataset } from "@/features/dataset-reset/hooks/use-reset-dataset";
import { useJobStatus } from "@/features/worker-queue/hooks/use-job-status";
import { isJobTerminalStatus } from "@/features/worker-queue/utils/format-job-error";

interface DatasetResetContext {
  labSlug?: string;
}

interface UseDatasetResetOptions {
  identity: DatasetIdentity;
  sessionId?: string;
  context?: DatasetResetContext;
  enabled?: boolean;
  isDatasetReady?: boolean;
  isResetting?: boolean;
  onResetError?: (error: unknown) => void;
  onResetSuccess?: () => void;
}

export interface DatasetResetState {
  reset: () => void;
  resetError: unknown;
  canReset: boolean;
  isResetInProgress: boolean;
  jobId: string | undefined;
}

export function useDatasetReset({
  identity,
  sessionId,
  context,
  enabled = true,
  isDatasetReady = false,
  isResetting = false,
  onResetError,
  onResetSuccess,
}: UseDatasetResetOptions): DatasetResetState {
  const queryClient = useQueryClient();
  const resetMutation = useResetDataset(sessionId);
  const [jobId, setJobId] = useState<string | undefined>();
  const [terminalNotified, setTerminalNotified] = useState(false);
  const queryScope = { identity, sessionId };

  const jobStatusQuery = useJobStatus(jobId, {
    enabled: enabled && Boolean(jobId),
  });

  const jobStatus = jobStatusQuery.data;
  const isJobActive =
    Boolean(jobId) && (!jobStatus || !isJobTerminalStatus(jobStatus.status));

  const isResetInProgress =
    resetMutation.isPending || isResetting || isJobActive;

  const invalidateDatasetQueries = () => {
    void queryClient.invalidateQueries({
      queryKey: datasetKeys.status(queryScope),
    });
    void queryClient.invalidateQueries({
      queryKey: datasetKeys.metadata(queryScope),
    });
  };

  useEffect(() => {
    if (!jobStatus || terminalNotified) {
      return;
    }

    if (jobStatus.status === "completed") {
      setTerminalNotified(true);
      setJobId(undefined);
      invalidateDatasetQueries();
      onResetSuccess?.();
      return;
    }

    if (jobStatus.status === "failed" || jobStatus.status === "cancelled") {
      setTerminalNotified(true);
      setJobId(undefined);
      invalidateDatasetQueries();
      onResetError?.(
        new Error(
          jobStatus.failureMessage ||
            jobStatus.failureReason ||
            "Dataset reset failed.",
        ),
      );
    }
  }, [jobStatus, onResetError, onResetSuccess, terminalNotified]);

  useEffect(() => {
    if (!jobStatusQuery.error || !jobId || terminalNotified) {
      return;
    }

    setTerminalNotified(true);
    setJobId(undefined);
    onResetError?.(jobStatusQuery.error);
  }, [jobId, jobStatusQuery.error, onResetError, terminalNotified]);

  const reset = () => {
    if (!enabled || isResetInProgress || !isDatasetReady) {
      return;
    }

    setTerminalNotified(false);

    resetMutation.mutate(
      {
        ...identity,
        sessionId,
        context: context?.labSlug ? { labSlug: context.labSlug } : undefined,
      },
      {
        onSuccess: (result) => {
          invalidateDatasetQueries();
          setJobId(result.jobId);
        },
        onError: (error) => {
          setJobId(undefined);
          setTerminalNotified(false);
          onResetError?.(error);
        },
      },
    );
  };

  return {
    reset,
    resetError: resetMutation.error ?? jobStatusQuery.error,
    canReset: enabled && isDatasetReady && !isResetInProgress,
    isResetInProgress,
    jobId,
  };
}
