import Link from "next/link";
import { Zap, BarChart3, Monitor } from "lucide-react";
import { LABS_CATALOG } from "@/shared/constants/labs-catalog";
import { ROUTES } from "@/shared/constants/routes";
import { PublicNav } from "@/shared/components/layout/public-nav";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

const FEATURES = [
  {
    icon: Zap,
    title: "Live execution plans",
    description:
      "Watch rows flow through operators. Seq scan vs index scan, hash join vs nested loop — animated.",
  },
  {
    icon: BarChart3,
    title: "Before / after benchmarks",
    description:
      "Toggle indexes, isolation levels, cache state. Metrics update live with animated counters.",
  },
  {
    icon: Monitor,
    title: "Zero setup sandbox",
    description:
      "Pre-loaded datasets at 100K, 1M, 10M rows. Docker-isolated. Reset anytime.",
  },
];

const ROADMAP = [
  { num: "01", title: "Indexes & scans", desc: "B-tree, selectivity, composite" },
  { num: "02", title: "Query planning", desc: "EXPLAIN, joins, costs" },
  { num: "03", title: "Transactions", desc: "ACID, locks, deadlocks" },
  { num: "04", title: "Caching & scale", desc: "Redis, batch, load test" },
];

export function LandingPage() {
  return (
    <>
      <PublicNav />
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-sm text-accent">
            Interactive database learning
          </p>
          <h1 className="mb-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Learn databases by experimenting
          </h1>
          <p className="mb-8 max-w-lg text-lg text-muted-foreground sm:text-xl">
            Run real SQL. Visualize execution plans. Compare before and after. No
            local Postgres install — just curiosity and a browser.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={ROUTES.labWorkspace("index-playground")}>
                Try Index Lab free
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href={ROUTES.labs}>Browse labs</Link>
            </Button>
          </div>
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            Used by 12,400+ developers · No credit card
          </p>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="flex gap-2 border-b border-border bg-surface-2 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="min-h-60 p-4 font-mono text-sm">
            <span className="syntax-keyword">SELECT</span> *{" "}
            <span className="syntax-keyword">FROM</span> users{" "}
            <span className="syntax-keyword">WHERE</span> email ={" "}
            <span className="syntax-string">&apos;…&apos;</span>;
            <br />
            <br />
            <span className="syntax-comment">
              → Seq Scan · 2,430ms · 1M rows
            </span>
            <br />
            <span className="syntax-comment">
              → Index Scan · 3ms · 1 row
            </span>
            <br />
            <br />
            <span className="text-success">↓ 99.9% faster with index</span>
          </div>
        </Card>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <h2 className="mb-3 text-2xl sm:text-3xl">See what docs can&apos;t show you</h2>
          <p className="max-w-lg text-lg text-muted-foreground">
            Every lab follows: objective → experiment → visualization → metrics →
            quiz.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-md border border-border bg-surface-2 text-accent">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="labs" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10">
            <h2 className="mb-3 text-2xl sm:text-3xl">Popular labs</h2>
            <p className="text-lg text-muted-foreground">
              8 MVP labs shipping. MongoDB, Kafka, Linux perf on the roadmap.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LABS_CATALOG.slice(0, 4).map((lab) => (
              <Link key={lab.slug} href={ROUTES.labDetail(lab.slug)}>
                <Card className="transition-colors hover:border-accent hover:bg-surface-2">
                  <Badge
                    variant={
                      lab.difficulty === "beginner"
                        ? "success"
                        : lab.difficulty === "intermediate"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {lab.difficulty}
                  </Badge>
                  <h3 className="my-2 text-base font-semibold">{lab.title}</h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {lab.duration}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-10 text-2xl sm:text-3xl">Learning roadmap</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {ROADMAP.map((item) => (
            <Card key={item.num}>
              <div className="mb-2 font-mono text-xs text-accent">
                {item.num}
              </div>
              <strong>{item.title}</strong>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
        <div className="hidden gap-4 overflow-x-auto pb-4 lg:flex">
          {ROADMAP.map((item) => (
            <Card key={item.num} className="min-w-[200px] shrink-0">
              <div className="mb-2 font-mono text-xs text-accent">
                {item.num}
              </div>
              <strong>{item.title}</strong>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10">
            <h2 className="mb-3 text-2xl sm:text-3xl">Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Free tier covers all MVP labs. Pro for interview tracks and saved
              experiments.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {["Free", "Pro", "Team"].map((tier, i) => (
              <Card
                key={tier}
                className={i === 1 ? "border-accent" : undefined}
              >
                <h3 className="text-lg font-semibold">{tier}</h3>
                <div className="my-4 text-4xl font-semibold">
                  {i === 0 ? "$0" : i === 1 ? "$12" : "$29"}
                  <span className="text-base font-normal text-muted-foreground">
                    /mo
                  </span>
                </div>
                <Button
                  variant={i === 1 ? "default" : "secondary"}
                  className="w-full"
                  asChild
                >
                  <Link href={ROUTES.dashboard}>
                    {i === 0 ? "Start free" : "Get started"}
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-border px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-12">
        <span>© 2026 Database Playground</span>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <Link href="#">Docs</Link>
          <Link href="#">GitHub</Link>
          <Link href="#">Discord</Link>
        </div>
      </footer>
    </>
  );
}
