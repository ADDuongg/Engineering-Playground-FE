"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Logo } from "@/shared/components/common/logo";
import { Button } from "@/shared/components/ui/button";
import { useSidebarStore } from "@/shared/lib/stores/sidebar-store";
import { SidebarNavContent } from "./sidebar-nav-content";

interface AppSidebarProps {
  extraNav?: React.ReactNode;
}

export function AppSidebar({ extraNav }: AppSidebarProps) {
  const pathname = usePathname();
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <aside className="hidden w-[var(--sidebar-width)] shrink-0 flex-col border-e border-border bg-surface p-4 md:flex">
        <Logo className="mb-6" />
        <SidebarNavContent extraNav={extraNav} />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute inset-y-0 start-0 flex w-[min(280px,85vw)] flex-col border-e border-border bg-surface p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarNavContent
              extraNav={extraNav}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
