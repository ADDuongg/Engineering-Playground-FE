"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { experimentSessionKeys } from "@/features/experiment-isolation/constants/query-keys";
import { useExperimentSession } from "@/features/experiment-isolation/hooks/use-experiment-session";
import { useProvisionExperimentSession } from "@/features/experiment-isolation/hooks/use-provision-experiment-session";
import { teardownExperimentSession } from "@/features/experiment-isolation/services/isolation-service";
import type {
  ExperimentSession,
  ProvisionExperimentSessionInput,
} from "@/features/experiment-isolation/types/experiment-session";
import { getOrCreateClientSessionToken } from "@/features/experiment-isolation/utils/client-session-token";

interface UseExperimentIsolationOptions {
  trackSlug: string;
  labSlug: string;
  dataset: ProvisionExperimentSessionInput["dataset"];
  enabled?: boolean;
}

export interface ExperimentIsolationState {
  session: ExperimentSession | undefined;
  sessionId: string | undefined;
  isLoading: boolean;
  isReady: boolean;
  isProvisioning: boolean;
  isFailed: boolean;
  error: unknown;
  retry: () => void;
}

export function useExperimentIsolation({
  trackSlug,
  labSlug,
  dataset,
  enabled = true,
}: UseExperimentIsolationOptions): ExperimentIsolationState {
  const queryClient = useQueryClient();
  const sessionIdRef = useRef<string | undefined>(undefined);
  const provisionRequestedRef = useRef(false);
  const [session, setSession] = useState<ExperimentSession | undefined>();
  const [provisionError, setProvisionError] = useState<unknown>(null);

  const provisionMutation = useProvisionExperimentSession();
  const {
    mutate: provisionSession,
    isPending: isProvisionPending,
    isSuccess: isProvisionSuccess,
    isError: isProvisionError,
    data: provisionData,
    error: provisionMutationError,
    reset: resetProvisionMutation,
  } = provisionMutation;

  const provisionSessionRef = useRef(provisionSession);
  provisionSessionRef.current = provisionSession;

  const datasetRef = useRef(dataset);
  datasetRef.current = dataset;

  const sessionId = session?.sessionId;
  sessionIdRef.current = sessionId;

  const applySession = useCallback(
    (data: ExperimentSession) => {
      setProvisionError(null);
      setSession(data);
      queryClient.setQueryData(
        experimentSessionKeys.detail(data.sessionId),
        data,
      );
    },
    [queryClient],
  );

  const shouldPollSession = enabled && session?.status === "provisioning";

  const sessionQuery = useExperimentSession(sessionId, {
    enabled: shouldPollSession,
  });

  useEffect(() => {
    if (sessionQuery.data) {
      applySession(sessionQuery.data);
    }
  }, [applySession, sessionQuery.data]);

  useEffect(() => {
    if (isProvisionSuccess && provisionData) {
      applySession(provisionData);
    }
  }, [applySession, isProvisionSuccess, provisionData]);

  useEffect(() => {
    if (isProvisionError) {
      setProvisionError(provisionMutationError);
      provisionRequestedRef.current = false;
    }
  }, [isProvisionError, provisionMutationError]);

  const currentStatus = session?.status;
  const isReady = currentStatus === "ready";
  const isFailed =
    currentStatus === "failed" ||
    currentStatus === "expired" ||
    provisionError != null;
  const isProvisioning =
    enabled &&
    !isFailed &&
    !isReady &&
    (isProvisionPending || currentStatus === "provisioning" || !session);
  const isLoading = enabled && isProvisioning;

  useEffect(() => {
    if (
      !enabled ||
      session ||
      provisionError != null ||
      isProvisionPending ||
      provisionRequestedRef.current
    ) {
      return;
    }

    provisionRequestedRef.current = true;

    provisionSessionRef.current({
      clientSessionToken: getOrCreateClientSessionToken({ trackSlug, labSlug }),
      trackSlug,
      labSlug,
      dataset: datasetRef.current,
    });
  }, [
    enabled,
    isProvisionPending,
    labSlug,
    provisionError,
    session,
    trackSlug,
  ]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return () => {
      const id = sessionIdRef.current;
      if (id) {
        void teardownExperimentSession(id).catch(() => {
          // Best-effort cleanup when leaving the lab workspace.
        });
      }

      provisionRequestedRef.current = false;
      resetProvisionMutation();
    };
  }, [enabled, resetProvisionMutation]);

  const retry = () => {
    provisionRequestedRef.current = false;
    setProvisionError(null);
    setSession(undefined);
    resetProvisionMutation();

    if (sessionId) {
      queryClient.removeQueries({
        queryKey: experimentSessionKeys.detail(sessionId),
      });
    }
  };

  return {
    session,
    sessionId,
    isLoading,
    isReady,
    isProvisioning,
    isFailed,
    error: provisionError ?? sessionQuery.error,
    retry,
  };
}
