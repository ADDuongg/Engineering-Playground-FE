import { AdminTrackDetailPage } from "@/features/track-lab-admin-crud/components/admin-track-detail-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <AdminTrackDetailPage slug={slug} />;
}
