// ============================================================================
//  EDIT THIS FILE TO UPDATE YOUR PORTFOLIO
//  Everything on the site reads from here. No need to touch component code.
// ============================================================================

export const profile = {
  name: "Shivam Govind Rao",
  initials: "Home",
  role: "Software Development Engineer",
  tagline: "builds AI products end-to-end, with frontend craft at the core.",
  // Drop your photo at /public/images/avatar.jpg (square works best)
  avatar: "/images/avatar.jpg",
  location: "Gurugram, India",
  status: "Open to work · Looking for my next role",
  // Drop your resume PDF at /public/Shivam_Govind_Rao_Resume.pdf
  resume: "/Shivam_Govind_Rao_Resume.pdf",
  email: "ishivamgovindrao@gmail.com",
  phone: "+91 63862 20277",
  // EDIT: paste your real links
  socials: {
    github: "https://github.com/BLAZE7SHADOW",
    linkedin: "https://www.linkedin.com/in/shivam-govind-rao-138881157/",
    twitter: "https://x.com/BLAZE07SHADOW",
  },
  intro:
    "I started as a frontend engineer and grew into owning full products end-to-end — backend, cloud, AI pipelines, and RPA automation. At Diagna AI I took FAXFlo from a company pivot to its first paying US clinic: the full clinical platform, a 40-endpoint Node.js API, a distributed AWS document pipeline processing 1,000+ faxes daily, and the AI + voice automation that made it all work.",
};

export const stats = [
  { num: "2", label: "Full-stack AI products shipped from 0" },
  { num: "1K+", label: "Medical docs processed daily" },
  { num: "$10K", label: "MRR built in 11 months" },
  { num: "40+", label: "AI doc categories at ~95% accuracy" },
];

export const marquee = [
  "React 19", "TypeScript", "Next.js", "Zustand", "Framer Motion",
  "GSAP", "Tailwind", "Node.js", "AWS Bedrock", "Remotion", "PostgreSQL", "PDF.js",
];

