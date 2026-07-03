import { LabDetailPage } from "@/features/labs/components/lab-detail-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <LabDetailPage slug={slug} />;
}
