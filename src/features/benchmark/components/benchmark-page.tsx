"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { BenchmarkChart } from "@/shared/components/charts/benchmark-chart";
import { MetricCell, MetricGrid } from "@/shared/components/common/metric-cell";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

const CHART_DATA = [
  { name: "0s", value: 12 },
  { name: "5s", value: 18 },
  { name: "10s", value: 24 },
  { name: "15s", value: 32 },
  { name: "20s", value: 28 },
  { name: "25s", value: 35 },
  { name: "30s", value: 42 },
];

export function BenchmarkPage() {
  const [rps, setRps] = useState(300);
  const [users, setUsers] = useState(100);
  const [mobileTab, setMobileTab] = useState<"config" | "results">("results");

  const configPanel = (
    <aside className="overflow-auto border-e border-border bg-surface p-4 sm:p-5 lg:h-full">
      <Button variant="ghost" size="sm" className="mb-5" asChild>
        <Link href={ROUTES.labs}>← Labs</Link>
      </Button>
      <h2 className="mb-2 text-lg font-semibold">Benchmark config</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Load test API endpoint backed by your query
      </p>
      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-1 flex justify-between text-sm">
            <span>Concurrent users</span>
            <span className="font-mono-tabular">{users}</span>
          </label>
          <input
            type="range"
            min={10}
            max={5000}
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="mb-1 flex justify-between text-sm">
            <span>Target RPS</span>
            <span className="font-mono-tabular">{rps}</span>
          </label>
          <input
            type="range"
            min={100}
            max={5000}
            step={100}
            value={rps}
            onChange={(e) => setRps(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>
      <div className="mb-6">
        <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Dataset
        </h4>
        <Input defaultValue="users · 1M rows" className="mb-2" />
      </div>
      <Button className="w-full">Start benchmark</Button>
      <Button variant="secondary" size="sm" className="mt-2 w-full">
        Save as baseline
      </Button>
    </aside>
  );

  const resultsPanel = (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2 sm:px-5">
        <div className="flex items-center gap-2 font-mono text-xs text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          LIVE · 18s remaining
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            Latency
          </Button>
          <Button variant="ghost" size="sm">
            Throughput
          </Button>
          <Button variant="ghost" size="sm">
            Errors
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4 sm:p-5">
        <h3 className="mb-4 text-lg font-semibold">Response time</h3>
        <BenchmarkChart data={CHART_DATA} />
        <MetricGrid className="mt-6">
          <MetricCell label="P50" value="24 ms" />
          <MetricCell label="P95" value="48 ms" />
          <MetricCell label="P99" value="120 ms" variant="bad" />
          <MetricCell label="RPS" value="298" variant="good" />
          <MetricCell label="Errors" value="0.1%" />
          <MetricCell label="Throughput" value="1.2 MB/s" />
        </MetricGrid>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,280px)_1fr]">
      <div className="flex shrink-0 border-b border-border bg-surface lg:hidden">
        {(["config", "results"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            className={cn(
              "flex-1 border-b-2 px-3 py-2 text-sm capitalize transition-colors",
              mobileTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="hidden lg:contents">{configPanel}</div>
      <div className="hidden lg:contents">{resultsPanel}</div>

      <div className="min-h-0 flex-1 overflow-auto lg:hidden">
        {mobileTab === "config" ? configPanel : resultsPanel}
      </div>
    </div>
  );
}
