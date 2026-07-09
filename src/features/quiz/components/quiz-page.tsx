"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthAppTopbar } from "@/features/auth/components/auth-app-topbar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { QuizRunner } from "@/features/quiz-engine/components/quiz-runner";
import { getLabCatalogItem } from "@/shared/constants/labs-catalog";
import { ROUTES } from "@/shared/constants/routes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

const DEFAULT_QUIZ_LAB_SLUG = "index-playground";

export function QuizPage() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isHydrated } = useAuth();

  const labSlug = searchParams.get("lab")?.trim() || DEFAULT_QUIZ_LAB_SLUG;
  const lab = getLabCatalogItem(labSlug);
  const badgeLabel = lab?.title ?? labSlug;

  return (
    <>
      <AuthAppTopbar title="Lab Quiz" badge={badgeLabel} />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        <Badge variant="accent" className="mb-4 sm:hidden">
          {badgeLabel}
        </Badge>

        {!isHydrated ? (
          <div className="space-y-4">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : !isAuthenticated ? (
          <div className="rounded-md border border-border bg-surface p-8 text-center">
            <h2 className="text-xl font-semibold">Sign in to take this quiz</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quizzes require an account so we can grade attempts and update your
              lab progress.
            </p>
            <Button className="mt-6" asChild>
              <Link href={ROUTES.login}>Sign in</Link>
            </Button>
          </div>
        ) : (
          <QuizRunner labSlug={labSlug} />
        )}
      </main>
    </>
  );
}
