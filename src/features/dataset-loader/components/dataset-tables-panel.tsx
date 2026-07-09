import {
  DATASET_TIER_OPTIONS,
  formatDatasetTierLabel,
} from "@/features/dataset-loader/constants/dataset-tiers";
import type { DatasetMetadata, DatasetTier } from "@/features/dataset-loader/types/dataset";
import { formatRowCount } from "@/features/dataset-loader/utils/format-dataset-error";
import { cn } from "@/shared/lib/utils";

interface DatasetTablesPanelProps {
  metadata: DatasetMetadata | undefined;
  selectedTier: DatasetTier;
  onTierChange: (tier: DatasetTier) => void;
  tierChangeDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function DatasetTablesPanel({
  metadata,
  selectedTier,
  onTierChange,
  tierChangeDisabled = false,
  isLoading = false,
  className,
}: DatasetTablesPanelProps) {
  if (isLoading && !metadata) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        Loading tables…
      </div>
    );
  }

  const familyLabel =
    metadata?.familyLabel ??
    metadata?.family ??
    "Dataset";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="dataset-tier-select"
          className="shrink-0 font-mono text-xs text-muted-foreground"
        >
          Dataset
        </label>
        <select
          id="dataset-tier-select"
          value={selectedTier}
          disabled={tierChangeDisabled}
          onChange={(event) => onTierChange(event.target.value as DatasetTier)}
          className="min-w-0 flex-1 rounded-sm border border-border bg-surface-2 px-2 py-1.5 text-sm sm:max-w-xs disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Dataset tier"
        >
          {DATASET_TIER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {familyLabel} · {option.label}
            </option>
          ))}
        </select>
        {isLoading && (
          <span className="text-xs text-muted-foreground">Preparing…</span>
        )}
      </div>

      {!metadata || metadata.tier !== selectedTier ? (
        <p className="text-xs text-muted-foreground">
          Preparing {familyLabel} · {formatDatasetTierLabel(selectedTier)}…
        </p>
      ) : metadata.status === "ready" ? (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {metadata.tables.map((table) => (
            <li key={table.name} className="flex items-center justify-between gap-2">
              <span className="truncate">
                {table.label}
                {table.description ? ` — ${table.description}` : ""}
              </span>
              <span className="shrink-0 font-mono">
                {table.actualRowCount !== null
                  ? formatRowCount(table.actualRowCount)
                  : formatRowCount(table.targetRowCount)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          Table row counts appear after preparation completes.
        </p>
      )}
    </div>
  );
}
