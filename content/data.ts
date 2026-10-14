// ============================================================================
//  EDIT THIS FILE TO UPDATE YOUR PORTFOLIO
//  Everything on the site reads from here. No need to touch component code.
// ============================================================================

export const profile = {
  name: "Shivam Govind Rao",
  initials: "Home",
  role: "AI Engineer · Full-Stack",
  tagline: "builds production AI — agents, voice, LLM pipelines — and the full stack around them.",
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
    "AI Engineer with 2.5 years building production AI products end to end: LLM pipelines, multi-agent systems (LangGraph), RAG and real-time voice agents, plus the React, Node.js and Python systems around them. At Diagna AI I built the document-AI platform that processes 1,000+ medical faxes a day for live US clinics; before that I shipped VoiceGenie, a generative-AI voice platform, from 0 to $10K MRR in 11 months. I care about AI that holds up in production: guardrails in code, evals, and measured latency and cost.",
};

export const stats = [
  { num: "2.5 yrs", label: "Shipping production AI products end to end" },
  { num: "1K+", label: "Medical docs processed daily" },
  { num: "$10K", label: "MRR built in 11 months" },
  { num: "40+", label: "AI doc categories at ~95% accuracy" },
];

export const marquee = [
  "LangGraph", "LiveKit Agents", "Python", "AWS Bedrock", "Gemini", "Claude", "RAG",
  "React 19", "TypeScript", "Next.js", "Node.js", "FastAPI", "PostgreSQL", "Framer Motion", "Remotion",
];

