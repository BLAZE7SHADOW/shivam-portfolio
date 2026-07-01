"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { Check, Copy } from "lucide-react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(email).then(() => {
      posthog.capture("email_copied");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={copy}
      data-mag
      className="inline-flex items-center gap-2 rounded-full border border-panel-border px-4.5 py-2.5 text-sm text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"
      title="Click to copy email"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {email}
    </button>
  );
}