// ============================================================================
//  EXPERIENCE / JOURNEY  (used on Home + Journey page)
// ============================================================================
export const journey = [
  {
    period: "Jan 2025 — April 2026",
    role: "Software Development Engineer · Full-Stack",
    company: "Diagna AI — FAXFlo",
    place: "Gurugram",
    tag: "End-to-end product ownership",
    chapter: "The healthcare era",
    summary:
      "Took FAXFlo from a company pivot to its first paying US clinic in production. Owned the entire stack — React frontend, Node.js backend, AWS cloud pipeline, multi-model AI, Voice-AI scheduling, RPA automation, and analytics.",
    // Short versions shown on the home page — full `points` live on /journey
    topPoints: [
      "Built the complete **React 19** clinical platform solo — document inbox, PDF viewer, scheduling, analytics",
      "**40+ endpoint** Node.js API and an AWS pipeline processing **1,000+ faxes daily** at 99%+ uptime",
      "Multi-model AI classification at **~95% accuracy**, plus Voice-AI calls that cut manual outreach ~70%",
      "Went from company pivot to **first paying US clinic** in production",
    ],
    points: [
      "**Frontend** — Built the complete **React 19** clinical platform solo: document inbox with dual-view **PDF.js** viewer, eFax module, appointment scheduling and confirmation flows, and multi-clinic analytics dashboard — per-clinic feature flags, RBAC routing, and route-based code splitting to keep the platform lean as it scaled.",
      "**Backend API** — Built the production **Node.js · Express · PostgreSQL** backend from scratch: **40+ REST endpoints**, JWT + RBAC auth, input validation, Swagger docs, and **Redis-backed BullMQ** job queues for async processing.",
      "**AWS Pipeline** — Architected a distributed document pipeline (**S3 → SQS → Textract → SNS → Bedrock**) processing **1,000+ medical faxes daily** at **99%+ uptime** — with dead-letter queues (DLQ) for poison-message handling, SNS-triggered retries, and Slack alerting on failures.",
      "**AI Classification** — Multi-model chain for document classification: **Claude (Sonnet) via AWS Bedrock** as the primary model, **GPT-4o** as a cross-check, and **Amazon Nova Pro** as retry fallback on oversized payloads — **~95% accuracy** across **40+ medical categories**, with custom system prompts, structured JSON extraction, confidence scoring, and fallback retry logic.",
      "**SMS Orchestration** — Built an AI-driven SMS system across three providers (**Twilio · Telnyx · Vonage**) handling opt-in/opt-out compliance, appointment reminders, two-way patient messaging, and automated follow-up flows — with provider failover so no single outage breaks delivery.",
      "**Voice AI** — Built a Voice-AI outbound scheduling module (**VAPI + ElevenLabs**) for automated patient calls: appointment confirmations, reschedule handling, and intake — cutting manual outreach by **~70%**.",
      "**RPA & EHR Automation** — Engineered a full RPA suite (**Robocorp · Python · FastAPI · Redis RQ**) targeting MDLand EHR's iframe-heavy UI: OTP/2FA login, patient lookup, document upload, and calendar sync — plus a **React Chrome Extension** that embedded the orchestration UI directly on the EHR page.",
      "**Document Engine** — Wrote a custom **Zustand + Immer** editing engine with field-level diffing and patch-only backend sync; integrated **@react-pdf-viewer** for S3-hosted PDF preview — converting remote URLs to blob objects for CORS-safe rendering with proper `URL.revokeObjectURL` cleanup — plus multi-page batch processing and **~80% image compression** before S3 upload.",
      "**Analytics** — Built a **HIPAA-compliant PostHog** dashboard tracking EMR sync rates, document pipeline throughput, appointment conversion, and AI classification accuracy — the same dashboard used in the investor demo that **closed the first paying US clinic**.",
    ],
    stack: ["React 19", "TypeScript", "Zustand", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "AWS Bedrock", "Claude", "GPT-4o", "Textract", "VAPI", "ElevenLabs", "Robocorp", "Python", "FastAPI", "PDF.js", "PostHog"],
  },
  {
    period: "Dec 2023 — Jan 2025",
    role: "Frontend Developer",
    company: "Oriserve — VoiceGenie.ai",
    place: "Noida",
    tag: "Sole frontend engineer",
    chapter: "The voice-AI era",
    summary:
      "The only frontend engineer on VoiceGenie, a generative-AI voice sales platform. Built the dashboard and marketing site that closed the first enterprise customers.",
    topPoints: [
      "Sole frontend engineer — designed and built the **entire platform** and marketing site from 0",
      "Campaign builder, **ElevenLabs** voice tuning, and post-call analytics with AI entity extraction",
      "CRM integrations (**HubSpot · GoHighLevel · Cal.com**) with auto calendar booking on successful calls",
      "**0 → $10K MRR in 11 months** · 30–50% faster page loads",
    ],
    points: [
      "**Product ownership** — Designed and built the **entire VoiceGenie platform from 0** as the **sole frontend engineer**: customer-facing dashboard, marketing site, and internal tooling — all shipped solo.",
      "**Campaign builder** — Built the full campaign creation flow: configure AI voice scripts, select and segment contact lists, set call schedules, define call objectives (**lead generation, sales, appointment setting**), and monitor live campaign status per contact in real time.",
      "**Voice configuration** — Built a per-campaign voice settings panel: **ElevenLabs** voice selection, **pitch**, **speaking rate**, **AI temperature**, **engagement style**, and **tone** — letting teams tune the AI persona for each use case (cold outreach vs. warm follow-up vs. enterprise sales).",
      "**Post-call analytics** — Built a post-call review interface with full **call recordings**, **auto-generated transcripts**, **emotion detection** per call segment, and **AI-extracted entities** (name, email, phone, address, intent signals) surfaced as structured data — actionable intel without listening to every call.",
      "**R&D & internal dashboard** — Built an internal analytics platform for the product and research team: **call success rates**, **conversion funnels**, drop-off analysis by script section, and **voice model performance comparisons** — used directly for product iteration.",
      "**Onboarding UX** — Designed and built the end-to-end user onboarding: account setup, workspace config, first-campaign walkthrough, and guided integration steps — reducing **time-to-first-call** for new customers.",
      "**CRM integrations** — Connected **HubSpot**, **GoHighLevel**, and **Cal.com**: contact sync, call outcome and entity data logged back to CRM records, and **auto calendar booking** on successful calls.",
      "**Script composer** — Live **@token** variable composer (@name, @appointment, @product) that resolves per-contact at call time; no hardcoded scripts — every call personalised dynamically.",
      "**Performance & growth** — Cut page load times **30–50%** via code splitting, lazy loading, and caching; grew VoiceGenie from **0 to $10K MRR in 11 months** as the only frontend engineer.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Material UI", "Redux", "Tailwind"],
  },
];

// The narrative growth path shown on the Journey page
export const growthPath = [
  { label: "Frontend Developer", note: "Where it started — components, state, UI craft." },
  { label: "Product Engineer", note: "Owning features end-to-end, thinking in user outcomes." },
  { label: "Full Stack Engineer", note: "Node, Postgres, queues, cloud — building the whole pipe." },
  { label: "AI Engineer", note: "Bedrock, Claude, document intelligence, voice automation." },
  { label: "Full-Stack AI Engineer", note: "0→production ownership — frontend, backend, cloud, AI, voice, RPA." },
];

