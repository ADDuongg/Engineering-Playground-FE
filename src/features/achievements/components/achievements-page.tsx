import { Zap, Lock, Database, Gauge } from "lucide-react";
import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { Card } from "@/shared/components/ui/card";

const ACHIEVEMENTS = [
  { icon: Zap, title: "First index", desc: "Created your first B-tree index", unlocked: true },
  { icon: Database, title: "Plan reader", desc: "Ran EXPLAIN ANALYZE", unlocked: true },
  { icon: Lock, title: "Lock master", desc: "Resolved a deadlock", unlocked: false },
  { icon: Gauge, title: "Load tester", desc: "Ran 1000 RPS benchmark", unlocked: false },
];

export function AchievementsPage() {
  return (
    <>
      <AppTopbar title="Achievements" />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <p className="mb-6 text-muted-foreground">
          2 of 4 achievements unlocked
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => (
            <Card
              key={a.title}
              className={a.unlocked ? "text-center" : "text-center opacity-40"}
            >
              <a.icon className="mx-auto mb-3 h-8 w-8 text-accent" />
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
