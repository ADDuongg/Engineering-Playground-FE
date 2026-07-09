"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronLeft, Play } from "lucide-react";
import type { LabDefinition, LabMetric } from "@/shared/types/lab";
import { ROUTES } from "@/shared/constants/routes";
import { SqlEditor } from "@/shared/components/editor/sql-editor";
import { MetricCell, MetricGrid } from "@/shared/components/common/metric-cell";
import { WorkspaceShell } from "@/shared/components/layout/workspace-shell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/utils";

interface SqlExecutionProps {
  isRunning: boolean;
  onRun: (sql: string) => void;
  disabled?: boolean;
}

interface LabWorkspaceProps {
  lab: LabDefinition;
  sqlExecution?: SqlExecutionProps;
  errorSlot?: ReactNode;
  resultSlot?: ReactNode;
  explainPlanSlot?: ReactNode;
  metricsOverride?: LabMetric[];
  metricsHistorySlot?: ReactNode;
  datasetSlot?: ReactNode;
  datasetStatusSlot?: ReactNode;
  actionsSlot?: ReactNode;
  /** Optional guided curriculum panel (e.g. Index Playground summary steps). */
  guidedSlot?: ReactNode;
  /** Optional before/after scan comparison (Explain metrics). */
  comparisonSlot?: ReactNode;
  /** Controlled SQL editor value. When set with onQueryChange, editor is controlled. */
  query?: string;
  onQueryChange?: (sql: string) => void;
}

