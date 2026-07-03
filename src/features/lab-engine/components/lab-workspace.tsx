"use client";

import Link from "next/link";
import { useState } from "react";
import { Play } from "lucide-react";
import type { LabDefinition } from "@/shared/types/lab";
import { ROUTES } from "@/shared/constants/routes";
import { SqlEditor } from "@/shared/components/editor/sql-editor";
import { MetricCell, MetricGrid } from "@/shared/components/common/metric-cell";
import { WorkspaceShell } from "@/shared/components/layout/workspace-shell";
import { Logo } from "@/shared/components/common/logo";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/utils";

interface LabWorkspaceProps {
  lab: LabDefinition;
}

const STEPS = ["Objective", "Theory", "Experiment", "Viz", "Quiz"] as const;

export function LabWorkspace({ lab }: LabWorkspaceProps) {
  const [query, setQuery] = useState(lab.defaultQuery);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1200);
  };

  const stepPills = STEPS.map((step) => (
    <span
      key={step}
      className={cn(
        "shrink-0 rounded-sm px-2 py-1 font-mono text-xs text-muted-foreground",
        step.toLowerCase() === lab.currentStep && "bg-accent/10 text-accent",
        step === "Objective" && "text-success",
        step === "Theory" && "text-success",
      )}
    >
      {step}
    </span>
  ));

  const topbar = (
    <header className="shrink-0 border-b border-border bg-surface">
      <div className="flex h-[var(--topbar-height)] items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <Button variant="ghost" size="sm" asChild className="shrink-0 px-2 sm:px-3">
          <Link href={ROUTES.labs}>
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← Labs</span>
          </Link>
        </Button>

        <Logo size="sm" className="pointer-events-none hidden sm:block" />

        <p className="min-w-0 flex-1 truncate text-sm font-semibold lg:hidden">
          {lab.title}
        </p>

        <div className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground lg:flex">
          <Link href={ROUTES.labs} className="shrink-0 hover:text-foreground">
            Labs
          </Link>
          <span>/</span>
          <Link
            href={ROUTES.labDetail(lab.slug)}
            className="truncate hover:text-foreground"
          >
            {lab.title}
          </Link>
          <span>/</span>
          <span className="shrink-0 text-foreground">Experiment</span>
        </div>

        <div className="ms-auto hidden shrink-0 gap-1 xl:flex">{stepPills}</div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button variant="secondary" size="sm" className="hidden md:inline-flex">
            Bookmark
          </Button>
          <Button size="sm" asChild>
            <Link href={ROUTES.quiz}>
              <span className="hidden sm:inline">Complete lab →</span>
              <span className="sm:hidden">Done</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-border px-3 py-1.5 xl:hidden">
        {stepPills}
      </div>
    </header>
  );

  const leftPanel = (
    <Tabs defaultValue="objective" className="p-3">
      <TabsList className="w-full overflow-x-auto">
        <TabsTrigger value="objective">Objective</TabsTrigger>
        <TabsTrigger value="theory">Theory</TabsTrigger>
        <TabsTrigger value="exercises">Exercises</TabsTrigger>
      </TabsList>
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
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="shrink-0 font-mono text-xs text-muted-foreground">
          Dataset
        </label>
        <select className="min-w-0 flex-1 rounded-sm border border-border bg-surface-2 px-2 py-1.5 text-sm sm:max-w-xs">
          <option>users · 1,000,000 rows</option>
          <option>orders · 500K</option>
          <option>products · 50K</option>
        </select>
        <Button size="sm" onClick={handleRun} disabled={isRunning} className="w-full sm:w-auto">
          <Play className="h-3.5 w-3.5" />
          {isRunning ? "Running…" : "Run Query"}
        </Button>
      </div>
      <SqlEditor value={query} onChange={setQuery} className="min-h-[200px] flex-1" />
    </div>
  );

  const rightPanel = (
    <div>
      <div className="flex items-center justify-between border-b border-border p-3">
        <h3 className="text-base font-semibold">Execution Plan</h3>
        <Badge variant="muted">Live</Badge>
      </div>
      <div className="flex flex-col items-center gap-3 p-4">
        <div className="w-full max-w-[280px] rounded-md border border-danger bg-surface-3 p-3 font-mono text-sm opacity-100">
          <span className="float-end text-xs text-muted-foreground">cost=2400</span>
          Seq Scan on users
        </div>
        <div className="h-5 w-px bg-border" />
        <div className="w-full max-w-[280px] rounded-md border border-border bg-surface-3 p-3 font-mono text-sm opacity-50">
          <span className="float-end text-xs text-muted-foreground">rows=1</span>
          Filter: email = &apos;…&apos;
        </div>
      </div>
    </div>
  );

  const bottomPanel = (
    <div className="p-4">
      <h4 className="mb-3 hidden font-mono text-xs uppercase tracking-widest text-muted-foreground xl:block">
        Metrics
      </h4>
      <MetricGrid>
        {lab.metrics.map((metric) => (
          <MetricCell
            key={metric.id}
            label={metric.label}
            value={metric.value}
            variant={metric.variant}
          />
        ))}
      </MetricGrid>
    </div>
  );

  return (
    <WorkspaceShell
      topbar={topbar}
      leftPanel={leftPanel}
      centerPanel={centerPanel}
      rightPanel={rightPanel}
      bottomPanel={bottomPanel}
    />
  );
}
