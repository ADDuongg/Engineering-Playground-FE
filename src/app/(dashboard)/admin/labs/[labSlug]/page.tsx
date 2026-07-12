import { AdminLabEditPage } from "@/features/track-lab-admin-crud/components/admin-lab-edit-page";

interface PageProps {
  params: Promise<{ labSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { labSlug } = await params;
  return <AdminLabEditPage labSlug={labSlug} />;
}
