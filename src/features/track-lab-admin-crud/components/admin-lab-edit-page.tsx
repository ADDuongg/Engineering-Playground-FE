"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { UpdateLabForm } from "@/features/track-lab-admin-crud/components/lab-form";
import { useAdminLab } from "@/features/track-lab-admin-crud/hooks/use-admin-lab";
import { useUpdateLab } from "@/features/track-lab-admin-crud/hooks/use-update-lab";
import type { UpdateLabFormValues } from "@/features/track-lab-admin-crud/schemas/track-lab-admin-schema";
import { formatAdminCrudErrorMessage } from "@/features/track-lab-admin-crud/utils/format-admin-crud-error";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/constants/routes";

interface AdminLabEditPageProps {
  labSlug: string;
}

export function AdminLabEditPage({ labSlug }: AdminLabEditPageProps) {
  const router = useRouter();
  const labQuery = useAdminLab(labSlug);
  const updateLab = useUpdateLab();

  const handleSubmit = async (values: UpdateLabFormValues) => {
    try {
      const lab = await updateLab.mutateAsync({
        labSlug,
        data: {
          ...values,
          description: values.description?.trim() ? values.description : null,
        },
      });
      toast.success("Lab updated");
      router.push(ROUTES.adminTrackDetail(lab.trackSlug));
    } catch (error) {
      toast.error(formatAdminCrudErrorMessage(error));
    }
  };

  const lab = labQuery.data;

  return (
    <>
      <AuthAppTopbar title={lab?.title ?? "Edit lab"} badge="Admin" />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        {lab ? (
          <div className="mb-4 flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href={ROUTES.adminTrackDetail(lab.trackSlug)}>
                Back to track
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={ROUTES.adminLabFlow(labSlug)}>Edit flow</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href={ROUTES.adminLabQuiz(labSlug)}>Edit quiz</Link>
            </Button>
          </div>
        ) : null}

        {labQuery.isLoading ? <Skeleton className="h-64 w-full" /> : null}

        {labQuery.error ? (
          <EmptyState
            title="Lab not found"
            description={formatAdminCrudErrorMessage(labQuery.error)}
            className="py-12"
          />
        ) : null}

        {lab ? (
          <Card className="p-5">
            <UpdateLabForm
              lab={lab}
              onSubmit={handleSubmit}
              isSubmitting={updateLab.isPending}
              onCancel={() => router.push(ROUTES.adminTrackDetail(lab.trackSlug))}
            />
          </Card>
        ) : null}
      </main>
    </>
  );
}
