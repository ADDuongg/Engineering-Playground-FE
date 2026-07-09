"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BenchmarkMetricsHistoryPanel } from "@/features/benchmark-metrics/components/benchmark-metrics-history-panel";
import { BenchmarkMetricsPanel } from "@/features/benchmark-metrics/components/benchmark-metrics-panel";
import { benchmarkMetricsKeys } from "@/features/benchmark-metrics/constants/query-keys";
import { useBenchmarkMetricHistory } from "@/features/benchmark-metrics/hooks/use-benchmark-metric-history";
import { useBenchmarkMetrics } from "@/features/benchmark-metrics/hooks/use-benchmark-metrics";
import type { BenchmarkMetricsStatus } from "@/features/benchmark-metrics/types/benchmark-metrics";
import { formatBenchmarkMetricsErrorMessage } from "@/features/benchmark-metrics/utils/format-benchmark-metrics-error";
import { BenchmarkErrorAlert } from "@/features/benchmark-runner/components/benchmark-error-alert";
import { BenchmarkProfileForm } from "@/features/benchmark-runner/components/benchmark-profile-form";
import { BenchmarkStatusBanner } from "@/features/benchmark-runner/components/benchmark-status-banner";
import { useBenchmarkRunner } from "@/features/benchmark-runner/hooks/use-benchmark-runner";
import { formatBenchmarkErrorMessage } from "@/features/benchmark-runner/utils/format-benchmark-error";
import { BenchmarkProgressPanel } from "@/features/realtime-progress/components/benchmark-progress-panel";
import { formatProgressErrorMessage } from "@/features/realtime-progress/utils/format-progress-error";
import type {
  BenchmarkDurationSeconds,
  BenchmarkRps,
} from "@/features/benchmark-runner/types/benchmark";
import { DatasetStatusBanner } from "@/features/dataset-loader/components/dataset-status-banner";
import { useDatasetPreparation } from "@/features/dataset-loader/hooks/use-dataset-preparation";
import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import { ExperimentSessionBanner } from "@/features/experiment-isolation/components/experiment-session-banner";
import { useExperimentIsolation } from "@/features/experiment-isolation/hooks/use-experiment-isolation";
import { formatIsolationErrorMessage } from "@/features/experiment-isolation/utils/format-isolation-error";
import { ROUTES } from "@/shared/constants/routes";
import { SqlEditor } from "@/shared/components/editor/sql-editor";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

const DATABASE_SQL_TRACK = "database-sql";
const BENCHMARK_LAB_SLUG = "load-testing";

const DEFAULT_DATASET = {
  family: "commerce",
  tier: "100k" as const,
};

const DEFAULT_SQL = `-- Query executed under load during the benchmark
SELECT id, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;`;

function resolveDisplayMetricsStatus(
  embedded?: BenchmarkMetricsStatus,
  dedicated?: BenchmarkMetricsStatus,
  jobStatus?: string,
): BenchmarkMetricsStatus | undefined {
  if (jobStatus === "failed" || jobStatus === "cancelled") {
    return undefined;
  }

  if (embedded === "ready" || embedded === "unavailable") {
    return embedded;
  }

  if (dedicated) {
    return dedicated;
  }

  if (embedded) {
    return embedded;
  }

  if (jobStatus === "completed") {
    return "pending";
  }

  return undefined;
}

