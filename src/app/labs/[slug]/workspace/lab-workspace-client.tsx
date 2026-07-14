"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DatasetStatusBanner } from "@/features/dataset-loader/components/dataset-status-banner";
import { DatasetTablesPanel } from "@/features/dataset-loader/components/dataset-tables-panel";
import { useDatasetPreparation } from "@/features/dataset-loader/hooks/use-dataset-preparation";
import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import { DatasetResetButton } from "@/features/dataset-reset/components/dataset-reset-button";
import { useDatasetReset } from "@/features/dataset-reset/hooks/use-dataset-reset";
import { formatResetErrorMessage } from "@/features/dataset-reset/utils/format-reset-error";
import { ExperimentSessionBanner } from "@/features/experiment-isolation/components/experiment-session-banner";
import { useExperimentIsolation } from "@/features/experiment-isolation/hooks/use-experiment-isolation";
import { formatIsolationErrorMessage } from "@/features/experiment-isolation/utils/format-isolation-error";
import { ExplainErrorAlert } from "@/features/explain-runner/components/explain-error-alert";
import { ExplainPlanTree } from "@/features/explain-runner/components/explain-plan-tree";
import { useRunExplainSql } from "@/features/explain-runner/hooks/use-run-explain-sql";
import { formatExplainErrorMessage } from "@/features/explain-runner/utils/format-explain-error";
import { stripExplainPrefix } from "@/features/explain-runner/utils/strip-explain-prefix";
import { GuidedStepsPanel } from "@/features/index-playground/components/guided-steps-panel";
import { ScanComparisonPanel } from "@/features/index-playground/components/scan-comparison-panel";
import { useLabSummary } from "@/features/index-playground/hooks/use-lab-summary";
import { useScanComparison } from "@/features/index-playground/hooks/use-scan-comparison";
import { resolveGuidedParameters } from "@/features/index-playground/utils/resolve-guided-parameters";
import { LabWorkspace } from "@/features/lab-engine/components/lab-workspace";
import { MetricsHistoryPanel } from "@/features/metrics-pipeline/components/metrics-history-panel";
import { metricsKeys } from "@/features/metrics-pipeline/constants/query-keys";
import { useMetricHistory } from "@/features/metrics-pipeline/hooks/use-metric-history";
import { mapMetricsToLabMetrics } from "@/features/metrics-pipeline/utils/map-metrics-to-lab-metrics";
import { resolveDisplayMetrics } from "@/features/metrics-pipeline/utils/resolve-display-metrics";
import { SqlRunErrorAlert } from "@/features/sql-execution-queue/components/sql-run-error-alert";
import { SqlRunResults } from "@/features/sql-execution-queue/components/sql-run-results";
import { SqlRunStatusBanner } from "@/features/sql-execution-queue/components/sql-run-status-banner";
import { useSqlRun } from "@/features/sql-execution-queue/hooks/use-sql-run";
import {
  formatSqlRunErrorMessage,
  formatSqlRunStatusMessage,
} from "@/features/sql-execution-queue/utils/format-sql-run-error";
import type { LabDefinition } from "@/shared/types/lab";
import { toast } from "sonner";

const DATABASE_SQL_TRACK = "database-sql";
const INDEX_PLAYGROUND_SLUG = "index-playground";

const DATASET_TIERS: DatasetTier[] = ["100k", "1m", "10m"];

const DEFAULT_DATASET = {
  family: "commerce",
  tier: "100k" as const,
};

function resolveInitialTier(
  lab: LabDefinition,
  recommendedTier?: string[],
): DatasetTier {
  const fromSummary = recommendedTier?.find((tier): tier is DatasetTier =>
    DATASET_TIERS.includes(tier as DatasetTier),
  );
  if (fromSummary) {
    return fromSummary;
  }

  return lab.dataset?.tier ?? DEFAULT_DATASET.tier;
}

interface LabWorkspaceClientProps {
  lab: LabDefinition;
}