// ============================================================================
//  PROJECTS
//  Each project has a `media` array — add as many images/videos as you want.
//  type: "image" | "video".  src: a path under /public.
//  Drop files in /public/demos and reference them here. Blur PHI before adding.
//  An empty media array shows a styled "demo coming soon" placeholder.
// ============================================================================
export type Media = { type: "image" | "video"; src: string; caption?: string };

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  year: string;
  role: string;
  featured: boolean;
  wip?: boolean;
  caseStudy?: string; // internal deep-dive page, e.g. "/projects/motionstudio"
  media: Media[];
  highlights: string[];
  stack: string[];
  links: { live: string; github: string };
};

export const projects: Project[] = [
  {
    slug: "faxflo",
    title: "FAXFlo — Diagna AI",
    blurb: "Full-stack AI medical-document platform — clinical inbox, eFax triage, voice scheduling, RPA EHR automation, and analytics. Taken from a company pivot to its first paying US clinic.",
    year: "2025",
    role: "Software Development Engineer · Full-Stack",
    featured: true,
    media: [
      { type: "video", src: "/demos/faxflo-demo.mp4", caption: "FAXFlo product walkthrough — official demo from diagna.ai" },
      { type: "image", src: "/images/Faxflo_main_dashboard.png", caption: "Main clinical dashboard" },
      { type: "image", src: "/images/Faxfllo-appointment_dashboad.png", caption: "Appointment scheduling dashboard" },
      { type: "image", src: "/images/Faxflo_analytics_dashboard-1.png", caption: "Analytics dashboard — document & EMR metrics" },
      { type: "image", src: "/images/Faxflo_analytics_dashboard-2.png", caption: "Analytics dashboard — appointment & AI status" },
      { type: "image", src: "/images/First_page.avif", caption: "diagna.ai — public site" },
    ],
    highlights: [
      "React 19 frontend: clinical inbox, eFax module, scheduling views, analytics dashboard — per-clinic feature flags, RBAC routing, lazy-loaded routes",
      "Node.js backend: 40+ REST endpoints, JWT/RBAC auth, Redis BullMQ queues, Swagger docs",
      "AWS pipeline: S3 → SQS → Textract → SNS → Bedrock — 1,000+ docs/day, 99%+ uptime, DLQ + Slack alerting",
      "Multi-model AI: Claude (Sonnet) via Bedrock + GPT-4o cross-check + Amazon Nova Pro fallback — ~95% accuracy across 40+ medical document categories",
      "SMS: Twilio · Telnyx · Vonage orchestrator with provider failover, opt-in/out compliance, automated reminders",
      "Voice AI: VAPI + ElevenLabs outbound scheduling — automated patient calls, cutting manual outreach ~70%",
      "RPA: Robocorp · FastAPI · Redis RQ for MDLand EHR automation + React Chrome Extension for on-page control",
      "Document engine: Zustand + Immer field-level diffing, S3-hosted PDF preview via @react-pdf-viewer, 80% image compression",
      "HIPAA-compliant PostHog analytics dashboard — the demo that closed the first paying US clinic",
    ],
    stack: ["React 19", "TypeScript", "Zustand", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "AWS Bedrock", "Claude", "GPT-4o", "Textract", "VAPI", "ElevenLabs", "Robocorp", "Python", "FastAPI", "Prisma", "PostHog"],
    links: { live: "https://www.diagna.ai", github: "" },
  },
  {
    slug: "voicegenie",
    title: "VoiceGenie",
    blurb: "Generative-AI voice sales platform. Designed and built the entire product solo — campaign management, internal analytics, onboarding UX, ElevenLabs voice integration, and CRM connections. Reached $10K MRR in 11 months.",
    year: "2024",
    role: "Frontend Developer",
    featured: true,
    media: [
      { type: "video", src: "/demos/voicegenie-demo.mp4", caption: "Official VoiceGenie demo (voicegenie.ai) — UI designed & built by me" },
      { type: "image", src: "/images/voicegenie-cover.jpg", caption: "AI assistant script builder — VoiceGenie dashboard" },
    ],
    highlights: [
      "Sole frontend engineer — designed and built the entire platform, dashboard, and marketing site from 0",
      "Campaign builder with call objective config (lead gen, sales, appointments) and per-contact live tracking",
      "Voice configuration panel: ElevenLabs voice, pitch, rate, AI temperature, tone, engagement style per campaign",
      "Post-call analytics: recordings, auto transcripts, emotion detection, AI entity extraction (email, phone, address, intent)",
      "Internal R&D dashboard: conversion funnels, drop-off by script section, voice model performance comparison",
      "CRM integrations: HubSpot · GoHighLevel · Cal.com — entity data logged back, auto calendar booking on success",
      "Live @token script composer — personalised per contact at call time, no hardcoded scripts",
      "0 → $10K MRR in 11 months · 30–50% faster page loads via code splitting and caching",
    ],
    stack: ["React", "Next.js", "TypeScript", "Ant Design", "Tailwind", "Redux", "ElevenLabs", "HubSpot", "GoHighLevel", "Cal.com"],
    links: { live: "https://voicegenie.ai", github: "" },
  },
  {
    slug: "motionstudio",
    title: "MotionStudio",
    blurb: "A full browser-based video compositor built on Remotion — canvas editing, a frame-accurate timeline, keyframe animation, 22 text effects and 18 shader backgrounds, with a free in-browser (WebCodecs) export and a cloud render pipeline on AWS Lambda. Real auth and cross-device project sync. A deep exploration of programmatic video and creative tooling.",
    year: "2026",
    role: "Personal project",
    featured: false,
    wip: true,
    caseStudy: "/projects/motionstudio",
    media: [
      { type: "image", src: "/images/canvas-editor-screenshot.png", caption: "The editor — assets, canvas, live properties, and a frame-accurate timeline" },
    ],
    highlights: [
      "Full compositor — canvas editing, frame-accurate timeline, keyframe animation, 22 text effects, 18 shader backgrounds",
      "Two export paths — free in-browser (WebCodecs) and cloud render via AWS Lambda, both driving the same Remotion composition",
      "Production infra — Supabase (auth · quota · cross-device sync), Vercel Functions, AWS Lambda + S3",
    ],
    stack: ["Remotion", "React 19", "TypeScript", "Tailwind", "Zustand", "Supabase", "AWS Lambda"],
    links: { live: "https://motionstudio-six.vercel.app/", github: "https://github.com/BLAZE7SHADOW/MotionStudio" },
  },
];

