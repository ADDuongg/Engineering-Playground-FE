import Link from "next/link";
import { Zap } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

const STATS = [
  { label: "Labs completed", value: "2", suffix: "/8" },
  { label: "XP", value: "1,240", color: "text-accent" },
  { label: "Quiz avg", value: "87%", color: "text-success" },
  { label: "Time this week", value: "3h 12m" },
];

const RECENT = [
  { title: "EXPLAIN ANALYZE", difficulty: "warning" as const, meta: "2h ago" },
  { title: "Index Playground", difficulty: "success" as const, meta: "Completed" },
  { title: "OFFSET vs Cursor", difficulty: "success" as const, meta: "Yesterday" },
];

export function DashboardPage() {
  return (
    <>
      <AuthAppTopbar title="Dashboard" badge="7-day streak" />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <Badge variant="accent" className="mb-4 sm:hidden">
          7-day streak
        </Badge>
        <Card className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
            <Zap className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <Badge variant="success">In progress</Badge>
            <h2 className="my-2 text-xl font-semibold">Index Playground</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Exercise 2 of 4 · Create index on email
            </p>
            <Progress value={45} />
          </div>
          <Button asChild className="w-full shrink-0 sm:w-auto">
            <Link href={ROUTES.labWorkspace("index-playground")}>
              Continue lab
            </Link>
          </Button>
        </Card>

        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-border-subtle bg-surface-2 p-4"
            >
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className={`font-mono-tabular text-2xl ${stat.color ?? ""}`}>
                {stat.value}
                {stat.suffix && (
                  <span className="text-base text-muted-foreground">
                    {stat.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Recent labs</h3>
            <Card className="overflow-hidden p-0">
              {RECENT.map((item) => (
                <Link
                  key={item.title}
                  href={ROUTES.labDetail("index-playground")}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border-subtle p-4 text-sm last:border-0 hover:bg-surface-2"
                >
                  <Badge variant={item.difficulty}>{item.difficulty === "warning" ? "Intermediate" : "Beginner"}</Badge>
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  <span className="shrink-0 font-mono text-muted-foreground">
                    {item.meta}
                  </span>
                </Link>
              ))}
            </Card>
            <h3 className="my-6 text-lg font-semibold">Recommended next</h3>
            <Link href={ROUTES.labDetail("transactions")}>
              <Card className="transition-colors hover:border-accent hover:bg-surface-2">
                <Badge variant="warning">Intermediate</Badge>
                <h4 className="my-2 font-semibold">Transactions &amp; deadlocks</h4>
                <p className="text-sm text-muted-foreground">
                  Prerequisite: Index Playground ✓ · 40 min
                </p>
              </Card>
            </Link>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <Zap className="mx-auto mb-2 h-6 w-6 text-accent" />
                <div className="text-xs text-muted-foreground">First index</div>
              </Card>
              <Card className="p-4 text-center opacity-40">
                <div className="text-xs text-muted-foreground">Lock master</div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
