"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { CompleteLabButton } from "@/features/progress-tracking/components/complete-lab-button";
import { useLab } from "@/features/labs/hooks/use-lab";
import {
  formatLabsErrorMessage,
  isNotFoundError,
} from "@/features/labs/utils/format-labs-error";
import { ROUTES } from "@/shared/constants/routes";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface LabDetailPageProps {
  slug: string;
}

export function LabDetailPage({ slug }: LabDetailPageProps) {
  const labQuery = useLab(slug);

  if (labQuery.isLoading) {
    return (
      <>
        <AuthAppTopbar title="Lab" />
        <main className="mx-auto max-w-3xl flex-1 overflow-auto p-4 sm:p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <Skeleton className="mb-4 h-10 w-2/3" />
          <Skeleton className="mb-8 h-20 w-full" />
          <Skeleton className="mb-6 h-32 w-full" />
        </main>
      </>
    );
  }

  if (labQuery.error && isNotFoundError(labQuery.error)) {
    notFound();
  }

  if (labQuery.error || !labQuery.data) {
    return (
      <>
        <AuthAppTopbar title="Lab" />
        <main className="mx-auto max-w-3xl flex-1 overflow-auto p-4 sm:p-6">
          <EmptyState
            title="Could not load lab"
            description={formatLabsErrorMessage(labQuery.error)}
            action={
              <Button variant="secondary" asChild>
                <Link href={ROUTES.labs}>Back to labs</Link>
              </Button>
            }
            className="py-12"
          />
        </main>
      </>
    );
  }

  const lab = labQuery.data;
  const isComingSoon = lab.status === "coming-soon";

  return (
    <>
      <AuthAppTopbar title={lab.title} />
      <main className="mx-auto max-w-3xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant={isComingSoon ? "muted" : "success"}>
            {isComingSoon ? "coming soon" : "active"}
          </Badge>
          <Badge variant="muted">{lab.trackName}</Badge>
          <Badge variant="muted">#{lab.sequenceOrder}</Badge>
        </div>
        <h1 className="mb-4 text-2xl font-semibold sm:text-3xl">{lab.title}</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {lab.description?.trim() || "No description yet."}
        </p>

        <Card className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">What you&apos;ll learn</h2>
          <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
            <li>Run experiments on real datasets</li>
            <li>Visualize execution plans and metrics</li>
            <li>Compare before and after optimization</li>
            <li>Complete a quiz to reinforce concepts</li>
          </ul>
        </Card>

        <Card className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Learning flow</h2>
          <p className="text-sm text-muted-foreground">
            Objective → Theory → Experiment → Visualization → Metrics → Quiz →
            Next Challenge
          </p>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {isComingSoon ? (
            <Button size="lg" disabled className="w-full sm:w-auto">
              Coming soon
            </Button>
          ) : (
            <>
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href={ROUTES.labWorkspace(slug)}>Start lab</Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href={ROUTES.quiz(slug)}>Take quiz</Link>
              </Button>
              <CompleteLabButton
                labSlug={slug}
                trackSlug={lab.trackSlug}
                className="w-full sm:w-auto"
              />
            </>
          )}
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href={ROUTES.labs}>Back to labs</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
