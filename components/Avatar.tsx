"use client";

import Image from "next/image";
import { profile } from "@/content/data";
import { cn } from "@/lib/utils";

export default function Avatar({
  size = 120,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("group relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {/* gradient ring */}
      <div
        className="absolute -inset-[3px] rounded-full opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "conic-gradient(from 180deg, #f59e0b, #22d3ee, #f59e0b)" }}
      />
      {/* glow */}
      <div
        className="absolute -inset-2 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-full border-2 border-bg">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={size * 2}
          height={size * 2}
          sizes={`${size * 2}px`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>
    </div>
  );
}
