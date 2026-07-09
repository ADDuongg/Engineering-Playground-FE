import { Suspense } from "react";
import { QuizPage } from "@/features/quiz/components/quiz-page";
import { Skeleton } from "@/shared/components/ui/skeleton";

function QuizPageFallback() {
  return (
    <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
      <Skeleton className="mb-8 h-2 w-full" />
      <Skeleton className="h-48 w-full" />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<QuizPageFallback />}>
      <QuizPage />
    </Suspense>
  );
}
