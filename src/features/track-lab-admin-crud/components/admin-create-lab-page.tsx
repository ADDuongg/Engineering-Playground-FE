"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { CreateLabForm } from "@/features/track-lab-admin-crud/components/lab-form";
import { useCreateLab } from "@/features/track-lab-admin-crud/hooks/use-create-lab";
import type { CreateLabFormValues } from "@/features/track-lab-admin-crud/schemas/track-lab-admin-schema";
import { formatAdminCrudErrorMessage } from "@/features/track-lab-admin-crud/utils/format-admin-crud-error";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";

interface AdminCreateLabPageProps {
  trackSlug: string;
}

export function AdminCreateLabPage({ trackSlug }: AdminCreateLabPageProps) {
  const router = useRouter();
  const createLab = useCreateLab();

  const handleSubmit = async (values: CreateLabFormValues) => {
    try {
      const lab = await createLab.mutateAsync({
        trackSlug,
        data: {
          ...values,
          description: values.description?.trim() ? values.description : null,
        },
      });
      toast.success("Lab created");
      router.push(ROUTES.adminLabDetail(lab.slug));
    } catch (error) {
      toast.error(formatAdminCrudErrorMessage(error));
    }
  };

  return (
    <>
      <AuthAppTopbar title="New lab" badge="Admin" />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4">
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.adminTrackDetail(trackSlug)}>Cancel</Link>
          </Button>
        </div>
        <Card className="p-5">
          <CreateLabForm
            trackSlug={trackSlug}
            onSubmit={handleSubmit}
            isSubmitting={createLab.isPending}
          />
        </Card>
      </main>
    </>
  );
}
