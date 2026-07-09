import { notFound } from "next/navigation";
import "@/features/labs/register-all";
import { getLab } from "@/features/lab-engine/constants/lab-registry";
import { LabWorkspaceClient } from "./lab-workspace-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();
  return <LabWorkspaceClient lab={lab} />;
}
