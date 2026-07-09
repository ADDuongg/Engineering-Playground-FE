"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { datasetKeys } from "@/features/dataset-loader/constants/query-keys";
import { useDatasetMetadata } from "@/features/dataset-loader/hooks/use-dataset-metadata";
import { useDatasetStatus } from "@/features/dataset-loader/hooks/use-dataset-status";
import { usePrepareDataset } from "@/features/dataset-loader/hooks/use-prepare-dataset";
import type {
  DatasetIdentity,
  DatasetMetadata,
  DatasetPreparationStatus,
} from "@/features/dataset-loader/types/dataset";

interface DatasetPreparationContext {
  labSlug?: string;
}

interface UseDatasetPreparationOptions {
  identity: DatasetIdentity;
  sessionId?: string;
  context?: DatasetPreparationContext;
  enabled?: boolean;
}

export interface DatasetPreparationState {
  metadata: DatasetMetadata | undefined;
  status: DatasetPreparationStatus | undefined;
  isLoading: boolean;
  isReady: boolean;
  isPreparing: boolean;
  isResetting: boolean;
  isFailed: boolean;
  canExecuteSql: boolean;
  prepareError: unknown;
  retry: () => void;
}

export function useDatasetPreparation({
  identity,
  sessionId,
  context,
  enabled = true,
}: UseDatasetPreparationOptions): DatasetPreparationState {
  const queryClient = useQueryClient();
  const prepareRequestedForScopeRef = useRef<string | undefined>(undefined);
  const previousScopeKeyRef = useRef<string | undefined>(undefined);

  const isActive = enabled && !!sessionId;
  const prepareScopeKey = sessionId
    ? `${sessionId}:${identity.family}:${identity.tier}`
    : undefined;

  const metadataQuery = useDatasetMetadata(identity, {
    enabled: isActive,
    sessionId,
  });
  const statusQuery = useDatasetStatus(identity, { enabled: isActive, sessionId });
  const prepareMutation = usePrepareDataset(sessionId);

  useEffect(() => {
    if (!prepareScopeKey) {
      return;
    }

    if (
      previousScopeKeyRef.current &&
      previousScopeKeyRef.current !== prepareScopeKey
    ) {
      prepareRequestedForScopeRef.current = undefined;
      prepareMutation.reset();
    }

    previousScopeKeyRef.current = prepareScopeKey;
  }, [prepareMutation, prepareScopeKey]);

  const metadata = metadataQuery.data;
  const status = statusQuery.data;
  const currentStatus = status?.status ?? metadata?.status ?? "not_started";

  const isReady = currentStatus === "ready";
  const isResetting = currentStatus === "resetting";
  const isPreparing =
    currentStatus === "preparing" ||
    isResetting ||
    prepareMutation.isPending;
  const isFailed = currentStatus === "failed" || prepareMutation.isError;
  const isLoading =
    isActive &&
    !isReady &&
    (metadataQuery.isLoading ||
      statusQuery.isLoading ||
      isPreparing ||
      prepareMutation.isPending);

  useEffect(() => {
    if (!isActive || !sessionId || !prepareScopeKey) {
      return;
    }

    if (prepareRequestedForScopeRef.current === prepareScopeKey) {
      return;
    }

    if (prepareMutation.isPending) {
      return;
    }

    if (currentStatus === "preparing" || currentStatus === "resetting") {
      prepareRequestedForScopeRef.current = prepareScopeKey;
      return;
    }

    prepareRequestedForScopeRef.current = prepareScopeKey;

    prepareMutation.mutate(
      {
        ...identity,
        sessionId,
        context: context?.labSlug ? { labSlug: context.labSlug } : undefined,
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: datasetKeys.status({ identity, sessionId }),
          });
          void queryClient.invalidateQueries({
            queryKey: datasetKeys.metadata({ identity, sessionId }),
          });
        },
        onError: () => {
          if (prepareRequestedForScopeRef.current === prepareScopeKey) {
            prepareRequestedForScopeRef.current = undefined;
          }
        },
      },
    );
  }, [
    context?.labSlug,
    currentStatus,
    identity,
    isActive,
    prepareMutation,
    prepareScopeKey,
    queryClient,
    sessionId,
  ]);

  const retry = () => {
    prepareRequestedForScopeRef.current = undefined;
    prepareMutation.reset();

    void queryClient.invalidateQueries({
      queryKey: datasetKeys.status({ identity, sessionId }),
    });
    void queryClient.invalidateQueries({
      queryKey: datasetKeys.metadata({ identity, sessionId }),
    });
  };

  return {
    metadata,
    status,
    isLoading,
    isReady,
    isPreparing,
    isResetting,
    isFailed,
    canExecuteSql: isReady,
    prepareError: prepareMutation.error,
    retry,
  };
}
