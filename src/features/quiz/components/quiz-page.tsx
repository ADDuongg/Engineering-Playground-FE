"use client";

import { useState } from "react";
import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";

const QUESTIONS = [
  {
    id: 1,
    question:
      "Why is a B-tree index faster than a sequential scan for point lookups?",
    options: [
      "It stores data in sorted order enabling O(log n) lookups",
      "It uses less disk space",
      "It caches all rows in memory",
      "It skips the WHERE clause",
    ],
    correct: 0,
  },
  {
    id: 2,
    question: "When might PostgreSQL still choose a sequential scan?",
    options: [
      "When the table is very small",
      "When low selectivity makes index lookup more expensive",
      "Both A and B",
      "Never — indexes are always faster",
    ],
    correct: 2,
  },
  {
    id: 3,
    question: "What does EXPLAIN ANALYZE add over EXPLAIN alone?",
    options: [
      "Actual execution statistics",
      "Query rewriting suggestions",
      "Automatic index creation",
      "Connection pooling",
    ],
    correct: 0,
  },
];

export function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];
  const progress = ((current + (finished ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleSubmit = () => {
    if (selected === null) return;
    if (selected === q.correct) setScore((s) => s + 1);
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  return (
    <>
      <AppTopbar title="Lab Quiz" badge="Index Playground" />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        <Badge variant="accent" className="mb-4 sm:hidden">
          Index Playground
        </Badge>
        <Progress value={progress} className="mb-8" />
        {finished ? (
          <Card className="text-center">
            <h2 className="text-2xl font-semibold">Quiz complete!</h2>
            <p className="mt-4 font-mono-tabular text-4xl text-accent">
              {Math.round((score / QUESTIONS.length) * 100)}%
            </p>
            <p className="mt-2 text-muted-foreground">
              {score} of {QUESTIONS.length} correct
            </p>
            <Button className="mt-6">Next lab →</Button>
          </Card>
        ) : (
          <Card>
            <Badge variant="muted" className="mb-4">
              Question {current + 1} of {QUESTIONS.length}
            </Badge>
            <h2 className="mb-6 text-xl font-semibold">{q.question}</h2>
            <div className="space-y-2">
              {q.options.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "w-full rounded-md border border-border p-4 text-left text-sm transition-colors hover:bg-surface-2",
                    selected === i && "border-accent bg-accent/10",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button
              className="mt-6 w-full"
              onClick={handleSubmit}
              disabled={selected === null}
            >
              {current < QUESTIONS.length - 1 ? "Next question" : "Finish quiz"}
            </Button>
          </Card>
        )}
      </main>
    </>
  );
}
