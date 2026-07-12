import { AdminLabQuizPage } from "@/features/quiz-admin-crud/components/admin-lab-quiz-page";

interface PageProps {
  params: Promise<{ labSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { labSlug } = await params;
  return <AdminLabQuizPage labSlug={labSlug} />;
}
