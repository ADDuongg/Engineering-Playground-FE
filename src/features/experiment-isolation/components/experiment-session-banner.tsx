import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { formatIsolationErrorMessage } from "@/features/experiment-isolation/utils/format-isolation-error";
import type { ExperimentSessionStatus } from "@/features/experiment-isolation/types/experiment-session";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type SessionBannerStatus = ExperimentSessionStatus | "loading";

interface ExperimentSessionBannerProps {
  status: SessionBannerStatus;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

const STATUS_LABELS: Record<SessionBannerStatus, string> = {
  loading: "Starting experiment session",
  provisioning: "Provisioning isolated session",
  ready: "Session ready",
  expired: "Session expired",
  failed: "Session provisioning failed",
};

const STATUS_VARIANTS: Record<
  SessionBannerStatus,
  "default" | "accent" | "muted" | "danger"
> = {
  loading: "muted",
  provisioning: "accent",
  ready: "default",
  expired: "danger",
  failed: "danger",
};

export function ExperimentSessionBanner({
  status,
  error,
  onRetry,
  className,
}: ExperimentSessionBannerProps) {
  const isWorking = status === "loading" || status === "provisioning";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-surface-2 p-3 sm:flex-row sm:items-center",
        (status === "failed" || status === "expired") &&
          "border-danger/40 bg-danger/5",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {isWorking ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
        ) : status === "failed" || status === "expired" ? (
          <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
        ) : null}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{STATUS_LABELS[status]}</p>
            <Badge variant={STATUS_VARIANTS[status]}>{status}</Badge>
          </div>

          {(status === "failed" || status === "expired") && error ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatIsolationErrorMessage(error)}
            </p>
          ) : isWorking ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Preparing an isolated playground before loading the dataset.
            </p>
          ) : null}
        </div>
      </div>

      {(status === "failed" || status === "expired") && onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="shrink-0">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
