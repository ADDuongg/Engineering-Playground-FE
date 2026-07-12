"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { OptionForm } from "@/features/quiz-admin-crud/components/option-form";
import {
  CreateQuestionForm,
  UpdateQuestionForm,
} from "@/features/quiz-admin-crud/components/question-form";
import {
  useCreateQuizOption,
  useCreateQuizQuestion,
  useDeleteQuizOption,
  useDeleteQuizQuestion,
  useReorderQuizOptions,
  useReorderQuizQuestions,
  useUpdateQuizOption,
  useUpdateQuizQuestion,
} from "@/features/quiz-admin-crud/hooks/use-quiz-admin-mutations";
import type {
  CreateQuestionFormValues,
  OptionFormValues,
  UpdateQuestionFormValues,
} from "@/features/quiz-admin-crud/schemas/quiz-admin-schema";
import type {
  AdminQuizOptionView,
  AdminQuizQuestionView,
  AdminQuizView,
} from "@/features/quiz-admin-crud/types/quiz-admin-crud";
import { formatQuizAdminErrorMessage } from "@/features/quiz-admin-crud/utils/format-quiz-admin-error";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Modal } from "@/shared/components/ui/modal";

interface QuestionsEditorProps {
  labSlug: string;
  quiz: AdminQuizView;
}

type QuestionMode =
  | { type: "idle" }
  | { type: "create" }
  | { type: "edit"; question: AdminQuizQuestionView };

type OptionMode =
  | { type: "idle" }
  | { type: "create"; question: AdminQuizQuestionView }
  | {
      type: "edit";
      question: AdminQuizQuestionView;
      option: AdminQuizOptionView;
    };

