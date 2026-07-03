"use client";

import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useSidebarStore } from "@/shared/lib/stores/sidebar-store";

interface AppTopbarProps {
  title: string;
  badge?: string;
  actions?: React.ReactNode;
}

export function AppTopbar({ title, badge, actions }: AppTopbarProps) {
  const toggleMobile = useSidebarStore((s) => s.toggleMobile);

  return (
    <header className="flex h-[var(--topbar-height)] shrink-0 items-center gap-2 border-b border-border bg-surface px-4 md:gap-3 md:px-5">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={toggleMobile}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="min-w-0 flex-1 truncate text-base font-semibold md:flex-none md:text-lg">
        {title}
      </h1>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {actions && (
          <div className="hidden min-w-0 sm:flex sm:items-center">{actions}</div>
        )}
        {badge && (
          <Badge variant="accent" className="hidden sm:inline-flex">
            {badge}
          </Badge>
        )}
        <Avatar className="h-8 w-8">
          <AvatarFallback>DV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
