"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { CreateTrackForm } from "@/features/track-lab-admin-crud/components/track-form";
import { useCreateTrack } from "@/features/track-lab-admin-crud/hooks/use-create-track";
import type { CreateTrackFormValues } from "@/features/track-lab-admin-crud/schemas/track-lab-admin-schema";
import { formatAdminCrudErrorMessage } from "@/features/track-lab-admin-crud/utils/format-admin-crud-error";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";

export function AdminCreateTrackPage() {
  const router = useRouter();
  const createTrack = useCreateTrack();

  const handleSubmit = async (values: CreateTrackFormValues) => {
    try {
      const track = await createTrack.mutateAsync(values);
      toast.success("Track created");
      router.push(ROUTES.adminTrackDetail(track.slug));
    } catch (error) {
      toast.error(formatAdminCrudErrorMessage(error));
    }
  };

  return (
    <>
      <AuthAppTopbar title="New track" badge="Admin" />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4">
          <Button asChild variant="secondary" size="sm">
            <Link href={ROUTES.adminTracks}>Cancel</Link>
          </Button>
        </div>
        <Card className="p-5">
          <CreateTrackForm
            onSubmit={handleSubmit}
            isSubmitting={createTrack.isPending}
          />
        </Card>
      </main>
    </>
  );
}
