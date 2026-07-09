"use client";

import { useState } from "react";
import {
  ArrowDownUp,
  CircleDot,
  Copy,
  Filter,
  GitMerge,
  Layers,
  Search,
  Zap,
} from "lucide-react";
import type { ExplainPlanNode, ExplainRunResult } from "@/features/explain-runner/types/explain";
import {
  buildPlanSummary,
  formatPlanStatLabel,
  getPlanNodePresentation,
  type PlanNodeIcon,
} from "@/features/explain-runner/utils/format-plan-node";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

interface ExplainPlanTreeProps {
  result: ExplainRunResult;
  className?: string;
}

interface PlanNodeRowProps {
  node: ExplainPlanNode;
  depth?: number;
  isLast?: boolean;
}

const ICONS: Record<PlanNodeIcon, typeof Search> = {
  scan: Search,
  index: Zap,
  join: GitMerge,
  sort: ArrowDownUp,
  filter: Filter,
  aggregate: Layers,
  other: CircleDot,
};

const VARIANT_STYLES = {
  good: "border-success/40 bg-success/5",
  bad: "border-danger/40 bg-danger/5",
  neutral: "border-border bg-surface-2",
} as const;

const VARIANT_ICON_STYLES = {
  good: "text-success bg-success/10",
  bad: "text-danger bg-danger/10",
  neutral: "text-muted-foreground bg-surface-3",
} as const;

function formatRawPlanText(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function PlanNodeRow({ node, depth = 0, isLast = true }: PlanNodeRowProps) {
  const presentation = getPlanNodePresentation(node);
  const Icon = ICONS[presentation.icon];
  const stats = (["rows", "cost", "time"] as const)
    .map((key) => formatPlanStatLabel(key, node))
    .filter((value): value is string => value !== undefined);

  return (
    <div className="relative">
      {depth > 0 && (
        <>
          <span
            className={cn(
              "absolute left-[11px] top-0 w-px bg-border",
              isLast ? "h-5" : "h-full",
            )}
            aria-hidden
          />
          <span
            className="absolute left-[11px] top-5 h-px w-4 bg-border"
            aria-hidden
          />
        </>
      )}

      <div
        className={cn("relative pb-3", depth > 0 && "ms-6")}
        style={{ zIndex: 1 }}
      >
        <div
          className={cn(
            "flex gap-3 rounded-md border p-3 sm:items-start",
            VARIANT_STYLES[presentation.variant],
          )}
        >
          <div
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-md",
              VARIANT_ICON_STYLES[presentation.variant],
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold leading-snug">
                  {presentation.title}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {node.relationName
                    ? `${node.nodeType} · ${node.relationName}`
                    : node.nodeType}
                </p>
              </div>

              {stats.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {stats.map((stat) => (
                    <Badge key={stat} variant="muted" className="font-mono text-[10px]">
                      {stat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {presentation.description}
            </p>

            {(node.filter || node.indexName) && (
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-2">
                {node.filter && (
                  <p className="rounded-sm bg-surface-3 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                    Filter: {node.filter}
                  </p>
                )}
                {node.indexName && (
                  <p className="rounded-sm bg-success/10 px-2 py-1 font-mono text-[10px] text-success">
                    Index: {node.indexName}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {node.children?.map((child, index) => (
        <PlanNodeRow
          key={`${depth}-${index}`}
          node={child}
          depth={depth + 1}
          isLast={index === (node.children?.length ?? 0) - 1}
        />
      ))}
    </div>
  );
}

export function ExplainPlanTree({ result, className }: ExplainPlanTreeProps) {
  const [showRawPlan, setShowRawPlan] = useState(false);
  const summary = buildPlanSummary(result.plan);
  const rootPresentation = getPlanNodePresentation(result.plan);

  const handleCopyRawPlan = async () => {
    if (!result.rawPlanText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatRawPlanText(result.rawPlanText));
      toast.success("Raw plan copied");
    } catch {
      toast.error("Could not copy raw plan");
    }
  };

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4">
        <Badge variant="muted">{result.statementKind}</Badge>
        <span className="text-xs text-muted-foreground">
          {result.dataset.family} · {result.dataset.tier} · {result.dataset.version}
        </span>
        {result.planningTimeMs !== undefined && (
          <span className="text-xs text-muted-foreground">
            · planning {result.planningTimeMs.toFixed(2)} ms
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          · {result.executionTimeMs.toLocaleString()} ms
        </span>
        {result.rawPlanText && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ms-auto h-7 px-2 text-xs text-muted-foreground"
            onClick={() => setShowRawPlan((open) => !open)}
          >
            {showRawPlan ? "Hide raw plan" : "Raw plan"}
          </Button>
        )}
      </div>

      <div
        className={cn(
          "mx-4 rounded-md border px-3 py-2.5 text-sm leading-relaxed",
          VARIANT_STYLES[rootPresentation.variant],
        )}
      >
        <p className="font-medium">What this means</p>
        <p className="mt-1 text-muted-foreground">{summary}</p>
      </div>

      <div className="overflow-auto px-4 pb-4">
        <PlanNodeRow node={result.plan} />
      </div>

      {showRawPlan && result.rawPlanText && (
        <div className="shrink-0 border-t border-border px-4 pb-4">
          <div className="mb-2 flex items-center justify-between gap-2 pt-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Raw plan
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs"
              onClick={handleCopyRawPlan}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
          <pre className="max-h-40 overflow-auto rounded-md border border-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {formatRawPlanText(result.rawPlanText)}
          </pre>
        </div>
      )}
    </div>
  );
}
