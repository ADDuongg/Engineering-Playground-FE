import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";

const BOOKMARKS = [
  {
    title: "Index scan on email",
    query: "SELECT * FROM users WHERE email = '…'",
    lab: "Index Playground",
    slug: "index-playground",
  },
  {
    title: "OFFSET deep page",
    query: "SELECT * FROM orders LIMIT 20 OFFSET 100000",
    lab: "OFFSET Pagination",
    slug: "offset-pagination",
  },
];

export function BookmarksPage() {
  return (
    <>
      <AppTopbar title="Bookmarks" />
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        {BOOKMARKS.length === 0 ? (
          <p className="text-muted-foreground">No bookmarks yet.</p>
        ) : (
          <div className="space-y-3">
            {BOOKMARKS.map((b) => (
              <Link key={b.title} href={ROUTES.labWorkspace(b.slug)}>
                <Card className="transition-colors hover:border-accent">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="min-w-0 truncate font-semibold">{b.title}</h3>
                    <Badge variant="muted" className="w-fit shrink-0">{b.lab}</Badge>
                  </div>
                  <pre className="overflow-x-auto rounded-md bg-editor-bg p-3 font-mono text-xs">
                    {b.query}
                  </pre>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
