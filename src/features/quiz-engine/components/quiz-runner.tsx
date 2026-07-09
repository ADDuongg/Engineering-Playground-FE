"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  QuizBestResultBanner,
  QuizResultCard,
} from "@/features/quiz-engine/components/quiz-result-card";
import { useQuizDefinition } from "@/features/quiz-engine/hooks/use-quiz-definition";
import { useQuizResult } from "@/features/quiz-engine/hooks/use-quiz-result";
import { useSubmitQuiz } from "@/features/quiz-engine/hooks/use-submit-quiz";
import type { SubmitQuizResult } from "@/features/quiz-engine/types/quiz";
import { formatQuizErrorMessage } from "@/features/quiz-engine/utils/format-quiz-error";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface QuizRunnerProps {
  labSlug: string;
}

export function QuizRunner({ labSlug }: QuizRunnerProps) {
  const definitionQuery = useQuizDefinition(labSlug);
  const resultQuery = useQuizResult(labSlug);
  const submitMutation = useSubmitQuiz(labSlug);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitResult, setSubmitResult] = useState<SubmitQuizResult | null>(
    null,
  );

  const definition = definitionQuery.data;
  const questions = definition?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const progressValue =
    questions.length === 0
      ? 0
      : submitResult
        ? 100
        : ((currentIndex + (selectedOptionId ? 0.5 : 0)) / questions.length) *
          100;

  const resetAttempt = () => {
    setSubmitResult(null);
    setCurrentIndex(0);
    setAnswers({});
    submitMutation.reset();
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion || submitResult) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNextOrFinish = () => {
    if (!definition || !currentQuestion || !selectedOptionId) {
      return;
    }

    const isLast = currentIndex >= questions.length - 1;

    if (!isLast) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const mergedAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOptionId,
    };

    const payloadAnswers = questions.map((question) => ({
      questionId: question.id,
      optionId: mergedAnswers[question.id] ?? "",
    }));

    if (payloadAnswers.some((answer) => !answer.optionId)) {
      toast.error("Answer every question before finishing.");
      return;
    }

    submitMutation.mutate({ answers: payloadAnswers }, {
      onSuccess: (result) => {
        setSubmitResult(result);
        if (result.passed) {
          toast.success(
            result.alreadyLabCompleted
              ? "Quiz passed. Lab was already complete."
              : "Quiz passed. Lab marked complete.",
          );
        } else {
          toast.message("Quiz submitted — keep practicing and retry.");
        }
      },
      onError: (error) => {
        toast.error(formatQuizErrorMessage(error));
      },
    });
  };

  if (definitionQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (definitionQuery.error || !definition) {
    return (
      <EmptyState
        title="Quiz unavailable"
        description={formatQuizErrorMessage(
          definitionQuery.error ?? new Error("Quiz could not be loaded."),
        )}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        title="Empty quiz"
        description="This lab quiz has no questions yet."
      />
    );
  }

  if (submitResult) {
    return (
      <QuizResultCard
        definition={definition}
        result={submitResult}
        onRetry={resetAttempt}
      />
    );
  }

  return (
    <>
      {resultQuery.data && (
        <QuizBestResultBanner
          status={resultQuery.data.status}
          attemptCount={resultQuery.data.attemptCount}
          percentCorrect={resultQuery.data.percentCorrect}
        />
      )}
      <Progress value={progressValue} className="mb-8" />
      <Card>
        <Badge variant="muted" className="mb-4">
          Question {currentIndex + 1} of {questions.length}
        </Badge>
        <h2 className="mb-6 text-xl font-semibold">{currentQuestion.prompt}</h2>
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option.id)}
              className={cn(
                "w-full rounded-md border border-border p-4 text-left text-sm transition-colors hover:bg-surface-2",
                selectedOptionId === option.id && "border-accent bg-accent/10",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Button
          className="mt-6 w-full"
          onClick={handleNextOrFinish}
          disabled={!selectedOptionId || submitMutation.isPending}
        >
          {submitMutation.isPending
            ? "Submitting…"
            : currentIndex < questions.length - 1
              ? "Next question"
              : "Finish quiz"}
        </Button>
      </Card>
    </>
  );
}
