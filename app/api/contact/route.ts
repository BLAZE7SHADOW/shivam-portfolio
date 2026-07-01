import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

// In-memory rate limiter: works per serverless instance (good enough for a portfolio).
// Resets on cold start, which is acceptable — persistent rate limiting needs Upstash/Redis.
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;          // max requests per window
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "ishivamgovindrao@gmail.com";

  if (!apiKey) {
    return NextResponse.json({ fallback: true }, { status: 200 });
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (name.trim().length > 100 || email.trim().length > 254 || message.trim().length > 5000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // swap to verified domain after DNS setup
      to,
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
    });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: email,
      event: "contact_message_sent",
      properties: { sender_name: name, source: "resend" },
    });
    await posthog.shutdown();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
