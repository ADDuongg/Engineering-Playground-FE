import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs text-accent">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This lab or page doesn&apos;t exist. Check the URL or return to the
        dashboard.
      </p>
      <Button className="mt-6" asChild>
        <Link href={ROUTES.dashboard}>Back to dashboard</Link>
      </Button>
    </div>
  );
}
