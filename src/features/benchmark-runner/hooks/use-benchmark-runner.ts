"use client";

import { useCallback, useEffect, useState } from "react";
import { useEnqueueBenchmark } from "@/features/benchmark-runner/hooks/use-enqueue-benchmark";
import { useBenchmarkStatus } from "@/features/benchmark-runner/hooks/use-benchmark-status";
import type {
  BenchmarkJobStatusResult,
  BenchmarkProfile,
  BenchmarkTarget,
  BenchmarkRunContext,
} from "@/features/benchmark-runner/types/benchmark";
import { useBenchmarkProgress } from "@/features/realtime-progress/hooks/use-benchmark-progress";
import type { BenchmarkProgressSnapshot } from "@/features/realtime-progress/types/progress";

interface UseBenchmarkRunnerOptions {
  sessionId?: string;
  context?: BenchmarkRunContext;
  enabled?: boolean;
  onEnqueueError?: (error: unknown) => void;
  onCompleted?: (result: BenchmarkJobStatusResult) => void;
  onFailed?: (result: BenchmarkJobStatusResult) => void;
}

export interface BenchmarkRunnerState {
  start: (input: { profile: BenchmarkProfile; target: BenchmarkTarget }) => void;
  reset: () => void;
  jobId: string | undefined;
  status: BenchmarkJobStatusResult | undefined;
  progress: BenchmarkProgressSnapshot | undefined;
  isEnqueueing: boolean;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  isProgressStreaming: boolean;
  enqueueError: unknown;
  statusError: unknown;
  progressError: unknown;
  canStart: boolean;
}

export function useBenchmarkRunner({
  sessionId,
  context,
  enabled = true,
  onEnqueueError,
  onCompleted,
  onFailed,
}: UseBenchmarkRunnerOptions): BenchmarkRunnerState {
  const enqueueMutation = useEnqueueBenchmark();
  const [jobId, setJobId] = useState<string | undefined>();
  const [enqueueProfile, setEnqueueProfile] = useState<
    { rps: number; durationSeconds: number } | undefined
  >();
  const [terminalNotified, setTerminalNotified] = useState(false);
  const [progressTerminal, setProgressTerminal] = useState(false);

  const progressQuery = useBenchmarkProgress(jobId, {
    sessionId,
    enabled: enabled && Boolean(jobId) && !progressTerminal,
  });

  useEffect(() => {
    if (progressQuery.isTerminal) {
      setProgressTerminal(true);
    }
  }, [progressQuery.isTerminal]);

  // Status is for post-terminal handoff / finals only — not in-run progress UX.
  const statusQuery = useBenchmarkStatus(jobId, {
    enabled: enabled && Boolean(jobId) && progressTerminal,
    pollWhileLive: false,
    fallbackProfile: enqueueProfile,
  });

  const status = statusQuery.data;
  const progress = progressQuery.snapshot;

  const hasProgressFailure = Boolean(progressQuery.error);

  const isActive =
    Boolean(jobId) && !progressTerminal && !hasProgressFailure;

  const isCompleted =
    status?.status === "completed" ||
    (progressTerminal && progress?.phase === "completed");

  const isFailed =
    hasProgressFailure ||
    status?.status === "failed" ||
    status?.status === "cancelled" ||
    (progressTerminal &&
      (progress?.phase === "failed" || progress?.phase === "cancelled"));

  const canStart =
    enabled && Boolean(sessionId) && !isActive && !enqueueMutation.isPending;

  useEffect(() => {
    if (!progressTerminal || terminalNotified) {
      return;
    }

    if (status) {
      if (status.status === "completed") {
        setTerminalNotified(true);
        onCompleted?.(status);
        return;
      }

      if (status.status === "failed" || status.status === "cancelled") {
        setTerminalNotified(true);
        onFailed?.(status);
      }
      return;
    }

    // Status handoff may lag; still notify from terminal progress phase.
    if (progress?.phase === "completed" && enqueueProfile) {
      setTerminalNotified(true);
      onCompleted?.({
        jobId: progress.jobId,
        status: "completed",
        profile: progress.profile ?? enqueueProfile,
        createdAt: progress.updatedAt,
        hint: progress.hint,
      });
      return;
    }

    if (
      (progress?.phase === "failed" || progress?.phase === "cancelled") &&
      enqueueProfile
    ) {
      setTerminalNotified(true);
      onFailed?.({
        jobId: progress.jobId,
        status: progress.phase,
        profile: progress.profile ?? enqueueProfile,
        createdAt: progress.updatedAt,
        hint: progress.hint,
        failureReason: progress.hint,
      });
    }
  }, [
    enqueueProfile,
    onCompleted,
    onFailed,
    progress,
    progressTerminal,
    status,
    terminalNotified,
  ]);

  const start = useCallback(
    (input: { profile: BenchmarkProfile; target: BenchmarkTarget }) => {
      if (!sessionId || !canStart) {
        return;
      }

      setTerminalNotified(false);
      setProgressTerminal(false);
      setEnqueueProfile({
        rps: input.profile.rps,
        durationSeconds: input.profile.durationSeconds,
      });

      enqueueMutation.mutate(
        {
          sessionId,
          profile: input.profile,
          target: input.target,
          context,
        },
        {
          onSuccess: (result) => {
            setJobId(result.jobId);
            setEnqueueProfile(result.profile);
          },
          onError: (error) => {
            onEnqueueError?.(error);
          },
        },
      );
    },
    [canStart, context, enqueueMutation, onEnqueueError, sessionId],
  );

  const reset = useCallback(() => {
    setJobId(undefined);
    setEnqueueProfile(undefined);
    setTerminalNotified(false);
    setProgressTerminal(false);
    enqueueMutation.reset();
  }, [enqueueMutation]);

  return {
    start,
    reset,
    jobId,
    status,
    progress,
    isEnqueueing: enqueueMutation.isPending,
    isActive,
    isCompleted,
    isFailed,
    isProgressStreaming: progressQuery.isStreaming,
    enqueueError: enqueueMutation.error,
    statusError: statusQuery.error,
    progressError: progressQuery.error,
    canStart,
  };
}
