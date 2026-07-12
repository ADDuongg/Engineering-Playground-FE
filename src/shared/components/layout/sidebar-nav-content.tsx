"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV, DASHBOARD_NAV } from "@/shared/constants/navigation";
import { cn } from "@/shared/lib/utils";

interface SidebarNavContentProps {
  onNavigate?: () => void;
  extraNav?: React.ReactNode;
}

export function SidebarNavContent({
  onNavigate,
  extraNav,
}: SidebarNavContentProps) {
  const pathname = usePathname();

  return (
    <>
      {DASHBOARD_NAV.map((section) => (
        <nav key={section.label} className="mb-5">
          <div className="mb-2 px-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {section.label}
          </div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                  isActive && "bg-accent/10 text-accent",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-70" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      ))}

      {extraNav}

      <div className="mt-auto">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                isActive && "bg-accent/10 text-accent",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-70" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
