"use client";

import { ROUTES } from "@/shared/constants/routes";
import { TracksGrid } from "@/features/tracks/components/tracks-grid";

export function LandingTracksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h2 className="mb-3 text-2xl sm:text-3xl">Learning tracks</h2>
        <p className="max-w-lg text-lg text-muted-foreground">
          Structured paths from SQL fundamentals to caching, concurrency, and
          beyond. Start with an active track or preview what&apos;s coming next.
        </p>
      </div>
      <TracksGrid
        columns="4"
        getTrackHref={(track) =>
          track.status === "active" ? ROUTES.learning : undefined
        }
      />
    </section>
  );
}