// ============================================================================
//  EXPERIENCE / JOURNEY  (used on Home + Journey page)
// ============================================================================
export const journey = [
  {
    period: "Jan 2025 — Apr 2026",
    role: "Software Development Engineer · AI & Full-Stack",
    company: "Diagna AI — FAXFlo",
    place: "Gurugram",
    tag: "Document AI in production",
    chapter: "The healthcare era",
    summary:
      "Built the document-AI platform behind FAXFlo, taking it from a company pivot to live paying US clinics. Owned it end to end: multi-model LLM extraction on AWS Bedrock, the HIPAA-compliant backend and queues, RPA write-back into a legacy EHR, and both React frontends.",
    // Short versions shown on the home page — full `points` live on /journey
    topPoints: [
      "Led **multi-model AI on AWS Bedrock** (Claude Sonnet, Amazon Nova Pro, Llama) classifying and extracting **1,000+ medical faxes a day** across **40+ document categories** for live US clinics",
      "LLM reliability: pre-flight token counting, **cost-aware model routing**, schema-validated JSON with retries, and a **fallback chain** across model families",
      "Cut manual fax triage from **about 3 hours to 10 minutes a day** by chaining AI extraction, patient matching, human review and EHR write-back",
      "HIPAA backend: **40+ endpoints**, a 25-model Postgres schema, S3 · SQS · SNS into **7 BullMQ queues**; a FastAPI RPA service took referrals from **4.2 days to same day**",
      "Built both production **React 19** frontends, including the editor for reviewing AI output",
    ],
    points: [
      "**Frontend** — Built the complete **React 19** clinical platform solo: document inbox with dual-view **PDF.js** viewer, eFax module, appointment scheduling and confirmation flows, and multi-clinic analytics dashboard — per-clinic feature flags, RBAC routing, and route-based code splitting to keep the platform lean as it scaled.",
      "**Backend API** — Architected the core of a **HIPAA-compliant** platform on **Node.js · Express · PostgreSQL**: **40+ REST endpoints** (JWT + RBAC) over a **25-model** schema, and S3 · SQS · SNS ingestion into **7 BullMQ/Redis queues** with idempotency, rate limiting and a dead-letter queue.",
      "**AWS Pipeline** — Architected a distributed document pipeline (**S3 → SQS → Textract → SNS → Bedrock**) processing **1,000+ medical faxes daily** at **99%+ uptime** — with dead-letter queues (DLQ) for poison-message handling, SNS-triggered retries, and Slack alerting on failures.",
      "**AI Classification** — Led multi-model integration on **AWS Bedrock** (**Claude Sonnet**, **Amazon Nova Pro**, **Llama**) to classify and extract structured data from **1,000+ medical faxes a day** across **40+ document categories** — **~95% accuracy**, with clinic-specific prompts, structured JSON extraction and confidence scoring.",
      "**LLM Reliability** — Pre-flight token counting, context- and **cost-aware model routing**, schema-validated JSON with retries for malformed output, and a **fallback chain across model families**, so one model's outage or bad output never stops the pipeline.",
      "**Workflow impact** — Chained AI extraction, patient matching, human review and EHR write-back into one workflow: manual fax triage fell from **about 3 hours to 10 minutes a day**, and a recurring **2-day backlog** cleared.",
      "**SMS Orchestration** — Built an AI-driven SMS system across three providers (**Twilio · Telnyx · Vonage**) handling opt-in/opt-out compliance, appointment reminders, two-way patient messaging, and automated follow-up flows — with provider failover so no single outage breaks delivery.",
      "**Voice AI** — Built a Voice-AI outbound scheduling module (**VAPI + ElevenLabs**) for automated patient calls: appointment confirmations, reschedule handling, and intake — cutting manual outreach by **~70%**.",
      "**RPA & EHR Automation** — Engineered a full RPA suite (**Robocorp · Playwright · Python · FastAPI · Redis RQ**) that writes into a no-API legacy EHR (MDLand's iframe-heavy UI: OTP/2FA login, patient lookup, document upload, calendar sync), plus **Medplum FHIR** sync — referral turnaround fell from **4.2 days to same day**. A **React Chrome Extension** embedded the orchestration UI directly on the EHR page.",
      "**Document Engine** — Wrote a custom **Zustand + Immer** editing engine with field-level diffing and patch-only backend sync; integrated **@react-pdf-viewer** for S3-hosted PDF preview — converting remote URLs to blob objects for CORS-safe rendering with proper `URL.revokeObjectURL` cleanup — plus multi-page batch processing and **~80% image compression** before S3 upload.",
      "**Analytics** — Built a **HIPAA-compliant PostHog** dashboard tracking EMR sync rates, document pipeline throughput, appointment conversion, and AI classification accuracy — the same dashboard used in the investor demo that **closed the first paying US clinic**.",
    ],
    stack: ["AWS Bedrock", "Claude", "Amazon Nova", "Llama", "Python", "FastAPI", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "Textract", "Robocorp", "Playwright", "Medplum FHIR", "React 19", "TypeScript", "Zustand", "VAPI", "ElevenLabs", "PostHog"],
  },
  {
    period: "Dec 2023 — Jan 2025",
    role: "Software Engineer · Voice AI",
    company: "Oriserve — VoiceGenie.ai",
    place: "Noida",
    tag: "Generative-AI voice platform",
    chapter: "The voice-AI era",
    summary:
      "Sole frontend engineer on VoiceGenie, a generative-AI voice agent platform, and a collaborator on its voice infrastructure. Built the product that took it to $10K MRR and closed the first enterprise customers.",
    topPoints: [
      "Sole frontend engineer — designed and built the **entire platform** and marketing site from 0",
      "Campaign builder, **ElevenLabs** voice tuning, and post-call analytics with AI entity extraction",
      "Collaborated on **Twilio** voice-AI infrastructure for **2K+ concurrent calls**, with rate limiting that blocked **15K+ abusive requests a day**",
      "**Stripe** payments end to end · CRM sync (**HubSpot · GoHighLevel · Cal.com**) · **0 → $10K MRR in 11 months**",
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
      "**Voice infrastructure** — Collaborated on the **Twilio** voice-AI infrastructure behind **2K+ concurrent calls**, and on rate limiting that blocked **15K+ abusive requests a day**.",
      "**Payments** — Integrated **Stripe** end to end: plans, checkout and billing state in the dashboard.",
      "**Performance & growth** — Cut page load time **30%** via code splitting, lazy loading, and caching; grew VoiceGenie from **0 to $10K MRR in 11 months** as the only frontend engineer.",
    ],
    stack: ["Next.js", "React", "TypeScript", "ElevenLabs", "Twilio", "Stripe", "Redux", "Material UI", "Tailwind"],
  },
];

