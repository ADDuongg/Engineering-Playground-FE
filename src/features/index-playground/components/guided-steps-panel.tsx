"use client";

import Link from "next/link";
import type { LabGuidedStepAction, LabSummaryResponse } from "@/shared/labs";
import { ROUTES } from "@/shared/constants/routes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { formatLabSummaryErrorMessage } from "@/features/index-playground/utils/format-lab-summary-error";

interface GuidedStepsPanelProps {
  summary?: LabSummaryResponse;
  isLoading?: boolean;
  error?: unknown;
  onApplySql: (sql: string) => void;
  onCaptureBefore?: () => void;
  onCaptureAfter?: () => void;
  className?: string;
}

function actionLabel(action: LabGuidedStepAction): string {
  switch (action) {
    case "run_sql":
      return "Run SQL";
    case "run_explain":
      return "Explain";
    case "run_explain_analyze":
      return "Explain analyze";
    case "create_index_sql":
      return "Create index";
    case "drop_index_sql":
      return "Drop index";
    case "compare_metrics":
      return "Compare";
    case "take_quiz":
      return "Quiz";
    case "optional_benchmark":
      return "Benchmark";
    default:
      return action;
  }
}

export function GuidedStepsPanel({
  summary,
  isLoading = false,
  error,
  onApplySql,
  onCaptureBefore,
  onCaptureAfter,
  className,
}: GuidedStepsPanelProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-2 p-3", className)}>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-2 p-3 text-sm", className)}>
        <p className="font-medium text-danger">Guided path unavailable</p>
        <p className="text-muted-foreground">
          {formatLabSummaryErrorMessage(error)}
        </p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const steps = [...summary.guidedSteps].sort((a, b) => a.order - b.order);

  return (
    <div className={cn("space-y-3 p-3", className)}>
      <div>
        <h4 className="text-sm font-semibold">Guided path</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          {summary.learningGoal}
        </p>
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={`${step.order}-${step.action}`}
            className="rounded-md border border-border bg-surface p-3"
          >
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {String(step.order).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium">{step.title}</span>
              <Badge variant="muted">{actionLabel(step.action)}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{step.instruction}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {step.action === "run_sql" ||
              step.action === "run_explain" ||
              step.action === "run_explain_analyze" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onApplySql(summary.recommendedQuery.sql)}
                >
                  Apply query
                </Button>
              ) : null}

              {step.action === "create_index_sql" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onApplySql(summary.recommendedCreateIndexSql)}
                >
                  Apply create index
                </Button>
              ) : null}

              {step.action === "drop_index_sql" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onApplySql(summary.recommendedDropIndexSql)}
                >
                  Apply drop index
                </Button>
              ) : null}

              {step.action === "compare_metrics" ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={onCaptureBefore}
                    disabled={!onCaptureBefore}
                  >
                    Capture before
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={onCaptureAfter}
                    disabled={!onCaptureAfter}
                  >
                    Capture after
                  </Button>
                </>
              ) : null}

              {step.action === "take_quiz" ? (
                <Button type="button" size="sm" asChild>
                  <Link href={ROUTES.quiz(summary.labSlug)}>Take quiz</Link>
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {summary.quizRequired &&
        !steps.some((step) => step.action === "take_quiz") && (
          <Button type="button" size="sm" asChild className="w-full">
            <Link href={ROUTES.quiz(summary.labSlug)}>Take quiz</Link>
          </Button>
        )}

      {summary.optionalBenchmarkNote ? (
        <p className="rounded-md border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
          {summary.optionalBenchmarkNote}
        </p>
      ) : null}

      <div className="space-y-1 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Recommended query</p>
        <p>{summary.recommendedQuery.description}</p>
        {summary.recommendedQuery.paramHints.length > 0 && (
          <p>Hints: {summary.recommendedQuery.paramHints.join(", ")}</p>
        )}
        {summary.recommendedQuery.exampleParameters.length > 0 && (
          <p className="font-mono">
            Bound params:{" "}
            {JSON.stringify(summary.recommendedQuery.exampleParameters)}
          </p>
        )}
        <p className="text-[11px]">
          Keep <code className="font-mono">$1</code> in SQL — parameters are
          sent separately on Run.
        </p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mt-2"
          onClick={() => onApplySql(summary.recommendedQuery.sql)}
        >
          Apply recommended query
        </Button>
      </div>
    </div>
  );
}
