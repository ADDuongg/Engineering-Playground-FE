"use client";

import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import type { TrackSummary } from "@/features/tracks/types/track";

interface TrackCardProps {
  track: TrackSummary;
  selected?: boolean;
  onSelect?: () => void;
  href?: string;
  className?: string;
}

function trackStatusVariant(status: TrackSummary["status"]) {
  return status === "active" ? "success" : "muted";
}

function trackStatusLabel(status: TrackSummary["status"]) {
  return status === "active" ? "Available" : "Coming soon";
}

export function TrackCard({
  track,
  selected,
  onSelect,
  href,
  className,
}: TrackCardProps) {
  const isInteractive = Boolean(onSelect || (href && track.status === "active"));
  const cardClassName = cn(
    "flex h-full flex-col transition-colors",
    isInteractive && "hover:border-accent hover:bg-surface-2",
    selected && "border-accent bg-surface-2",
    track.status === "coming-soon" && "opacity-80",
    className,
  );

  const content = (
    <>
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          {String(track.displayOrder).padStart(2, "0")}
        </span>
        <Badge variant={trackStatusVariant(track.status)}>
          {trackStatusLabel(track.status)}
        </Badge>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{track.name}</h3>
      <p className="flex-1 text-sm text-muted-foreground">{track.description}</p>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="block h-full w-full text-left"
        aria-pressed={selected}
      >
        <Card className={cardClassName}>{content}</Card>
      </button>
    );
  }

  if (href && track.status === "active") {
    return (
      <Link href={href} className="block h-full">
        <Card className={cardClassName}>{content}</Card>
      </Link>
    );
  }

  return <Card className={cardClassName}>{content}</Card>;
}
