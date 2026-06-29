"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/content/data";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/journey", label: "Journey" },
  { href: "/projects", label: "Projects" },
  { href: "/now", label: "Now" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="fixed left-1/2 top-5 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full border border-panel-border bg-bg-soft/60 p-1.5 backdrop-blur-xl">
      <Link
        href="/"
        data-mag
        className="rounded-full px-4 py-2 text-[13px] font-semibold text-ink"
      >
        {profile.initials}
      </Link>
      {links.slice(1).map((l) => {
        const active = l.href === path || (l.href === "/" && path === "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            data-mag
            className={cn(
              "hidden rounded-full px-4 py-2 text-[13px] font-medium transition-colors sm:block",
              active ? "text-ink" : "text-ink-dim hover:text-ink"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
