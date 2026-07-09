"use client";

import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useCompleteLab } from "@/features/progress-tracking/hooks/use-complete-lab";
import { useTrackProgress } from "@/features/progress-tracking/hooks/use-track-progress";
import { formatProgressErrorMessage } from "@/features/progress-tracking/utils/format-progress-error";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

interface CompleteLabButtonProps {
  labSlug: string;
  /** When known, used to check completed state before complete returns trackSlug. */
  trackSlug?: string;
  className?: string;
}

export function CompleteLabButton({
  labSlug,
  trackSlug,
  className,
}: CompleteLabButtonProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const completeMutation = useCompleteLab();
  const progressQuery = useTrackProgress(trackSlug, {
    enabled: Boolean(trackSlug),
  });

  const alreadyCompleted =
    Boolean(completeMutation.data) ||
    progressQuery.data?.completedLabSlugs.includes(labSlug) ||
    progressQuery.data?.labs.some(
      (lab) => lab.slug === labSlug && lab.completed,
    );

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Button variant="secondary" size="lg" asChild className={className}>
        <Link href={ROUTES.login}>Sign in to track progress</Link>
      </Button>
    );
  }

  if (alreadyCompleted) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="lg"
        disabled
        className={className}
      >
        <CheckCircle2 className="h-4 w-4" />
        Completed
      </Button>
    );
  }

  const handleComplete = () => {
    completeMutation.mutate(labSlug, {
      onSuccess: (result) => {
        toast.success(
          result.alreadyCompleted
            ? "Lab was already marked complete."
            : "Lab marked complete.",
        );
      },
      onError: (error) => {
        toast.error(formatProgressErrorMessage(error));
      },
    });
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      onClick={handleComplete}
      disabled={completeMutation.isPending}
      className={className}
    >
      {completeMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : null}
      {completeMutation.isPending ? "Saving…" : "Mark complete"}
    </Button>
  );
}