export function LabWorkspace({
  lab,
  sqlExecution,
  errorSlot,
  resultSlot,
  explainPlanSlot,
  metricsOverride,
  metricsHistorySlot,
  datasetSlot,
  datasetStatusSlot,
  actionsSlot,
  guidedSlot,
  comparisonSlot,
  query: controlledQuery,
  onQueryChange,
}: LabWorkspaceProps) {
  const [uncontrolledQuery, setUncontrolledQuery] = useState(lab.defaultQuery);
  const [mockRunning, setMockRunning] = useState(false);

  const isControlled =
    controlledQuery !== undefined && typeof onQueryChange === "function";
  const query = isControlled ? controlledQuery : uncontrolledQuery;
  const setQuery = isControlled ? onQueryChange : setUncontrolledQuery;

  const isRunning = sqlExecution?.isRunning ?? mockRunning;

  const handleRun = () => {
    if (sqlExecution) {
      sqlExecution.onRun(query);
      return;
    }

    setMockRunning(true);
    setTimeout(() => setMockRunning(false), 1200);
  };

  const hasLivePlan = Boolean(explainPlanSlot);
  const hasLiveMetrics = Boolean(metricsOverride?.length);
  const hasLiveData = hasLivePlan || hasLiveMetrics;

  const workspaceTabs = (
    <Tabs
      defaultValue="sql"
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex shrink-0 flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="h-9 w-full sm:w-auto">
          <TabsTrigger value="sql" className="flex-1 text-xs sm:flex-none sm:text-sm">
            SQL
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex-1 text-xs sm:flex-none sm:text-sm">
            Explain execution
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex-1 text-xs sm:flex-none sm:text-sm">
            Metrics
          </TabsTrigger>
        </TabsList>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <Badge variant="muted" className="hidden sm:inline-flex">
            {hasLiveData ? "Live" : "Preview"}
          </Badge>
          {actionsSlot}
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning || sqlExecution?.disabled}
          >
            <Play className="h-3.5 w-3.5" />
            {isRunning ? "Running…" : "Run Query"}
          </Button>
        </div>
      </div>

      <TabsContent
        value="sql"
        className="mt-0 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden data-[state=inactive]:hidden"
      >
        {errorSlot}

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
          <SqlEditor
            value={query}
            onChange={setQuery}
            className={cn(
              "min-h-0",
              resultSlot ? "flex-[1_1_40%]" : "min-h-[200px] flex-1",
            )}
          />

          {resultSlot && (
            <div className="flex min-h-[160px] flex-[1_1_60%] flex-col overflow-hidden border-t border-border pt-3">
              {resultSlot}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent
        value="execution"
        className="mt-0 min-h-0 flex-1 overflow-auto data-[state=inactive]:hidden"
      >
        {explainPlanSlot ?? (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-4 text-sm text-muted-foreground">
            <p>Run a query to see the planner&apos;s execution plan.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="metrics"
        className="mt-0 min-h-0 flex-1 overflow-auto data-[state=inactive]:hidden"
      >
        {hasLiveMetrics && metricsOverride ? (
          <div className="space-y-4 py-1">
            <MetricGrid>
              {metricsOverride.map((metric) => (
                <MetricCell
                  key={metric.id}
                  label={metric.label}
                  value={metric.value}
                  variant={metric.variant}
                />
              ))}
            </MetricGrid>
            {comparisonSlot}
            {metricsHistorySlot}
          </div>
        ) : comparisonSlot ? (
          <div className="space-y-4 py-1">{comparisonSlot}</div>
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-4 text-sm text-muted-foreground">
            <p>Run a query to collect engineering metrics.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  const topbar = (
    <header className="flex h-[var(--topbar-height)] shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:gap-3 sm:px-4">
      <Button variant="ghost" size="icon" asChild className="shrink-0">
        <Link href={ROUTES.labs} aria-label="Back to Labs">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href={ROUTES.labs} className="hidden shrink-0 hover:text-foreground sm:inline">
          Labs
        </Link>
        <span className="hidden shrink-0 sm:inline">/</span>
        <Link
          href={ROUTES.labDetail(lab.slug)}
          className="truncate hover:text-foreground"
        >
          {lab.title}
        </Link>
        <span className="hidden shrink-0 sm:inline">/</span>
        <span className="hidden shrink-0 text-foreground sm:inline">Experiment</span>
      </nav>

      <Button size="sm" asChild className="shrink-0">
        <Link href={ROUTES.quiz(lab.slug)}>
          <span className="hidden sm:inline">Take quiz</span>
          <span className="sm:hidden">Quiz</span>
        </Link>
      </Button>
    </header>
  );

  const leftPanel = (
    <Tabs
      defaultValue={guidedSlot ? "guided" : "objective"}
      className="p-3"
    >
      <TabsList className="w-full overflow-x-auto">
        {guidedSlot ? (
          <TabsTrigger value="guided">Guided</TabsTrigger>
        ) : null}
        <TabsTrigger value="objective">Objective</TabsTrigger>
        <TabsTrigger value="theory">Theory</TabsTrigger>
        <TabsTrigger value="exercises">Exercises</TabsTrigger>
      </TabsList>
      {guidedSlot ? (
        <TabsContent value="guided" className="mt-0 p-0">
          {guidedSlot}
        </TabsContent>
      ) : null}
      <TabsContent value="objective" className="space-y-3 p-3">
        <Badge variant="accent">
          {lab.category} · {lab.difficulty}
        </Badge>
        <h4 className="text-sm font-semibold">Why this matters</h4>
        <p className="text-sm text-muted-foreground">{lab.objective}</p>
      </TabsContent>
      <TabsContent value="theory" className="space-y-3 p-3">
        <h4 className="text-sm font-semibold">Theory</h4>
        <p className="text-sm text-muted-foreground">{lab.theory}</p>
        {lab.theoryPoints && (
          <ul className="list-disc space-y-1 ps-4 text-sm text-muted-foreground">
            {lab.theoryPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </TabsContent>
      <TabsContent value="exercises" className="space-y-1 p-3">
        {lab.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-2 text-sm",
              exercise.status === "active" && "bg-accent/10 text-accent",
              exercise.status === "done" && "text-success",
            )}
          >
            <span
              className={cn(
                "grid h-[18px] w-[18px] shrink-0 place-items-center rounded border border-border text-[10px]",
                exercise.status === "done" &&
                  "border-success bg-success/10 text-success",
              )}
            >
              {exercise.status === "done" ? "✓" : ""}
            </span>
            {exercise.title}
          </div>
        ))}
      </TabsContent>
      {lab.tips && (
        <div className="border-t border-border p-4">
          <h4 className="mb-2 text-sm font-semibold">Tips</h4>
          <p className="font-mono text-sm text-warning">{lab.tips}</p>
        </div>
      )}
    </Tabs>
  );

  const centerPanel = (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
      {datasetStatusSlot}

      {datasetSlot}

      {workspaceTabs}
    </div>
  );

  return (
    <WorkspaceShell
      topbar={topbar}
      leftPanel={leftPanel}
      centerPanel={centerPanel}
    />
  );
}