export function QuestionsEditor({ labSlug, quiz }: QuestionsEditorProps) {
  const createQuestion = useCreateQuizQuestion(labSlug);
  const updateQuestion = useUpdateQuizQuestion(labSlug);
  const deleteQuestion = useDeleteQuizQuestion(labSlug);
  const reorderQuestions = useReorderQuizQuestions(labSlug);
  const createOption = useCreateQuizOption(labSlug);
  const updateOption = useUpdateQuizOption(labSlug);
  const deleteOption = useDeleteQuizOption(labSlug);
  const reorderOptions = useReorderQuizOptions(labSlug);

  const [questionMode, setQuestionMode] = useState<QuestionMode>({
    type: "idle",
  });
  const [optionMode, setOptionMode] = useState<OptionMode>({ type: "idle" });

  const questions = useMemo(() => {
    return [...quiz.questions].sort((a, b) => {
      if (a.sequenceOrder !== b.sequenceOrder) {
        return a.sequenceOrder - b.sequenceOrder;
      }
      return a.id.localeCompare(b.id);
    });
  }, [quiz.questions]);

  const closeQuestionModal = () => setQuestionMode({ type: "idle" });
  const closeOptionModal = () => setOptionMode({ type: "idle" });

  const handleCreateQuestion = async (values: CreateQuestionFormValues) => {
    try {
      await createQuestion.mutateAsync({
        prompt: values.prompt.trim(),
        sequenceOrder: values.sequenceOrder,
        questionType: "single_select",
        options: values.options.map((option, index) => ({
          label: option.label.trim(),
          sequenceOrder: index + 1,
          isCorrect: option.isCorrect,
        })),
      });
      toast.success("Question created");
      closeQuestionModal();
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const handleUpdateQuestion = async (values: UpdateQuestionFormValues) => {
    if (questionMode.type !== "edit") {
      return;
    }

    try {
      await updateQuestion.mutateAsync({
        questionId: questionMode.question.id,
        data: {
          prompt: values.prompt.trim(),
          sequenceOrder: values.sequenceOrder,
        },
      });
      toast.success("Question updated");
      closeQuestionModal();
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const handleDeleteQuestion = async (question: AdminQuizQuestionView) => {
    const confirmed = window.confirm(
      `Delete question "${question.prompt.slice(0, 60)}"?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteQuestion.mutateAsync(question.id);
      toast.success("Question deleted");
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const moveQuestion = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= questions.length) {
      return;
    }

    const reordered = [...questions];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);

    try {
      await reorderQuestions.mutateAsync({
        questionIds: reordered.map((question) => question.id),
      });
      toast.success("Questions reordered");
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const handleCreateOption = async (values: OptionFormValues) => {
    if (optionMode.type !== "create") {
      return;
    }

    try {
      await createOption.mutateAsync({
        questionId: optionMode.question.id,
        data: {
          label: values.label.trim(),
          sequenceOrder: values.sequenceOrder,
          isCorrect: values.isCorrect === "true",
        },
      });
      toast.success("Option created");
      closeOptionModal();
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const handleUpdateOption = async (values: OptionFormValues) => {
    if (optionMode.type !== "edit") {
      return;
    }

    try {
      await updateOption.mutateAsync({
        questionId: optionMode.question.id,
        optionId: optionMode.option.id,
        data: {
          label: values.label.trim(),
          sequenceOrder: values.sequenceOrder,
          isCorrect: values.isCorrect === "true",
        },
      });
      toast.success("Option updated");
      closeOptionModal();
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const handleDeleteOption = async (
    question: AdminQuizQuestionView,
    option: AdminQuizOptionView,
  ) => {
    const confirmed = window.confirm(`Delete option "${option.label}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteOption.mutateAsync({
        questionId: question.id,
        optionId: option.id,
      });
      toast.success("Option deleted");
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const moveOption = async (
    question: AdminQuizQuestionView,
    index: number,
    direction: -1 | 1,
  ) => {
    const options = [...question.options].sort(
      (a, b) => a.sequenceOrder - b.sequenceOrder || a.id.localeCompare(b.id),
    );
    const target = index + direction;
    if (target < 0 || target >= options.length) {
      return;
    }

    const reordered = [...options];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);

    try {
      await reorderOptions.mutateAsync({
        questionId: question.id,
        data: { optionIds: reordered.map((option) => option.id) },
      });
      toast.success("Options reordered");
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Learner quiz never exposes which option is correct.
        </p>
        <Button size="sm" onClick={() => setQuestionMode({ type: "create" })}>
          <Plus className="h-4 w-4" />
          Add question
        </Button>
      </div>

      {questions.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Create questions with at least two options and exactly one correct answer."
          action={
            <Button onClick={() => setQuestionMode({ type: "create" })}>
              Add question
            </Button>
          }
          className="py-10"
        />
      ) : null}

      {questions.map((question, index) => {
        const options = [...question.options].sort(
          (a, b) =>
            a.sequenceOrder - b.sequenceOrder || a.id.localeCompare(b.id),
        );

        return (
          <Card key={question.id} className="p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 font-mono text-xs text-muted-foreground">
                  #{question.sequenceOrder} · {question.questionType}
                </div>
                <div className="font-medium">{question.prompt}</div>
              </div>
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Move question up"
                  disabled={index === 0 || reorderQuestions.isPending}
                  onClick={() => void moveQuestion(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Move question down"
                  disabled={
                    index === questions.length - 1 || reorderQuestions.isPending
                  }
                  onClick={() => void moveQuestion(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Edit question"
                  onClick={() => setQuestionMode({ type: "edit", question })}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Delete question"
                  disabled={deleteQuestion.isPending}
                  onClick={() => void handleDeleteQuestion(question)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between gap-2">
              <h4 className="text-sm font-medium">Options</h4>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setOptionMode({ type: "create", question })}
              >
                <Plus className="h-3.5 w-3.5" />
                Add option
              </Button>
            </div>

            <div className="space-y-2">
              {options.map((option, optionIndex) => (
                <div
                  key={option.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border-subtle bg-surface-2 px-3 py-2"
                >
                  <div className="min-w-0 flex-1 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">
                      #{option.sequenceOrder}
                    </span>{" "}
                    {option.label}
                    {option.isCorrect ? (
                      <span className="ms-2 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                        Correct
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Move option up"
                      disabled={
                        optionIndex === 0 || reorderOptions.isPending
                      }
                      onClick={() =>
                        void moveOption(question, optionIndex, -1)
                      }
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Move option down"
                      disabled={
                        optionIndex === options.length - 1 ||
                        reorderOptions.isPending
                      }
                      onClick={() => void moveOption(question, optionIndex, 1)}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Edit option"
                      onClick={() =>
                        setOptionMode({ type: "edit", question, option })
                      }
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Delete option"
                      disabled={deleteOption.isPending}
                      onClick={() => void handleDeleteOption(question, option)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      <Modal
        open={questionMode.type === "create"}
        title="New question"
        onClose={closeQuestionModal}
      >
        <CreateQuestionForm
          nextSequenceOrder={questions.length + 1}
          onSubmit={handleCreateQuestion}
          onCancel={closeQuestionModal}
          isSubmitting={createQuestion.isPending}
        />
      </Modal>

      <Modal
        open={questionMode.type === "edit"}
        title="Edit question"
        onClose={closeQuestionModal}
      >
        {questionMode.type === "edit" ? (
          <UpdateQuestionForm
            key={questionMode.question.id}
            question={questionMode.question}
            onSubmit={handleUpdateQuestion}
            onCancel={closeQuestionModal}
            isSubmitting={updateQuestion.isPending}
          />
        ) : null}
      </Modal>

      <Modal
        open={optionMode.type === "create"}
        title="New option"
        onClose={closeOptionModal}
      >
        {optionMode.type === "create" ? (
          <OptionForm
            nextSequenceOrder={optionMode.question.options.length + 1}
            onSubmit={handleCreateOption}
            onCancel={closeOptionModal}
            isSubmitting={createOption.isPending}
            submitLabel="Create option"
          />
        ) : null}
      </Modal>

      <Modal
        open={optionMode.type === "edit"}
        title="Edit option"
        onClose={closeOptionModal}
      >
        {optionMode.type === "edit" ? (
          <OptionForm
            key={optionMode.option.id}
            option={optionMode.option}
            onSubmit={handleUpdateOption}
            onCancel={closeOptionModal}
            isSubmitting={updateOption.isPending}
            submitLabel="Save option"
          />
        ) : null}
      </Modal>
    </div>
  );
}
