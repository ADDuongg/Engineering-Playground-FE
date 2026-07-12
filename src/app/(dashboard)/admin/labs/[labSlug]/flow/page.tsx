import { AdminLabFlowPage } from "@/features/lab-flow-admin/components/admin-lab-flow-page";

interface PageProps {
  params: Promise<{ labSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { labSlug } = await params;
  return <AdminLabFlowPage labSlug={labSlug} />;
}
