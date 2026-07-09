"use client";

import Link from "next/link";
import { useState } from "react";
import { LABS_CATALOG } from "@/shared/constants/labs-catalog";
import { ROUTES } from "@/shared/constants/routes";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";

const CATEGORIES = ["All", "Indexes", "Transactions", "Caching", "Performance"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function difficultyVariant(d: string) {
  if (d === "beginner") return "success" as const;
  if (d === "intermediate") return "warning" as const;
  return "danger" as const;
}

export function LabsPage() {
  const [search, setSearch] = useState("");

  const filtered = LABS_CATALOG.filter(
    (lab) =>
      lab.title.toLowerCase().includes(search.toLowerCase()) ||
      lab.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <AuthAppTopbar
        title="Lab browser"
        actions={
          <Input
            placeholder="Search labs…"
            className="w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4 sm:hidden">
          <Input
            placeholder="Search labs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {CATEGORIES.map((cat, i) => (
            <Button key={cat} variant={i === 0 ? "secondary" : "ghost"} size="sm">
              {cat}
            </Button>
          ))}
          <div className="flex w-full flex-wrap gap-2 sm:ms-auto sm:w-auto">
            {DIFFICULTIES.map((d) => (
              <Button key={d} variant="ghost" size="sm">
                {d}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lab) => (
            <Link key={lab.slug} href={ROUTES.labDetail(lab.slug)}>
              <Card className="flex h-full flex-col transition-colors hover:border-accent hover:bg-surface-2">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <Badge variant={difficultyVariant(lab.difficulty)}>
                    {lab.difficulty}
                  </Badge>
                  <Badge variant="muted">{lab.category}</Badge>
                </div>
                <h3 className="mb-2 truncate text-lg font-semibold">{lab.title}</h3>
                <p className="flex-1 text-sm text-muted-foreground">
                  {lab.description}
                </p>
                {lab.progress !== undefined && (
                  <div className="mt-3">
                    <Progress value={lab.progress} />
                  </div>
                )}
                <div className="mt-4 flex gap-3 font-mono text-xs text-muted-foreground">
                  <span>{lab.duration}</span>
                  {lab.status && (
                    <span
                      className={cn(
                        lab.status === "completed" && "text-success",
                      )}
                    >
                      {lab.status === "in-progress"
                        ? "In progress"
                        : lab.status === "completed"
                          ? "Completed ✓"
                          : "Not started"}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