// ============================================================================
//  NOW PAGE  —  update this whenever you want. It's your living status.
// ============================================================================
export const now = {
  // EDIT: the date you last updated this page
  updated: "June 2026",
  intro:
    "A living snapshot of what I'm building, learning, and thinking about right now. Updated regularly.",
  building: [
    { title: "MotionStudio", note: "A Remotion-based browser video compositor — live, and actively growing (keyframes, text effects, shader backgrounds, cloud render)." },
    { title: "What's next", note: "Actively exploring founding engineer and senior full-stack roles. If you're building something ambitious in AI or product, let's talk." },
  ],
  learning: [
    { title: "System Design", note: "Distributed systems, queues, and scaling patterns — applied directly to FAXFlo's pipeline." },
    { title: "DSA", note: "Sharpening data structures & algorithms regularly." },
    { title: "Remotion deep-dive", note: "Programmatic video as a first-class engineering problem." },
  ],
  reading: [
    // Hard-coded — no auto-sync. Just edit these lines.
    { title: "On Twitter / X", note: "Following the agentic-workflows and AI-tooling space." },
    { title: "Blog writing", note: "Starting to write about building in the AI era." },
  ],
  interests: [
    "AI Applications", "Developer Tools", "System Design", "Distributed Systems",
    "Video Generation", "Remotion", "Creative Tooling", "Automation",
    "Interactive UIs", "Agentic Workflows", "Building in Public",
  ],
};

// ============================================================================
//  HOBBIES  (shown on Home / Journey)
//  EDIT these — placeholders below.
// ============================================================================
export const hobbies = [
  { emoji: "🎬", title: "Video editing", note: "Motion design and creative tooling." },
  { emoji: "✍️", title: "Writing", note: "Documenting what I build." },
  { emoji: "🧩", title: "Side projects", note: "Always building something." },
  { emoji: "🎧", title: "Music", note: "Fuel for long build sessions." },
];

// ============================================================================
//  SKILLS
// ============================================================================
export const skills = [
  { group: "Frontend", items: ["React 19", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP", "Zustand", "React Query", "MUI", "Ant Design", "shadcn/ui", "Remotion"] },
  { group: "Backend", items: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis", "BullMQ", "REST APIs", "JWT", "FastAPI", "Python"] },
  { group: "Cloud", items: ["AWS", "S3", "SQS", "SNS", "Textract", "Bedrock", "Lambda", "IAM", "Docker"] },
  { group: "AI", items: ["Claude", "GPT-4o", "Llama", "AWS Bedrock", "VAPI", "ElevenLabs", "Twilio", "Prompt Engineering", "Document Intelligence"] },
  { group: "Automation", items: ["Robocorp", "Playwright", "Puppeteer", "RPA", "Chrome Extensions", "Redis RQ", "Job Queues"] },
  { group: "Tools", items: ["Git", "PostHog", "Swagger", "Vercel", "Claude Code", "Cursor", "VS Code"] },
];