export function LabWorkspaceClient({ lab }: LabWorkspaceClientProps) {
  const queryClient = useQueryClient();
  const isIndexPlayground = lab.slug === INDEX_PLAYGROUND_SLUG;

  const summaryQuery = useLabSummary(lab.slug);
  const scanComparison = useScanComparison();

  const baseDataset = lab.dataset ?? DEFAULT_DATASET;
  const [selectedTier, setSelectedTier] = useState<DatasetTier>(
    baseDataset.tier,
  );
  const tierInitializedFromSummary = useRef(false);

  const [editorSql, setEditorSql] = useState(lab.defaultQuery);
  const appliedRecommendedQuery = useRef(false);

  useEffect(() => {
    if (!summaryQuery.data) {
      return;
    }

    if (!tierInitializedFromSummary.current) {
      const nextTier = resolveInitialTier(
        lab,
        summaryQuery.data.dataset?.recommendedTier,
      );
      setSelectedTier(nextTier);
      tierInitializedFromSummary.current = true;
    }

    if (
      !appliedRecommendedQuery.current &&
      editorSql === lab.defaultQuery &&
      summaryQuery.data.recommendedQuery?.sql
    ) {
      setEditorSql(summaryQuery.data.recommendedQuery.sql);
      appliedRecommendedQuery.current = true;
    }
  }, [editorSql, lab, summaryQuery.data]);

  const datasetIdentity = useMemo(
    () => ({
      family: summaryQuery.data?.dataset?.family ?? baseDataset.family,
      tier: selectedTier,
      ...(summaryQuery.data?.dataset?.version
        ? { version: summaryQuery.data.dataset.version }
        : "version" in baseDataset && baseDataset.version
          ? { version: baseDataset.version }
          : {}),
    }),
    [baseDataset, selectedTier, summaryQuery.data],
  );

  const trackSlug = summaryQuery.data?.trackSlug ?? DATABASE_SQL_TRACK;

  const experimentIsolation = useExperimentIsolation({
    trackSlug,
    labSlug: lab.slug,
    dataset: datasetIdentity,
  });

  const datasetPreparation = useDatasetPreparation({
    identity: datasetIdentity,
    sessionId: experimentIsolation.sessionId,
    context: { labSlug: lab.slug },
    enabled: experimentIsolation.isReady,
  });

  const datasetReset = useDatasetReset({
    identity: datasetIdentity,
    sessionId: experimentIsolation.sessionId,
    context: { labSlug: lab.slug },
    enabled: experimentIsolation.isReady,
    isDatasetReady: datasetPreparation.isReady,
    isResetting: datasetPreparation.isResetting,
    onResetError: (error) => {
      toast.error("Reset failed", {
        description: formatResetErrorMessage(error),
      });
    },
    onResetSuccess: () => {
      toast.success("Dataset reset", {
        description: "The dataset has been restored to its original state.",
      });
    },
  });

  const runExplainSql = useRunExplainSql();
  const isResetInProgress = datasetReset.isResetInProgress;

  const metricHistoryQuery = useMetricHistory(
    experimentIsolation.sessionId
      ? {
          sessionId: experimentIsolation.sessionId,
          labSlug: lab.slug,
        }
      : undefined,
    { enabled: experimentIsolation.isReady },
  );

  const invalidateMetricHistory = useCallback(() => {
    if (!experimentIsolation.sessionId) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: metricsKeys.history({
        sessionId: experimentIsolation.sessionId,
        labSlug: lab.slug,
      }),
    });
  }, [experimentIsolation.sessionId, lab.slug, queryClient]);

  const isTierChanging =
    datasetPreparation.isPreparing ||
    datasetPreparation.isLoading ||
    datasetPreparation.metadata?.tier !== selectedTier;

  const canPrepareSqlRun =
    experimentIsolation.isReady &&
    datasetPreparation.canExecuteSql &&
    !isResetInProgress &&
    !isTierChanging;

  const sqlRun = useSqlRun({
    sessionId: experimentIsolation.sessionId,
    context: {
      trackSlug,
      labSlug: lab.slug,
    },
    enabled: canPrepareSqlRun,
    onEnqueueError: (error) => {
      toast.error("Query failed to start", {
        description: formatSqlRunErrorMessage(error),
      });
    },
    onCompleted: () => {
      invalidateMetricHistory();
    },
    onFailed: (result) => {
      toast.error("Query failed", {
        description:
          formatSqlRunStatusMessage(result) ??
          "The SQL run did not complete.",
      });
    },
  });

  const displayMetrics = useMemo(
    () =>
      resolveDisplayMetrics(
        sqlRun.status?.executionResult?.metrics,
        runExplainSql.data?.metrics,
      ),
    [runExplainSql.data?.metrics, sqlRun.status?.executionResult?.metrics],
  );

  const metricsOverride = useMemo(() => {
    if (isResetInProgress || displayMetrics.length === 0) {
      return undefined;
    }

    return mapMetricsToLabMetrics(displayMetrics);
  }, [displayMetrics, isResetInProgress]);

  const currentRunId =
    sqlRun.status?.executionResult?.runId ?? runExplainSql.data?.runId;

  const canRunSql = canPrepareSqlRun && sqlRun.canRun;
  const isSqlRunBusy = sqlRun.isEnqueueing || sqlRun.isActive;
  const sqlRunError = sqlRun.enqueueError ?? sqlRun.statusError;

  const handleCaptureBefore = () => {
    const ok = scanComparison.capture("before", {
      metrics: runExplainSql.data?.metrics,
      runId: runExplainSql.data?.runId,
    });
    if (!ok) {
      toast.error("No Explain scan metrics", {
        description:
          "Run Explain on the recommended query first. Scan comparison uses rows_scanned / seq_scan_used / index_scan_used.",
      });
      return;
    }
    toast.success("Captured before snapshot");
  };

  const handleCaptureAfter = () => {
    const ok = scanComparison.capture("after", {
      metrics: runExplainSql.data?.metrics,
      runId: runExplainSql.data?.runId,
    });
    if (!ok) {
      toast.error("No Explain scan metrics", {
        description:
          "Run Explain after creating the index. Scan comparison does not use plain SQL run metrics alone.",
      });
      return;
    }
    toast.success("Captured after snapshot");
  };

  const handleRun = (sql: string) => {
    if (!canRunSql) {
      if (!experimentIsolation.isReady) {
        toast.error("Session not ready", {
          description: experimentIsolation.isFailed
            ? formatIsolationErrorMessage(experimentIsolation.error)
            : "Wait for the isolated session to finish provisioning.",
        });
        return;
      }

      if (isSqlRunBusy) {
        toast.error("SQL run in progress", {
          description:
            "Wait for the current SQL run to finish before starting another.",
        });
        return;
      }

      toast.error("Dataset not ready", {
        description: isResetInProgress
          ? "Wait for the dataset reset to finish before running SQL."
          : "Wait for dataset preparation to finish before running SQL.",
      });
      return;
    }

    const explainSql = stripExplainPrefix(sql);
    const runContext = {
      trackSlug,
      labSlug: lab.slug,
    };

    const parameters = isIndexPlayground
      ? resolveGuidedParameters(sql, summaryQuery.data)
      : [];

    const hasPlaceholders = /\$\d+/.test(sql);
    if (isIndexPlayground && hasPlaceholders && parameters.length === 0) {
      toast.error("Parameters required", {
        description:
          "Apply the recommended query from the Guided tab so $1 is bound via exampleParameters. Do not inline the email into SQL.",
      });
      return;
    }

    sqlRun.run({
      sql,
      parameters,
      dataset: datasetIdentity,
    });

    // DDL (create/drop index) does not need explain; skip when no placeholders and SQL is DDL-like
    const isDdl =
      /^\s*(create|drop)\s+index\b/i.test(explainSql) ||
      (isIndexPlayground &&
        parameters.length === 0 &&
        !hasPlaceholders &&
        /index/i.test(explainSql));

    if (!isDdl) {
      runExplainSql.mutate(
        {
          sql: explainSql,
          parameters,
          explainMode: isIndexPlayground ? "explain_analyze" : "explain",
          dataset: datasetIdentity,
          sessionId: experimentIsolation.sessionId,
          context: runContext,
        },
        {
          onSuccess: () => {
            invalidateMetricHistory();
          },
          onError: (error) => {
            toast.error("Plan failed", {
              description: formatExplainErrorMessage(error),
            });
          },
        },
      );
    }
  };

  const sessionBannerStatus = experimentIsolation.isFailed
    ? experimentIsolation.session?.status === "expired"
      ? "expired"
      : "failed"
    : experimentIsolation.isProvisioning
      ? experimentIsolation.isLoading && !experimentIsolation.session
        ? "loading"
        : "provisioning"
      : "ready";

  const datasetBannerStatus = datasetPreparation.isFailed
    ? "failed"
    : isResetInProgress
      ? "resetting"
      : datasetPreparation.isReady
        ? "ready"
        : datasetPreparation.isPreparing
          ? "preparing"
          : datasetPreparation.isLoading
            ? "loading"
            : "not_started";

  const handleReset = () => {
    sqlRun.reset();
    runExplainSql.reset();
    scanComparison.reset();
    datasetReset.reset();
  };

  const handleTierChange = (tier: DatasetTier) => {
    if (tier === selectedTier) {
      return;
    }

    setSelectedTier(tier);
    sqlRun.reset();
    runExplainSql.reset();
    scanComparison.reset();
  };

  const statusSlot =
    !experimentIsolation.isReady ? (
      <ExperimentSessionBanner
        status={sessionBannerStatus}
        error={experimentIsolation.error}
        onRetry={
          experimentIsolation.isFailed ? experimentIsolation.retry : undefined
        }
      />
    ) : datasetBannerStatus !== "ready" ? (
      <DatasetStatusBanner
        status={datasetBannerStatus}
        error={
          datasetPreparation.status?.error ?? datasetPreparation.prepareError
        }
        onRetry={
          datasetPreparation.isFailed ? datasetPreparation.retry : undefined
        }
      />
    ) : null;

  const enrichedLab = useMemo(() => {
    if (!summaryQuery.data) {
      return lab;
    }

    return {
      ...lab,
      title: summaryQuery.data.title || lab.title,
      objective: summaryQuery.data.learningGoal || lab.objective,
      theory: summaryQuery.data.theory || lab.theory,
      defaultQuery: summaryQuery.data.recommendedQuery?.sql || lab.defaultQuery,
    };
  }, [lab, summaryQuery.data]);

  return (
    <LabWorkspace
      lab={enrichedLab}
      query={editorSql}
      onQueryChange={setEditorSql}
      guidedSlot={
        <GuidedStepsPanel
          summary={summaryQuery.data}
          isLoading={summaryQuery.isLoading}
          error={summaryQuery.error}
          onApplySql={setEditorSql}
          onCaptureBefore={isIndexPlayground ? handleCaptureBefore : undefined}
          onCaptureAfter={isIndexPlayground ? handleCaptureAfter : undefined}
        />
      }
      comparisonSlot={
        isIndexPlayground ? (
          <ScanComparisonPanel
            before={scanComparison.before}
            after={scanComparison.after}
          />
        ) : undefined
      }
      sqlExecution={{
        isRunning: isSqlRunBusy || runExplainSql.isPending,
        onRun: handleRun,
        disabled: !canRunSql,
      }}
      metricsOverride={metricsOverride}
      metricsHistorySlot={
        metricHistoryQuery.data?.snapshots.length ? (
          <MetricsHistoryPanel
            snapshots={metricHistoryQuery.data.snapshots}
            currentRunId={currentRunId}
          />
        ) : null
      }
      datasetSlot={
        experimentIsolation.isReady ? (
          <DatasetTablesPanel
            metadata={datasetPreparation.metadata}
            selectedTier={selectedTier}
            onTierChange={handleTierChange}
            tierChangeDisabled={
              isResetInProgress || datasetPreparation.isPreparing
            }
            isLoading={isTierChanging}
          />
        ) : null
      }
      actionsSlot={
        experimentIsolation.isReady &&
        (datasetPreparation.isReady || isResetInProgress) ? (
          <DatasetResetButton
            onReset={handleReset}
            isResetting={isResetInProgress}
            disabled={isResetInProgress}
          />
        ) : null
      }
      datasetStatusSlot={statusSlot}
      errorSlot={
        !isResetInProgress && sqlRunError ? (
          <SqlRunErrorAlert error={sqlRunError} />
        ) : !isResetInProgress && sqlRun.isFailed && sqlRun.status ? (
          <SqlRunStatusBanner status={sqlRun.status} />
        ) : null
      }
      resultSlot={
        isResetInProgress ? null : sqlRun.isEnqueueing ||
          (sqlRun.isActive && !sqlRun.status) ? (
          <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
            Queuing SQL run…
          </div>
        ) : sqlRun.isActive && sqlRun.status ? (
          <SqlRunStatusBanner status={sqlRun.status} className="m-4" />
        ) : sqlRun.status?.executionResult ? (
          <div className="flex h-full min-h-0 flex-col gap-2">
            <SqlRunStatusBanner status={sqlRun.status} />
            <SqlRunResults status={sqlRun.status} className="min-h-0 flex-1" />
          </div>
        ) : null
      }
      explainPlanSlot={
        isResetInProgress ? null : runExplainSql.isPending ? (
          <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
            Generating execution plan…
          </div>
        ) : runExplainSql.error ? (
          <ExplainErrorAlert error={runExplainSql.error} className="m-4" />
        ) : runExplainSql.data ? (
          <ExplainPlanTree
            result={runExplainSql.data}
            className="min-h-0 flex-1"
          />
        ) : null
      }
    />
  );
}