// The narrative growth path shown on the Journey page
export const growthPath = [
  { label: "Frontend Developer", note: "Where it started — components, state, UI craft." },
  { label: "Product Engineer", note: "Owning features end-to-end, thinking in user outcomes." },
  { label: "Full Stack Engineer", note: "Node, Postgres, queues, cloud — building the whole pipe." },
  { label: "Full-Stack AI Engineer", note: "Bedrock, Claude, document intelligence, voice automation — 0→production ownership." },
  { label: "AI Engineer", note: "Multi-agent systems, real-time voice and RAG — with guardrails in code, evals, and measured latency and cost." },
];

// ============================================================================
//  PROJECTS
//  Each project has a `media` array — add as many images/videos as you want.
//  type: "image" | "video".  src: a path under /public.
//  Drop files in /public/demos and reference them here. Blur PHI before adding.
//  An empty media array shows a styled "demo coming soon" placeholder.
// ============================================================================
export type Media = { type: "image" | "video"; src: string; caption?: string; poster?: string };

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  year: string;
  role: string;
  featured: boolean;
  flagship?: boolean; // shown as the full-width hero card on Home
  wip?: boolean;
  caseStudy?: string; // internal deep-dive page, e.g. "/projects/motionstudio"
  media: Media[];
  highlights: string[];
  stack: string[];
  links: { live: string; github: string };
};

