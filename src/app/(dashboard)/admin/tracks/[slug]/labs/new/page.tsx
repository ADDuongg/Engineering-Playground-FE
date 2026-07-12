import { AdminCreateLabPage } from "@/features/track-lab-admin-crud/components/admin-create-lab-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <AdminCreateLabPage trackSlug={slug} />;
}
