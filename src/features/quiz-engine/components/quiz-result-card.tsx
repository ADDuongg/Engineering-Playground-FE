"use client";

import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import type {
  QuizDefinitionResponse,
  SubmitQuizResult,
} from "@/features/quiz-engine/types/quiz";
import { ROUTES } from "@/shared/constants/routes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

interface QuizResultCardProps {
  definition: QuizDefinitionResponse;
  result: SubmitQuizResult;
  onRetry: () => void;
}

export function QuizResultCard({
  definition,
  result,
  onRetry,
}: QuizResultCardProps) {
  const incorrectSet = new Set(result.incorrectQuestionIds);
  const incorrectQuestions = definition.questions.filter((q) =>
    incorrectSet.has(q.id),
  );

  return (
    <Card className="text-center">
      {result.passed ? (
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
      ) : (
        <XCircle className="mx-auto h-10 w-10 text-danger" />
      )}
      <h2 className="mt-4 text-2xl font-semibold">
        {result.passed ? "Quiz passed!" : "Not quite — try again"}
      </h2>
      <p className="mt-4 font-mono-tabular text-4xl text-accent">
        {result.percentCorrect}%
      </p>
      <p className="mt-2 text-muted-foreground">
        {result.correctCount} of {result.totalQuestions} correct
      </p>
      {result.passed && (
        <p className="mt-2 text-sm text-success">
          {result.alreadyLabCompleted
            ? "Lab was already marked complete."
            : result.labCompleted
              ? "Lab marked complete."
              : null}
        </p>
      )}

      {!result.passed && incorrectQuestions.length > 0 && (
        <div className="mt-6 space-y-2 text-left">
          <p className="text-sm font-medium text-muted-foreground">
            Review these questions:
          </p>
          {incorrectQuestions.map((question) => (
            <div
              key={question.id}
              className="rounded-md border border-border bg-surface-2 p-3 text-sm"
            >
              {question.prompt}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {!result.passed && (
          <Button type="button" onClick={onRetry}>
            Retry quiz
          </Button>
        )}
        {result.passed && (
          <Button asChild>
            <Link href={ROUTES.learning}>Back to learning path</Link>
          </Button>
        )}
        <Button variant="secondary" asChild>
          <Link href={ROUTES.labDetail(result.labSlug)}>Lab detail</Link>
        </Button>
      </div>
    </Card>
  );
}

interface QuizBestResultBannerProps {
  status: "not_attempted" | "failed" | "passed";
  attemptCount: number;
  percentCorrect?: number;
}

export function QuizBestResultBanner({
  status,
  attemptCount,
  percentCorrect,
}: QuizBestResultBannerProps) {
  if (status === "not_attempted") {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-3 text-sm">
      <Badge variant={status === "passed" ? "success" : "warning"}>
        {status === "passed" ? "Best: passed" : "Best: not passed yet"}
      </Badge>
      {percentCorrect !== undefined && (
        <span className="text-muted-foreground">{percentCorrect}%</span>
      )}
      <span className="text-muted-foreground">
        {attemptCount} attempt{attemptCount === 1 ? "" : "s"}
      </span>
    </div>
  );
}
