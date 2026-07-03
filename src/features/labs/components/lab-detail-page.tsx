import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabCatalogItem } from "@/shared/constants/labs-catalog";
import { ROUTES } from "@/shared/constants/routes";
import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

interface LabDetailPageProps {
  slug: string;
}

function difficultyVariant(d: string) {
  if (d === "beginner") return "success" as const;
  if (d === "intermediate") return "warning" as const;
  return "danger" as const;
}

export function LabDetailPage({ slug }: LabDetailPageProps) {
  const lab = getLabCatalogItem(slug);
  if (!lab) notFound();

  return (
    <>
      <AppTopbar title={lab.title} />
      <main className="mx-auto max-w-3xl flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant={difficultyVariant(lab.difficulty)}>
            {lab.difficulty}
          </Badge>
          <Badge variant="muted">{lab.category}</Badge>
          <Badge variant="muted">{lab.duration}</Badge>
        </div>
        <h1 className="mb-4 text-2xl font-semibold sm:text-3xl">{lab.title}</h1>
        <p className="mb-8 text-lg text-muted-foreground">{lab.description}</p>

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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href={ROUTES.labWorkspace(slug)}>Start lab</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
            <Link href={ROUTES.labs}>Back to labs</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
