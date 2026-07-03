"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type MobilePanel = "guide" | "editor" | "plan";

interface WorkspaceShellProps {
  topbar: React.ReactNode;
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  bottomPanel?: React.ReactNode;
}

const MOBILE_TABS: { id: MobilePanel; label: string }[] = [
  { id: "guide", label: "Guide" },
  { id: "editor", label: "Editor" },
  { id: "plan", label: "Plan" },
];

export function WorkspaceShell({
  topbar,
  leftPanel,
  centerPanel,
  rightPanel,
  bottomPanel,
}: WorkspaceShellProps) {
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("editor");
  const [metricsOpen, setMetricsOpen] = useState(false);

  return (
    <div className="grid h-dvh grid-rows-[auto_auto_1fr_auto] overflow-hidden xl:grid-rows-[auto_1fr_auto]">
      {topbar}

      <div className="flex shrink-0 border-b border-border bg-surface xl:hidden">
        {MOBILE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobilePanel(tab.id)}
            className={cn(
              "flex-1 border-b-2 px-3 py-2 text-sm transition-colors",
              mobilePanel === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 overflow-hidden">
        <div className="hidden h-full min-h-0 xl:grid xl:grid-cols-[var(--workspace-left-width)_1fr_var(--workspace-right-width)]">
          <aside className="overflow-auto border-e border-border bg-surface">
            {leftPanel}
          </aside>
          <main className="flex min-w-0 flex-col bg-background">
            {centerPanel}
          </main>
          <aside className="overflow-auto border-s border-border bg-surface">
            {rightPanel}
          </aside>
        </div>

        <div className="h-full overflow-auto xl:hidden">
          {mobilePanel === "guide" && (
            <div className="bg-surface">{leftPanel}</div>
          )}
          {mobilePanel === "editor" && (
            <div className="flex h-full min-h-0 flex-col bg-background">
              {centerPanel}
            </div>
          )}
          {mobilePanel === "plan" && (
            <div className="bg-surface">{rightPanel}</div>
          )}
        </div>
      </div>

      {bottomPanel && (
        <div className="shrink-0 border-t border-border bg-surface">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium xl:hidden"
            onClick={() => setMetricsOpen((open) => !open)}
            aria-expanded={metricsOpen}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Metrics
            </span>
            {metricsOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <div
            className={cn(
              "overflow-auto xl:max-h-[var(--metrics-panel-max-height)]",
              metricsOpen ? "block" : "hidden xl:block",
            )}
          >
            {bottomPanel}
          </div>
        </div>
      )}
    </div>
  );
}
