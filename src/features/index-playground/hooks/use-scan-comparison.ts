"use client";

import { useCallback, useState } from "react";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";
import {
  extractScanMetrics,
  hasPrimaryScanMetrics,
  type ScanMetricsMap,
} from "@/features/index-playground/utils/extract-scan-metrics";

export type ScanComparisonLabel = "before" | "after";

export interface ScanComparisonSnapshot {
  label: ScanComparisonLabel;
  runId?: string;
  metrics: ScanMetricsMap;
  capturedAt: string;
}

interface CaptureInput {
  metrics: MetricContract[] | undefined;
  runId?: string;
}

export function useScanComparison() {
  const [before, setBefore] = useState<ScanComparisonSnapshot | null>(null);
  const [after, setAfter] = useState<ScanComparisonSnapshot | null>(null);

  const capture = useCallback(
    (label: ScanComparisonLabel, input: CaptureInput): boolean => {
      const metrics = extractScanMetrics(input.metrics);
      if (!hasPrimaryScanMetrics(metrics)) {
        return false;
      }

      const snapshot: ScanComparisonSnapshot = {
        label,
        runId: input.runId,
        metrics,
        capturedAt: new Date().toISOString(),
      };

      if (label === "before") {
        setBefore(snapshot);
      } else {
        setAfter(snapshot);
      }

      return true;
    },
    [],
  );

  const reset = useCallback(() => {
    setBefore(null);
    setAfter(null);
  }, []);

  return {
    before,
    after,
    capture,
    reset,
    hasComparison: Boolean(before && after),
  };
}
