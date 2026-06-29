"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { profile } from "@/content/data";
import { cn } from "@/lib/utils";

const links = [
  { href: "/journey", label: "Journey" },
  { href: "/projects", label: "Projects" },
  { href: "/now", label: "Now" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-1/2 top-5 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full border border-panel-border bg-bg-soft/60 p-1.5 backdrop-blur-xl">
        <Link
          href="/"
          data-mag
          className="rounded-full px-4 py-2 text-[13px] font-semibold text-ink"
        >
          {profile.initials}
        </Link>

        {/* Desktop links */}
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            data-mag
            className={cn(
              "hidden rounded-full px-4 py-2 text-[13px] font-medium transition-colors sm:block",
              l.href === path ? "text-ink" : "text-ink-dim hover:text-ink"
            )}
          >
            {l.label}
          </Link>
        ))}

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-dim transition-colors hover:text-ink sm:hidden"
        >
          {open ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[99] sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-1/2 top-[72px] z-[100] flex w-44 -translate-x-1/2 flex-col gap-0.5 rounded-2xl border border-panel-border bg-bg-soft/95 p-2 backdrop-blur-xl sm:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors",
                  l.href === path
                    ? "bg-panel text-ink"
                    : "text-ink-dim hover:bg-panel hover:text-ink"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