export const projects: Project[] = [
  {
    slug: "payops",
    title: "PayOps AI",
    blurb: "Multi-agent payment reconciliation. When a company's gateway, orders, ledger, webhooks and settlement disagree, a LangGraph system of parallel specialists (Jev + Gemini) investigates, cites evidence and proposes a fix. Deterministic policy, four-eyes approvals, exactly-once execution and an independent validator decide what actually happens.",
    year: "2026",
    role: "Personal project · solo build, end to end",
    featured: true,
    flagship: true,
    caseStudy: "/projects/payops",
    media: [
      { type: "video", src: "/demos/payops-demo.mp4", poster: "/images/payops/poster.jpg", caption: "Narrated 3-minute walkthrough: investigation, evidence, approval, verification" },
      { type: "image", src: "/images/payops/case-screen.png", caption: "A case: five-system state matrix, lifecycle and detection rules" },
      { type: "image", src: "/images/payops/phase2-manager-approval.png", caption: "A ₹78,000 refund waits for a manager (four-eyes)" },
      { type: "image", src: "/images/payops/phase2-verification.png", caption: "Independent validator re-reads every system: PASS" },
      { type: "image", src: "/images/payops/payments-screen.png", caption: "Payments with cross-system mismatches flagged" },
    ],
    highlights: [
      "**LangGraph** 19-node state machine: Jev plans once, **3 specialists fan out in parallel** via Send(), findings are grounded against cited evidence, with durable **interrupt / resume** for approvals",
      "**Two models, two jobs**: Jev for 6 typed decisions with coded fallbacks, Gemini for reasoning. A **Jev-first fast path** resolves known faults with zero Gemini calls",
      "**Models propose, code decides**: a closed catalog of 9 actions, a P0–P11 policy engine, **four-eyes** approvals, idempotent execution, and a validator that re-reads every system",
      "**11/11 golden scenarios** passing live (100% root-cause, action and tier match) for **$0.004** total; record/replay cassettes make the demo free and deterministic",
      "Hexagonal TypeScript monorepo: React 19 workbench, Express 5 + Socket.IO + pg-boss, one Postgres for data, queue and checkpoints. Hash-chained audit, MFA, ~460 tests",
    ],
    stack: ["LangGraph", "Gemini", "Jev (TypeSafe)", "TypeScript", "React 19", "Node.js", "Express 5", "PostgreSQL", "Drizzle", "pg-boss", "Socket.IO", "Zod"],
    links: { live: "https://payops-ai-nine.vercel.app/", github: "https://github.com/BLAZE7SHADOW/PayOps-AI" },
  },
  {
    slug: "voice-agent",
    title: "Hinglish Clinic Voice Agent",
    blurb: "A real-time voice receptionist for small Indian clinics. Callers speak English or Hinglish; the agent answers clinic questions, finds free slots, and books, moves or cancels appointments. It verifies the caller before touching their data and never writes anything they haven't clearly confirmed. Every stage of every turn is timed.",
    year: "2026",
    role: "Personal project · in development, week 3 of 8",
    featured: false,
    wip: true,
    caseStudy: "/projects/voice-agent",
    media: [],
    highlights: [
      "Streaming **LiveKit Agents** loop: Deepgram STT → **Gemini Flash** → Cartesia TTS, Silero VAD + turn detection, **barge-in in about 0.35–0.4 s**, with Sarvam and Gemini fallbacks",
      "**Safety in code, not the prompt**: one agent with per-mode tool allowlists, caller verification before any personal data, read-backs built from the stored row, idempotent writes and a **DB constraint against double booking**",
      "**Sandboxed evals**: 13/13 multi-turn tasks, **0 wrong actions**, 217 tests; per-stage p50/p95 latency on every turn",
      "Doctor-name recognition on phone audio **61% → 99%**; slot lookup **up to 1.2 s → 200 ms**",
    ],
    stack: ["Python", "LiveKit Agents", "Deepgram", "Gemini", "Cartesia", "Sarvam", "Silero VAD", "PostgreSQL", "asyncpg", "pydantic", "pytest"],
    links: { live: "", github: "https://github.com/BLAZE7SHADOW/hinglish-clinic-voice-agent" },
  },
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
    blurb: "A real video editor that runs in your browser, built on Remotion — canvas editing, a frame-accurate timeline, keyframe animation, 34 text effects and 18 shader backgrounds, beat-synced shots, and two ways to export: free in your browser or full-fidelity on AWS Lambda. Real auth and cross-device project sync. A deep dive into programmatic video and creative tooling.",
    year: "2026",
    role: "Personal project",
    featured: false,
    wip: true,
    caseStudy: "/projects/motionstudio",
    media: [
      { type: "image", src: "/images/canvas-editor-screenshot.png", caption: "The editor — assets, canvas, live properties, and a frame-accurate timeline" },
    ],
    highlights: [
      "Full editor — canvas editing, frame-accurate timeline, keyframe animation, 34 text effects, 18 shader backgrounds, beat-synced shots",
      "Two export paths — free in your browser (WebCodecs) and full-fidelity cloud render via AWS Lambda",
      "Production infra — Supabase (auth · quota · cross-device sync), Vercel Functions, AWS Lambda + S3",
    ],
    stack: ["Remotion", "React 19", "TypeScript", "Tailwind", "Zustand", "Supabase", "AWS Lambda"],
    links: { live: "https://motionstudio-six.vercel.app/", github: "https://github.com/BLAZE7SHADOW/MotionStudio" },
  },
  {
    slug: "clinrag",
    title: "ClinRAG",
    blurb: "Hybrid RAG over FDA drug labels, with the evaluation harness as the real deliverable. Dense and BM25 retrieval fused with reciprocal rank fusion, answers only from retrieved excerpts, and a RAGAS benchmark on hand-verified questions that decided what not to build.",
    year: "2026",
    role: "Personal project",
    featured: false,
    media: [],
    highlights: [
      "Table-aware chunking (Docling), **Cohere embeddings** on Bedrock, **FAISS + BM25** with reciprocal rank fusion, **Claude Haiku 4.5** answering only from retrieved excerpts",
      "**RAGAS** on 12 hand-verified questions: hybrid lifted context recall **0.75 → 0.83** but faithfulness fell **0.98 → 0.88**, so it is not a clean win",
      "Reranking was **scoped out on purpose**: the numbers didn't show a gap it would close",
    ],
    stack: ["Python", "AWS Bedrock", "Claude Haiku", "Cohere Embed", "FAISS", "BM25", "RAGAS", "Docling"],
    links: { live: "", github: "https://github.com/BLAZE7SHADOW/ClinRAG" },
  },
];

