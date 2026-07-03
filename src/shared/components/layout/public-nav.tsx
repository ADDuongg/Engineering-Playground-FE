"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { Logo } from "@/shared/components/common/logo";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const PUBLIC_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#labs", label: "Labs" },
  { href: "#pricing", label: "Pricing" },
];

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Logo />

        <div className="hidden items-center gap-6 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.login}>Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={ROUTES.dashboard}>Start learning</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border transition-[max-height] duration-200 ease-in-out md:hidden",
          isOpen ? "max-h-80" : "max-h-0 border-t-transparent",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.login} onClick={() => setIsOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={ROUTES.dashboard} onClick={() => setIsOpen(false)}>
                Start learning
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
