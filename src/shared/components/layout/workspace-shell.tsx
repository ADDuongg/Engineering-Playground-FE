"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  useWorkspaceStore,
  WORKSPACE_LEFT_PANEL_MAX,
  WORKSPACE_LEFT_PANEL_MIN,
} from "@/shared/lib/stores/workspace-store";
import { cn } from "@/shared/lib/utils";

type MobilePanel = "guide" | "editor";

interface WorkspaceShellProps {
  topbar: React.ReactNode;
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
}

const MOBILE_TABS: { id: MobilePanel; label: string }[] = [
  { id: "guide", label: "Guide" },
  { id: "editor", label: "Editor" },
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
  const [isResizing, setIsResizing] = useState(false);

  const leftPanelWidth = useWorkspaceStore((s) => s.leftPanelWidth);
  const setLeftPanelWidth = useWorkspaceStore((s) => s.setLeftPanelWidth);

  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const hasBottomPanel = Boolean(bottomPanel);
  const hasRightPanel = Boolean(rightPanel);

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragStartX.current = event.clientX;
      dragStartWidth.current = leftPanelWidth;
      setIsResizing(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [leftPanelWidth],
  );

  const handleResizePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isResizing) {
        return;
      }

      const delta = event.clientX - dragStartX.current;
      setLeftPanelWidth(dragStartWidth.current + delta);
    },
    [isResizing, setLeftPanelWidth],
  );

  const stopResizing = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isResizing) {
        return;
      }

      setIsResizing(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [isResizing],
  );

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing]);

  return (
    <div
      className={cn(
        "grid h-dvh overflow-hidden",
        hasBottomPanel
          ? "grid-rows-[auto_auto_1fr_auto] xl:grid-rows-[auto_1fr_auto]"
          : "grid-rows-[auto_auto_1fr] xl:grid-rows-[auto_1fr]",
      )}
    >
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
        <div
          className={cn(
            "hidden h-full min-h-0 xl:grid",
            hasRightPanel
              ? "xl:grid-cols-[var(--workspace-left-width)_1fr_var(--workspace-right-width)]"
              : "xl:grid-cols-[var(--workspace-left-width)_1fr]",
          )}
          style={
            {
              "--workspace-left-width": `${leftPanelWidth}px`,
            } as React.CSSProperties
          }
        >
          <aside className="relative min-w-0 overflow-auto border-e border-border bg-surface">
            {leftPanel}
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize guide panel"
              aria-valuemin={WORKSPACE_LEFT_PANEL_MIN}
              aria-valuemax={WORKSPACE_LEFT_PANEL_MAX}
              aria-valuenow={leftPanelWidth}
              tabIndex={0}
              onPointerDown={handleResizePointerDown}
              onPointerMove={handleResizePointerMove}
              onPointerUp={stopResizing}
              onPointerCancel={stopResizing}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  setLeftPanelWidth(leftPanelWidth - 16);
                }
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  setLeftPanelWidth(leftPanelWidth + 16);
                }
              }}
              className={cn(
                "absolute inset-y-0 end-0 z-10 w-1.5 cursor-col-resize touch-none",
                "hover:bg-accent/40",
                isResizing && "bg-accent/50",
              )}
            />
          </aside>
          <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background">
            {centerPanel}
          </main>
          {hasRightPanel && (
            <aside className="overflow-auto border-s border-border bg-surface">
              {rightPanel}
            </aside>
          )}
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
