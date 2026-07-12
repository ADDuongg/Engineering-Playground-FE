"use client";

import Link from "next/link";
import { toast } from "sonner";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { CurriculumForm } from "@/features/lab-flow-admin/components/curriculum-form";
import { GuidedStepsEditor } from "@/features/lab-flow-admin/components/guided-steps-editor";
import { useAdminLabCurriculum } from "@/features/lab-flow-admin/hooks/use-admin-lab-curriculum";
import {
  useCreateLabCurriculum,
  useUpdateLabCurriculum,
} from "@/features/lab-flow-admin/hooks/use-curriculum-mutations";
import type { CurriculumFormValues } from "@/features/lab-flow-admin/schemas/lab-flow-admin-schema";
import {
  formatLabFlowAdminErrorMessage,
  isNotFoundError,
} from "@/features/lab-flow-admin/utils/format-lab-flow-admin-error";
import {
  curriculumFormToCreateRequest,
  curriculumFormToUpdateRequest,
} from "@/features/lab-flow-admin/utils/map-curriculum-form";
import { useAdminLab } from "@/features/track-lab-admin-crud/hooks/use-admin-lab";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants/routes";

interface AdminLabFlowPageProps {
  labSlug: string;
}

export function AdminLabFlowPage({ labSlug }: AdminLabFlowPageProps) {
  const labQuery = useAdminLab(labSlug);
  const curriculumQuery = useAdminLabCurriculum(labSlug);
  const createCurriculum = useCreateLabCurriculum(labSlug);
  const updateCurriculum = useUpdateLabCurriculum(labSlug);

  const curriculumMissing =
    Boolean(curriculumQuery.error) && isNotFoundError(curriculumQuery.error);
  const curriculum = curriculumQuery.data;

  const handleCreate = async (values: CurriculumFormValues) => {
    try {
      await createCurriculum.mutateAsync(curriculumFormToCreateRequest(values));
      toast.success("Curriculum created");
    } catch (error) {
      toast.error(
        error instanceof Error &&
          (error.message.includes("JSON") || error.message.includes("tier"))
          ? error.message
          : formatLabFlowAdminErrorMessage(error),
      );
    }
  };

  const handleUpdate = async (values: CurriculumFormValues) => {
    try {
      await updateCurriculum.mutateAsync(curriculumFormToUpdateRequest(values));
      toast.success("Curriculum updated");
    } catch (error) {
      toast.error(
        error instanceof Error &&
          (error.message.includes("JSON") || error.message.includes("tier"))
          ? error.message
          : formatLabFlowAdminErrorMessage(error),
      );
    }
  };

  const lab = labQuery.data;

  return (
    <>
      <AuthAppTopbar
        title={lab ? `${lab.title} · Flow` : "Lab flow"}
        badge="Admin"
      />
      <main className="mx-auto max-w-4xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.adminLabDetail(labSlug)}>Back to lab</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.adminLabQuiz(labSlug)}>Edit quiz</Link>
          </Button>
          {lab ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={ROUTES.adminTrackDetail(lab.trackSlug)}>
                Back to track
              </Link>
            </Button>
          ) : null}
        </div>

        {labQuery.isLoading ? <Skeleton className="mb-6 h-16 w-full" /> : null}

        {labQuery.error ? (
          <EmptyState
            title="Lab not found"
            description={formatLabFlowAdminErrorMessage(labQuery.error)}
            className="py-12"
          />
        ) : null}

        {lab ? (
          <>
            <section className="mb-10">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Curriculum</h2>
                <p className="text-sm text-muted-foreground">
                  Powers learner <code className="text-xs">GET /labs/:slug/summary</code>.
                </p>
              </div>

              {curriculumQuery.isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : null}

              {curriculumQuery.error && !curriculumMissing ? (
                <EmptyState
                  title="Could not load curriculum"
                  description={formatLabFlowAdminErrorMessage(
                    curriculumQuery.error,
                  )}
                  className="py-10"
                />
              ) : null}

              {curriculumMissing ? (
                <Card className="p-5">
                  <p className="mb-4 text-sm text-muted-foreground">
                    No curriculum yet. Create one to enable the learner summary.
                  </p>
                  <CurriculumForm
                    onSubmit={handleCreate}
                    isSubmitting={createCurriculum.isPending}
                    submitLabel="Create curriculum"
                  />
                </Card>
              ) : null}

              {curriculum ? (
                <Card className="p-5">
                  <CurriculumForm
                    key={`${curriculum.labSlug}-${curriculum.updatedAt}`}
                    curriculum={curriculum}
                    onSubmit={handleUpdate}
                    isSubmitting={updateCurriculum.isPending}
                    submitLabel="Save curriculum"
                  />
                </Card>
              ) : null}
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Guided steps</h2>
              </div>
              <GuidedStepsEditor labSlug={labSlug} />
            </section>
          </>
        ) : null}
      </main>
    </>
  );
}
