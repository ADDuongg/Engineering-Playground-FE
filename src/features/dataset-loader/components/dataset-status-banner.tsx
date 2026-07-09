import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { formatDatasetErrorMessage } from "@/features/dataset-loader/utils/format-dataset-error";
import type { DatasetPreparationState } from "@/features/dataset-loader/types/dataset";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface DatasetStatusBannerProps {
  status: DatasetPreparationState | "loading";
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

const STATUS_LABELS: Record<DatasetPreparationState | "loading", string> = {
  loading: "Loading dataset",
  not_started: "Starting dataset",
  preparing: "Preparing dataset",
  resetting: "Resetting dataset",
  ready: "Dataset ready",
  failed: "Dataset preparation failed",
};

const STATUS_VARIANTS: Record<
  DatasetPreparationState | "loading",
  "default" | "accent" | "muted" | "danger"
> = {
  loading: "muted",
  not_started: "muted",
  preparing: "accent",
  resetting: "accent",
  ready: "default",
  failed: "danger",
};

export function DatasetStatusBanner({
  status,
  error,
  onRetry,
  className,
}: DatasetStatusBannerProps) {
  const isWorking =
    status === "loading" ||
    status === "preparing" ||
    status === "resetting" ||
    status === "not_started";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-surface-2 p-3 sm:flex-row sm:items-center",
        status === "failed" && "border-danger/40 bg-danger/5",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {isWorking ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
        ) : status === "failed" ? (
          <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
        ) : null}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{STATUS_LABELS[status]}</p>
            <Badge variant={STATUS_VARIANTS[status]}>{status}</Badge>
          </div>

          {status === "failed" && error ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDatasetErrorMessage(error)}
            </p>
          ) : isWorking ? (
            <p className="mt-1 text-sm text-muted-foreground">
              SQL execution is disabled until the dataset is ready.
            </p>
          ) : null}
        </div>
      </div>

      {status === "failed" && onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="shrink-0">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
