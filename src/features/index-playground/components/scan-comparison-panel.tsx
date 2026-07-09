"use client";

import type { ScanComparisonSnapshot } from "@/features/index-playground/hooks/use-scan-comparison";
import type { IndexPlaygroundScanMetricKey } from "@/shared/labs";
import { cn } from "@/shared/lib/utils";

const DISPLAY_KEYS: IndexPlaygroundScanMetricKey[] = [
  "rows_scanned",
  "seq_scan_used",
  "index_scan_used",
  "planning_time_ms",
  "plan_execution_time_ms",
];

const KEY_LABELS: Record<IndexPlaygroundScanMetricKey, string> = {
  rows_scanned: "Rows scanned",
  seq_scan_used: "Seq scan",
  index_scan_used: "Index scan",
  planning_time_ms: "Planning (ms)",
  plan_execution_time_ms: "Plan exec (ms)",
};

interface ScanComparisonPanelProps {
  before: ScanComparisonSnapshot | null;
  after: ScanComparisonSnapshot | null;
  className?: string;
}

function formatScanValue(
  key: IndexPlaygroundScanMetricKey,
  value: number | undefined,
): string {
  if (value === undefined) {
    return "—";
  }

  if (key === "seq_scan_used" || key === "index_scan_used") {
    return value > 0 ? "Yes" : "No";
  }

  return String(value);
}

export function ScanComparisonPanel({
  before,
  after,
  className,
}: ScanComparisonPanelProps) {
  if (!before && !after) {
    return (
      <div
        className={cn(
          "rounded-md border border-border bg-surface p-3 text-sm text-muted-foreground",
          className,
        )}
      >
        Capture Explain scan metrics before and after creating the index to
        compare Seq Scan vs Index Scan.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-surface",
        className,
      )}
    >
      <div className="border-b border-border px-3 py-2 text-sm font-semibold">
        Scan comparison (Explain)
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Metric</th>
            <th className="px-3 py-2 font-medium">Before</th>
            <th className="px-3 py-2 font-medium">After</th>
          </tr>
        </thead>
        <tbody>
          {DISPLAY_KEYS.map((key) => {
            const beforeVal = before?.metrics[key];
            const afterVal = after?.metrics[key];
            if (beforeVal === undefined && afterVal === undefined) {
              return null;
            }

            return (
              <tr key={key} className="border-t border-border">
                <td className="px-3 py-2 text-muted-foreground">
                  {KEY_LABELS[key]}
                </td>
                <td className="px-3 py-2 font-mono-tabular">
                  {formatScanValue(key, beforeVal)}
                </td>
                <td className="px-3 py-2 font-mono-tabular">
                  {formatScanValue(key, afterVal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
