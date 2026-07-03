import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { LABS_CATALOG } from "@/shared/constants/labs-catalog";
import { ROUTES } from "@/shared/constants/routes";
import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

const PATH_STEPS = [
  { title: "SQL Basics", status: "done" },
  { title: "Indexes", status: "active" },
  { title: "Query Optimization", status: "pending" },
  { title: "EXPLAIN ANALYZE", status: "pending" },
  { title: "Transactions", status: "pending" },
  { title: "Isolation Levels", status: "pending" },
  { title: "Redis Cache", status: "pending" },
  { title: "Load Testing", status: "pending" },
];

export function LearningPage() {
  return (
    <>
      <AppTopbar title="Learning path" />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">PostgreSQL Performance</h2>
          <p className="mt-2 text-muted-foreground">
            Progressive path from indexes to load testing. 2 of 8 labs completed.
          </p>
          <Progress value={25} className="mt-4 max-w-md" />
        </div>

        <div className="mb-10 space-y-2">
          {PATH_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-border bg-surface p-4"
            >
              {step.status === "done" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              ) : step.status === "active" ? (
                <Circle className="h-5 w-5 shrink-0 text-accent" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 font-medium">{step.title}</span>
              {step.status === "active" && (
                <Badge variant="accent">In progress</Badge>
              )}
              {step.status === "done" && (
                <Badge variant="success">Completed</Badge>
              )}
            </div>
          ))}
        </div>

        <h3 className="mb-4 text-lg font-semibold">All labs in path</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LABS_CATALOG.map((lab) => (
            <Link key={lab.slug} href={ROUTES.labDetail(lab.slug)}>
              <Card className="transition-colors hover:border-accent">
                <h4 className="font-semibold">{lab.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lab.duration}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
