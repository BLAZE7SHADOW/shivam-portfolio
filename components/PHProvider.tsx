"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import type { CaptureResult } from "posthog-js";
import { useEffect } from "react";

// Noise from browser extensions, not from this site. These rejections come from
// injected content scripts talking to a background page over an async channel;
// when the page unloads or the target is gone, the promise rejects. Nothing here
// is our code, so drop these events instead of tracking them as site errors.
const EXTENSION_NOISE = [
  "Object Not Found Matching Id",           // extension messaging (e.g. password managers)
  "The message port closed before a response was received",
  "A listener indicated an asynchronous response by returning true",
  "ResizeObserver loop",                    // benign observer notification
];

function isExtensionNoise(text: string) {
  return EXTENSION_NOISE.some((needle) => text.includes(needle));
}

function beforeSend(event: CaptureResult | null): CaptureResult | null {
  if (event?.event === "$exception") {
    const list = event.properties?.$exception_list as
      | { value?: string; type?: string }[]
      | undefined;
    const message = list?.map((e) => `${e.type ?? ""} ${e.value ?? ""}`).join(" ") ?? "";
    if (isExtensionNoise(message)) return null;
  }
  return event;
}

export default function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
      before_send: beforeSend,
    });
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