export function BenchmarkPage() {
  const queryClient = useQueryClient();
  const [mobileTab, setMobileTab] = useState<"config" | "results">("results");
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [rps, setRps] = useState<BenchmarkRps>(500);
  const [durationSeconds, setDurationSeconds] =
    useState<BenchmarkDurationSeconds>(30);
  const [selectedTier, setSelectedTier] = useState<DatasetTier>(
    DEFAULT_DATASET.tier,
  );

  const datasetIdentity = useMemo(
    () => ({
      family: DEFAULT_DATASET.family,
      tier: selectedTier,
    }),
    [selectedTier],
  );

  const experimentIsolation = useExperimentIsolation({
    trackSlug: DATABASE_SQL_TRACK,
    labSlug: BENCHMARK_LAB_SLUG,
    dataset: datasetIdentity,
  });

  const datasetPreparation = useDatasetPreparation({
    identity: datasetIdentity,
    sessionId: experimentIsolation.sessionId,
    context: { labSlug: BENCHMARK_LAB_SLUG },
    enabled: experimentIsolation.isReady,
  });

  const historyQueryInput = experimentIsolation.sessionId
    ? {
        sessionId: experimentIsolation.sessionId,
        labSlug: BENCHMARK_LAB_SLUG,
      }
    : undefined;

  const metricHistoryQuery = useBenchmarkMetricHistory(historyQueryInput, {
    enabled: experimentIsolation.isReady,
  });

  const invalidateBenchmarkMetricHistory = () => {
    if (!historyQueryInput) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: benchmarkMetricsKeys.history(historyQueryInput),
    });
  };

  const benchmarkRunner = useBenchmarkRunner({
    sessionId: experimentIsolation.sessionId,
    context: {
      trackSlug: DATABASE_SQL_TRACK,
      labSlug: BENCHMARK_LAB_SLUG,
    },
    enabled: experimentIsolation.isReady && datasetPreparation.canExecuteSql,
    onEnqueueError: (error) => {
      toast.error("Benchmark failed to start", {
        description: formatBenchmarkErrorMessage(error),
      });
    },
    onCompleted: () => {
      invalidateBenchmarkMetricHistory();
      toast.success("Benchmark completed", {
        description: "Load test finished. Review metrics below.",
      });
    },
    onFailed: (result) => {
      toast.error("Benchmark failed", {
        description: result.failureReason ?? "The benchmark job did not complete.",
      });
    },
  });

  const embeddedMetricsStatus = benchmarkRunner.status?.metricsStatus;
  // Only poll dedicated metrics after a successful job completion while collection
  // is still pending. Never poll for failed/cancelled/running jobs.
  const shouldPollDedicatedMetrics =
    Boolean(benchmarkRunner.jobId) &&
    benchmarkRunner.isCompleted &&
    !benchmarkRunner.isFailed &&
    embeddedMetricsStatus !== "ready" &&
    embeddedMetricsStatus !== "unavailable";

  const dedicatedMetricsQuery = useBenchmarkMetrics(benchmarkRunner.jobId, {
    sessionId: experimentIsolation.sessionId,
    enabled: shouldPollDedicatedMetrics,
    embeddedMetricsStatus,
  });

  const displayMetricsStatus = resolveDisplayMetricsStatus(
    embeddedMetricsStatus,
    dedicatedMetricsQuery.data?.metricsStatus,
    benchmarkRunner.status?.status,
  );

  const displayMetrics =
    (embeddedMetricsStatus === "ready"
      ? benchmarkRunner.status?.metrics
      : undefined) ??
    (dedicatedMetricsQuery.data?.metricsStatus === "ready"
      ? dedicatedMetricsQuery.data.metrics
      : undefined);

  const displayRunId =
    benchmarkRunner.status?.runId ?? dedicatedMetricsQuery.data?.runId;

  const displayHint =
    benchmarkRunner.status?.hint ?? dedicatedMetricsQuery.data?.hint;

  const canStartBenchmark =
    experimentIsolation.isReady &&
    datasetPreparation.canExecuteSql &&
    benchmarkRunner.canStart &&
    sql.trim().length > 0;

  const handleStartBenchmark = () => {
    if (!canStartBenchmark) {
      if (!experimentIsolation.isReady) {
        toast.error("Session not ready", {
          description: experimentIsolation.isFailed
            ? formatIsolationErrorMessage(experimentIsolation.error)
            : "Wait for the isolated session to finish provisioning.",
        });
        return;
      }

      toast.error("Dataset not ready", {
        description: "Wait for dataset preparation before starting a benchmark.",
      });
      return;
    }

    benchmarkRunner.start({
      profile: { rps, durationSeconds },
      target: {
        sql,
        parameters: [],
        dataset: datasetIdentity,
      },
    });
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
    : datasetPreparation.isReady
      ? "ready"
      : datasetPreparation.isPreparing
        ? "preparing"
        : datasetPreparation.isLoading
          ? "loading"
          : "not_started";

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
        onRetry={datasetPreparation.isFailed ? datasetPreparation.retry : undefined}
      />
    ) : null;

  const configPanel = (
    <aside className="overflow-auto border-e border-border bg-surface p-4 sm:p-5 lg:h-full">
      <Button variant="ghost" size="sm" className="mb-5" asChild>
        <Link href={ROUTES.labs}>← Labs</Link>
      </Button>
      <h2 className="mb-2 text-lg font-semibold">Benchmark config</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Enqueue a load test against your SQL query in the isolated sandbox.
      </p>

      {statusSlot}

      <div className="mb-6 mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Dataset tier</label>
          <div className="grid grid-cols-3 gap-2">
            {(["100k", "1m", "10m"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                disabled={benchmarkRunner.isActive}
                onClick={() => setSelectedTier(tier)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition-colors",
                  selectedTier === tier
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                  benchmarkRunner.isActive && "cursor-not-allowed opacity-50",
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <BenchmarkProfileForm
          rps={rps}
          durationSeconds={durationSeconds}
          onRpsChange={setRps}
          onDurationChange={setDurationSeconds}
          disabled={benchmarkRunner.isActive}
        />
      </div>

      <div className="mb-6">
        <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Target SQL
        </h4>
        <SqlEditor
          value={sql}
          onChange={setSql}
          className="h-[220px] min-h-[220px] flex-none"
          readOnly={benchmarkRunner.isActive}
        />
      </div>

      {benchmarkRunner.enqueueError ? (
        <BenchmarkErrorAlert
          error={benchmarkRunner.enqueueError}
          className="mb-4"
        />
      ) : null}

      <Button
        className="w-full"
        disabled={!canStartBenchmark}
        onClick={handleStartBenchmark}
      >
        {benchmarkRunner.isEnqueueing
          ? "Starting…"
          : benchmarkRunner.isActive
            ? "Benchmark running…"
            : "Start benchmark"}
      </Button>

      {benchmarkRunner.isCompleted || benchmarkRunner.isFailed ? (
        <Button
          variant="secondary"
          size="sm"
          className="mt-2 w-full"
          onClick={benchmarkRunner.reset}
        >
          Run another benchmark
        </Button>
      ) : null}
    </aside>
  );

  const resultsPanel = (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2 sm:px-5">
        {benchmarkRunner.status ? (
          <BenchmarkStatusBanner
            status={benchmarkRunner.status}
            className="border-0 bg-transparent p-0"
          />
        ) : benchmarkRunner.isActive ? (
          <div className="text-sm text-muted-foreground">
            Live progress via stream
            {benchmarkRunner.progress
              ? ` · ${benchmarkRunner.progress.phase}`
              : " · connecting…"}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Configure and start a benchmark to see live results.
          </div>
        )}
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-5">
        {benchmarkRunner.progressError ? (
          <p className="mb-4 text-sm text-danger">
            {formatProgressErrorMessage(benchmarkRunner.progressError)}
          </p>
        ) : null}

        {benchmarkRunner.statusError ? (
          <BenchmarkErrorAlert
            error={benchmarkRunner.statusError}
            className="mb-4"
          />
        ) : null}

        {dedicatedMetricsQuery.error ? (
          <p className="mb-4 text-sm text-danger">
            {formatBenchmarkMetricsErrorMessage(dedicatedMetricsQuery.error)}
          </p>
        ) : null}

        {benchmarkRunner.jobId ? (
          <>
            <h3 className="mb-4 text-lg font-semibold">
              {benchmarkRunner.isActive ? "Load in progress" : "Benchmark results"}
            </h3>

            {benchmarkRunner.isActive ? (
              <BenchmarkProgressPanel
                snapshot={benchmarkRunner.progress}
                isStreaming={benchmarkRunner.isProgressStreaming}
                className="mt-2"
              />
            ) : (
              <BenchmarkMetricsPanel
                metricsStatus={displayMetricsStatus}
                metrics={displayMetrics}
                hint={displayHint}
                isLoading={
                  dedicatedMetricsQuery.isLoading &&
                  displayMetricsStatus === "pending"
                }
                className="mt-2"
              />
            )}

            <BenchmarkMetricsHistoryPanel
              snapshots={metricHistoryQuery.data?.snapshots ?? []}
              currentRunId={displayRunId}
              className="mt-8"
            />
          </>
        ) : (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <p>Start a benchmark to monitor RPS, latency, and throughput.</p>
            <BenchmarkMetricsHistoryPanel
              snapshots={metricHistoryQuery.data?.snapshots ?? []}
              className="mt-4 w-full max-w-3xl"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,320px)_1fr]">
      <div className="flex shrink-0 border-b border-border bg-surface lg:hidden">
        {(["config", "results"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            className={cn(
              "flex-1 border-b-2 px-3 py-2 text-sm capitalize transition-colors",
              mobileTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="hidden lg:contents">{configPanel}</div>
      <div className="hidden lg:contents">{resultsPanel}</div>

      <div className="min-h-0 flex-1 overflow-auto lg:hidden">
        {mobileTab === "config" ? configPanel : resultsPanel}
      </div>
    </div>
  );
}
