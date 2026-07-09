"use client";

import { Loader2 } from "lucide-react";
import type { SqlRunStatusResult } from "@/features/sql-execution-queue/types/sql-run";
import {
  formatSqlRunStatusLabel,
  formatSqlRunStatusMessage,
} from "@/features/sql-execution-queue/utils/format-sql-run-error";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface SqlRunStatusBannerProps {
  status: SqlRunStatusResult;
  className?: string;
}

export function SqlRunStatusBanner({
  status,
  className,
}: SqlRunStatusBannerProps) {
  const isLive = status.status === "queued" || status.status === "running";
  const statusMessage = formatSqlRunStatusMessage(status);
  const datasetLabel =
    status.datasetFamily && status.datasetTier
      ? `${status.datasetFamily} · ${status.datasetTier}`
      : null;

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface p-4 text-sm",
        status.status === "failed" && "border-danger/40 bg-danger/5",
        status.status === "cancelled" && "border-danger/40 bg-danger/5",
        status.status === "completed" && "border-success/40 bg-success/5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isLive ? (
          <span className="flex items-center gap-2 font-mono text-xs text-success">
            {status.status === "running" ? (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Running
              </>
            ) : (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Queued
              </>
            )}
          </span>
        ) : (
          <Badge
            variant={
              status.status === "completed"
                ? "success"
                : status.status === "failed"
                  ? "danger"
                  : "muted"
            }
          >
            {formatSqlRunStatusLabel(status.status)}
          </Badge>
        )}

        {status.statementKind ? (
          <Badge variant="muted">{status.statementKind}</Badge>
        ) : null}

        {datasetLabel ? (
          <span className="text-xs text-muted-foreground">{datasetLabel}</span>
        ) : null}
      </div>

      {statusMessage ? (
        <p className="mt-2 text-muted-foreground">{statusMessage}</p>
      ) : null}
    </div>
  );
}
