"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { AdminFormField } from "@/features/quiz-admin-crud/components/form-field";
import { QuestionsEditor } from "@/features/quiz-admin-crud/components/questions-editor";
import { useAdminLabQuiz } from "@/features/quiz-admin-crud/hooks/use-admin-lab-quiz";
import {
  useCreateLabQuiz,
  useDeleteLabQuiz,
  useUpdateLabQuiz,
} from "@/features/quiz-admin-crud/hooks/use-quiz-admin-mutations";
import {
  quizShellFormSchema,
  type QuizShellFormValues,
} from "@/features/quiz-admin-crud/schemas/quiz-admin-schema";
import {
  formatQuizAdminErrorMessage,
  isNotFoundError,
} from "@/features/quiz-admin-crud/utils/format-quiz-admin-error";
import { useAdminLab } from "@/features/track-lab-admin-crud/hooks/use-admin-lab";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants/routes";

interface AdminLabQuizPageProps {
  labSlug: string;
}

function QuizShellForm({
  defaultTitle,
  submitLabel,
  isSubmitting,
  onSubmit,
}: {
  defaultTitle?: string | null;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: QuizShellFormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizShellFormValues>({
    resolver: zodResolver(quizShellFormSchema),
    defaultValues: { title: defaultTitle ?? "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField
        label="Quiz title"
        htmlFor="title"
        error={errors.title?.message}
        hint="Optional. Leave empty for no title."
      >
        <Input id="title" {...register("title")} />
      </AdminFormField>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

export function AdminLabQuizPage({ labSlug }: AdminLabQuizPageProps) {
  const labQuery = useAdminLab(labSlug);
  const quizQuery = useAdminLabQuiz(labSlug);
  const createQuiz = useCreateLabQuiz(labSlug);
  const updateQuiz = useUpdateLabQuiz(labSlug);
  const deleteQuiz = useDeleteLabQuiz(labSlug);

  const quizMissing =
    Boolean(quizQuery.error) && isNotFoundError(quizQuery.error);
  const quiz = quizQuery.data;
  const lab = labQuery.data;

  const handleCreate = async (values: QuizShellFormValues) => {
    try {
      await createQuiz.mutateAsync({
        title: values.title?.trim() ? values.title.trim() : null,
      });
      toast.success("Quiz created — lab is now quiz-gated");
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const handleUpdate = async (values: QuizShellFormValues) => {
    try {
      await updateQuiz.mutateAsync({
        title: values.title?.trim() ? values.title.trim() : null,
      });
      toast.success("Quiz updated");
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this quiz? Questions, options, and attempts will be removed. The lab will no longer be quiz-gated.",
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteQuiz.mutateAsync();
      toast.success("Quiz deleted");
    } catch (error) {
      toast.error(formatQuizAdminErrorMessage(error));
    }
  };

  return (
    <>
      <AuthAppTopbar
        title={lab ? `${lab.title} · Quiz` : "Lab quiz"}
        badge="Admin"
      />
      <main className="mx-auto max-w-4xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.adminLabDetail(labSlug)}>Back to lab</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.adminLabFlow(labSlug)}>Edit flow</Link>
          </Button>
          {lab ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={ROUTES.adminTrackDetail(lab.trackSlug)}>
                Back to track
              </Link>
            </Button>
          ) : null}
        </div>

        {labQuery.isLoading || quizQuery.isLoading ? (
          <Skeleton className="mb-6 h-40 w-full" />
        ) : null}

        {labQuery.error ? (
          <EmptyState
            title="Lab not found"
            description={formatQuizAdminErrorMessage(labQuery.error)}
            className="py-12"
          />
        ) : null}

        {quizQuery.error && !quizMissing ? (
          <EmptyState
            title="Could not load quiz"
            description={formatQuizAdminErrorMessage(quizQuery.error)}
            className="py-12"
          />
        ) : null}

        {lab && quizMissing ? (
          <Card className="p-5">
            <h2 className="mb-2 text-lg font-semibold">Create quiz</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Creating a quiz makes this lab quiz-gated for progress completion.
            </p>
            <QuizShellForm
              submitLabel="Create quiz"
              isSubmitting={createQuiz.isPending}
              onSubmit={handleCreate}
            />
          </Card>
        ) : null}

        {lab && quiz ? (
          <div className="space-y-8">
            <Card className="p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Quiz shell</h2>
                  <p className="text-sm text-muted-foreground">
                    Updated {new Date(quiz.updatedAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={deleteQuiz.isPending}
                  onClick={() => void handleDelete()}
                >
                  Delete quiz
                </Button>
              </div>
              <QuizShellForm
                key={`${quiz.id}-${quiz.updatedAt}`}
                defaultTitle={quiz.title}
                submitLabel="Save title"
                isSubmitting={updateQuiz.isPending}
                onSubmit={handleUpdate}
              />
            </Card>

            <section>
              <h2 className="mb-4 text-lg font-semibold">Questions</h2>
              <QuestionsEditor labSlug={labSlug} quiz={quiz} />
            </section>
          </div>
        ) : null}
      </main>
    </>
  );
}
