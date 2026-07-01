"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { profile } from "@/content/data";

type State = "idle" | "sending" | "sent" | "error" | "rate-limited";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mailtoFallback = () => {
    const subject = encodeURIComponent(`Portfolio message from ${form.name || "someone"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        if (data?.fallback) {
          posthog.capture("contact_form_submitted", { method: "mailto_fallback" });
          mailtoFallback();
          setState("idle");
        } else {
          posthog.capture("contact_form_submitted", { method: "resend" });
          setState("sent");
          setForm({ name: "", email: "", message: "" });
        }
      } else if (res.status === 429) {
        setState("rate-limited");
      } else {
        setState("error");
      }
    } catch {
      posthog.capture("contact_form_submitted", { method: "mailto_fallback_error" });
      mailtoFallback();
      setState("idle");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-panel-border bg-panel px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-accent";

  return (
    <form onSubmit={submit} className="mx-auto mt-10 grid max-w-xl gap-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputCls}
          placeholder="Your name"
          value={form.name}
          onChange={update("name")}
          required
        />
        <input
          className={inputCls}
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={update("email")}
          required
        />
      </div>
      <textarea
        className={`${inputCls} min-h-[130px] resize-y`}
        placeholder="What's on your mind?"
        value={form.message}
        onChange={update("message")}
        required
      />
      <button
        type="submit"
        data-mag
        disabled={state === "sending"}
        className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-bg transition-shadow hover:shadow-[0_10px_40px_rgba(255,255,255,0.15)] disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : state === "sent" ? "Sent ✓" : "Send message"}
      </button>
      {state === "sent" && (
        <p className="text-center text-sm text-accent-2">Thanks — I&apos;ll get back to you soon.</p>
      )}
      {state === "rate-limited" && (
        <p className="text-center text-sm text-red-400">
          Too many attempts. Please wait 15 minutes before trying again.
        </p>
      )}
      {state === "error" && (
        <p className="text-center text-sm text-red-400">
          Something went wrong.{" "}
          <button type="button" onClick={mailtoFallback} className="underline">
            Email me directly instead.
          </button>
        </p>
      )}
    </form>
  );
}
