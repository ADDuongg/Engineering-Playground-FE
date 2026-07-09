"use client";

import { useEffect, useRef, useState } from "react";
import { observeBenchmarkProgress } from "@/features/realtime-progress/services/progress-service";
import type { BenchmarkProgressSnapshot } from "@/features/realtime-progress/types/progress";
import { ApiRequestError } from "@/shared/types/api";

interface UseBenchmarkProgressOptions {
  sessionId?: string;
  enabled?: boolean;
  onTerminal?: (snapshot: BenchmarkProgressSnapshot) => void;
  onError?: (error: unknown) => void;
}

export interface BenchmarkProgressState {
  snapshot: BenchmarkProgressSnapshot | undefined;
  error: unknown;
  isStreaming: boolean;
  isTerminal: boolean;
}

export function useBenchmarkProgress(
  jobId: string | undefined,
  options?: UseBenchmarkProgressOptions,
): BenchmarkProgressState {
  const enabled = options?.enabled ?? true;
  const sessionId = options?.sessionId;
  const onTerminalRef = useRef(options?.onTerminal);
  const onErrorRef = useRef(options?.onError);
  onTerminalRef.current = options?.onTerminal;
  onErrorRef.current = options?.onError;

  const [snapshot, setSnapshot] = useState<
    BenchmarkProgressSnapshot | undefined
  >();
  const [error, setError] = useState<unknown>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTerminal, setIsTerminal] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setSnapshot(undefined);
      setError(undefined);
      setIsStreaming(false);
      setIsTerminal(false);
      return;
    }

    // Keep last snapshot after terminal handoff; do not reconnect.
    if (!enabled) {
      setIsStreaming(false);
      return;
    }

    let active = true;
    setSnapshot(undefined);
    setError(undefined);
    setIsStreaming(true);
    setIsTerminal(false);

    const abort = observeBenchmarkProgress(
      jobId,
      sessionId ? { sessionId } : undefined,
      {
        onEvent: (event) => {
          if (!active) {
            return;
          }

          if (event.type === "progress") {
            setSnapshot(event.data);
            return;
          }

          if (event.type === "terminal") {
            setSnapshot(event.data);
            setIsTerminal(true);
            setIsStreaming(false);
            onTerminalRef.current?.(event.data);
            return;
          }

          const streamError = new ApiRequestError(
            0,
            event.data.code,
            event.data.message,
          );
          setError(streamError);
          setIsStreaming(false);
          onErrorRef.current?.(streamError);
        },
        onError: (streamError) => {
          if (!active) {
            return;
          }
          setError(streamError);
          setIsStreaming(false);
          onErrorRef.current?.(streamError);
        },
        onClose: (reason) => {
          if (!active) {
            return;
          }
          if (reason === "terminal") {
            setIsTerminal(true);
          }
          setIsStreaming(false);
        },
      },
    );

    return () => {
      active = false;
      abort();
    };
  }, [enabled, jobId, sessionId]);

  return {
    snapshot,
    error,
    isStreaming,
    isTerminal,
  };
}
