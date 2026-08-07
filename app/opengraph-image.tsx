import { ImageResponse } from "next/og";
import { profile } from "@/content/data";

export const runtime = "edge";
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* glow accents */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.22), transparent 70%)",
          }}
        />

        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#0e0e12",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#f4f4f6",
              fontSize: 34,
              fontStyle: "italic",
            }}
          >
            S
          </div>
          <div style={{ fontSize: 22, color: "#a1a1ad", fontFamily: "monospace" }}>
            shivamgovindrao.com
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 82, color: "#f4f4f6", lineHeight: 1.05, letterSpacing: -1 }}>
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 40,
              fontStyle: "italic",
              lineHeight: 1.15,
              background: "linear-gradient(90deg, #7c5cff, #22d3ee)",
              backgroundClip: "text",
              color: "transparent",
              maxWidth: 900,
            }}
          >
            {profile.tagline}
          </div>
        </div>

        {/* footer */}
        <div style={{ fontSize: 26, color: "#a1a1ad", fontFamily: "sans-serif" }}>
          {profile.role} · Founding-engineer mindset · AI · Full-stack
        </div>
      </div>
    ),
    { ...size }
  );
}