// ============================================================================
//  NOW PAGE  —  update this whenever you want. It's your living status.
// ============================================================================
export const now = {
  // EDIT: the date you last updated this page
  updated: "October 2026",
  intro:
    "A living snapshot of what I'm building, learning, and thinking about right now. Updated regularly.",
  building: [
    { title: "Hinglish Clinic Voice Agent", note: "A real-time voice receptionist for Indian clinics on LiveKit Agents. Week 3 of 8: turn-taking, latency and the V1 demo video. Every change is measured per stage, and guards live in code." },
    { title: "PayOps AI", note: "A multi-agent payment investigator: LangGraph specialists find why payment systems disagree, while deterministic policy, human approvals and an independent validator keep the money safe." },
    { title: "MotionStudio", note: "A real video editor that runs in the browser, built on Remotion — live and actively growing (keyframes, 34 text effects, 18 shader backgrounds, beat-synced shots, cloud render)." },
    { title: "What's next", note: "Actively exploring founding engineer and senior full-stack roles. If you're building something ambitious in AI or product, let's talk." },
  ],
  learning: [
    { title: "System Design", note: "Distributed systems, queues, and scaling patterns — applied directly to FAXFlo's pipeline." },
    { title: "DSA", note: "Sharpening data structures & algorithms regularly." },
    { title: "Real-time voice AI", note: "Turn detection, endpointing and barge-in — where most of a voice agent's latency actually goes." },
    { title: "Remotion deep-dive", note: "Programmatic video as a first-class engineering problem." },
  ],
  reading: [
    // Hard-coded — no auto-sync. Just edit these lines.
    { title: "On Twitter / X", note: "Following the agentic-workflows and AI-tooling space." },
    { title: "Blog writing", note: "Starting to write about building in the AI era." },
  ],
  interests: [
    "AI Applications", "Voice AI", "Multi-Agent Systems", "LLM Evals", "Developer Tools", "System Design", "Distributed Systems",
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
  { group: "AI & Agents", items: ["LangGraph", "LangChain", "Multi-agent systems", "Tool calling", "RAG (FAISS, BM25)", "AWS Bedrock", "Claude", "Gemini", "OpenAI", "Llama", "Document Intelligence"] },
  { group: "Evals & Reliability", items: ["RAGAS", "Golden datasets", "Record/replay evals", "Guardrails in code", "Human-in-the-loop", "Model fallbacks", "Latency telemetry"] },
  { group: "Voice AI", items: ["LiveKit Agents", "Deepgram", "Cartesia", "Sarvam", "Silero VAD", "ElevenLabs", "VAPI", "Twilio"] },
  { group: "Backend", items: ["Python", "FastAPI", "Pydantic", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "Prisma", "REST APIs", "JWT"] },
  { group: "Frontend", items: ["React 19", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP", "Zustand", "React Query", "MUI", "Ant Design", "shadcn/ui", "Remotion"] },
  { group: "Cloud", items: ["AWS", "S3", "SQS", "SNS", "Textract", "Bedrock", "Lambda", "IAM", "Docker"] },
  { group: "Automation", items: ["Robocorp", "Playwright", "Puppeteer", "RPA", "Chrome Extensions", "Redis RQ", "Job Queues"] },
  { group: "Tools", items: ["Git", "pytest", "Jest", "PostHog", "Swagger", "Vercel", "Claude Code", "Cursor", "VS Code"] },
];
