# Work Experience Summary — Shivam Govind Rao
> Master reference for resume variations, job applications, cover letters, and interview prep.
> Details are code-verified or backed by your own records where noted. Items marked ⚠ still need a final check before using in an application.
> Removed as unverifiable/fabricated: "300 DPI PDF.js rendering" (never built — actual PDF preview is `@react-pdf-viewer`, default resolution), "110+ React components" (weak/unverifiable metric), "GPT-4o via Bedrock" as a single unit (Bedrock doesn't host OpenAI models — see the corrected multi-model chain below).

---

## Diagna AI — FAXFlo
**Role:** Software Development Engineer (Full-Stack) · First and sole engineer
**Period:** Jan 2025 – April 2026 · Gurugram

---

### Frontend — React 19 (Vite · TypeScript · Ant Design · Zustand)

**AI-Powered Document Processing**
- Built an intelligent inbox with AI document analysis using **AWS Bedrock (Claude Sonnet)** and **AWS Textract** — extracting structured patient data (name, DOB, referrals, critical elements) from uploaded medical faxes.
- Engineered custom LLM prompts with fallback handling and retry logic for expired tokens and malformed model outputs.
- Implemented a dual-view document result page showing both raw OCR text and AI-extracted structured output side by side.

**eFax Module**
- Developed a full eFax send/receive module from scratch — sidebar navigation, routing, service layer, pagination, and fax number formatting.
- Added sender/receiver filtering with UI enhancements for clinic-specific customization.

**Appointment Scheduling & Confirmation**
- Built scheduling views with follow-up group filters, `staff_review` field, and `patient_intent` / `ai_status` tracking.
- Integrated FOLLOWUP group into schedule filters; handled multiple schema migrations across branches.

**EHR Integration**
- Created an EHR context and service layer consumed by the Inbox page to sync AI-extracted data into Electronic Health Records.
- Added "synced to EMR" count analytics in bar charts with a manual refresh trigger.

**Multi-tenant Architecture**
- Per-clinic feature flags, RBAC-aware routing, and role-based component rendering — onboarding a new clinic is a config change, not new code.

**Core Platform**
- Built a multi-file upload component with 5 MB limit and batch upload support.
- PDF preview layer (**verified**): **@react-pdf-viewer** (PDF.js) unified component for local uploads and S3-fetched documents — remote URLs converted to blob objects for CORS-safe rendering, with explicit `URL.revokeObjectURL` cleanup preventing memory leaks in the high-volume inbox.
- Structured-data editing on **Zustand + Immer** with immutable field-level updates (⚠ only call this "field-level diff/patch" if a code check confirms actual diff/patch logic, not just immutable spread updates).
- Implemented global patient search (trimmed + lowercased), date range filters, sorting, and full pagination across the inbox.
- Added analytics via **PostHog** (HIPAA-compliant) and build optimisation (code splitting, lazy loading — **~60% initial bundle reduction**).
- Developed a Referral Manager page and profile views.

**Stack:** React 19, Vite, TypeScript, Ant Design, Zustand, Axios, React Router, Framer Motion, @react-pdf-viewer (PDF.js), PostHog, dayjs

---

### Backend — Node.js / TypeScript / AWS

**Core System**
- Built and maintained a TypeScript/Express backend service for automated AI processing of inbound medical faxes and documents for US clinics.
- Designed an end-to-end document ingestion pipeline: PDF/fax → **AWS Textract** extraction → multi-model LLM chain → structured EHR-ready JSON.
- Built **40+ REST endpoints** with JWT + RBAC auth, input validation, and Swagger/OpenAPI documentation across all routes.

**AI & ML Integration**
- Integrated **AWS Bedrock with Claude Sonnet** as the primary model for document understanding — token counting, structured JSON extraction, confidence scoring, and retry logic for malformed outputs.
- Extended Claude context window support up to **1M tokens**; added image path + S3 path support for multimodal document processing.
- Built batch processing with partial success/failure handling and Slack alerting for model job outcomes.
- **Multi-model chain (corrected):** Claude Sonnet via AWS Bedrock as the primary model; GPT-4o as a cross-check (⚠ confirm GPT-4o is actually invoked, and via which API — if not, the real chain is Claude + Amazon Nova Pro only); **Amazon Nova Pro** as the retry fallback on oversized payloads. **~95% classification accuracy** across **40+ medical document categories**, with structured JSON extraction, confidence scoring (low-confidence → human review), and retry logic for malformed outputs.

**Two-stage image compression** (**verified**, `src/utils/imageUtils.ts`)
- Stage 1 `processImageForBedrock`: per-image, triggered when raw size exceeds 3.7 MB (Bedrock's 5 MB limit including base64 overhead) — `sharp` iterative shrink at 85% dimensions, −10%/attempt up to 5 attempts, quality stepped 70→50; BMP/TIFF/SVG converted to PNG.
- Stage 2 `compressBatchForRetry`: triggered on an "input too long" retry when a batch exceeds 15–18 MB — single `scaleFactor = sqrt(target/currentTotal × 0.9)`, parallel resize with a Lanczos3 kernel + PNG level-9. Up to **~80% total reduction** (e.g. 70 MB → 14 MB), then retried on Nova Pro.

**Async Job Processing**
- Architected an **SQS + BullMQ (Redis)** worker queue system for async document and AI job processing with **Dead Letter Queue (DLQ)** handling, idempotency keys, and SNS-triggered retries.
- Built a scheduled DLQ auto-retry sweep and end-to-end pipeline scripts for schedule syncing and job creation — most transient failures (expired tokens, rate limits, brief EHR outages) self-heal before a human ever sees them.
- Batch processing supports partial success — 8/10 documents succeeding isn't blocked by the 2 that failed.
- System processes **1,000+ medical faxes daily** at **99%+ uptime**.

**Patient & EHR Integration**
- Developed a patient matching algorithm (from schedule PDFs) with middle name disambiguation and appointment update logic — prevents duplicate records.
- Integrated with **Medplum EHR** to create appointment requests and sync patient data.

**AI Messaging — SMS Orchestration**
- Built an AI-driven SMS orchestrator supporting opt-in/opt-out compliance, follow-up messages, appointment reminders, and cancellation reasons.
- Integrated with **three SMS providers (Twilio, Telnyx, Vonage)** with provider failover; logic to close historical conversations before starting new AI threads.
- Added multi-clinic mapping for different message templates and appointment types.
- Automated patient outreach flows reduced manual SMS effort significantly.

**Infrastructure & DevOps**
- Built a Slack notification service for fax updates, user login events, SQS processing, and batch job status.
- Implemented email parsing and S3 folder organisation for processed documents.
- Set up JWT authentication with cookie-based sessions and clinic-level access control.

**Code Quality**
- Refactored path manipulation code into a clean utility layer (`PathOperations`, `EditValidation`, `ResultMergeService`) — eliminated duplication across 3 files.
- Encapsulated major services into class-based implementations (`BedrockService`, `UserConsentService`, `PatientService`) for testability.
- Added **Jest + Supertest** configuration for API integration testing on critical document paths.

**Stack:** TypeScript, Node.js, Express, Prisma, PostgreSQL, Redis, BullMQ, AWS (Bedrock, S3, SQS, SNS, Textract, Lambda), Medplum EHR, Twilio, Telnyx, Vonage, Slack API, Claude, GPT-4o, Amazon Nova Pro, JWT, Docker, Swagger

---

### RPA & EHR Automation — Python / Robocorp / FastAPI

**Backend Integration Layer**
- Built the integration layer between the AI backend and the RPA service (`rpa-dev.diagna.ai`) that interacts directly with the clinic's MDLand EHR system.
- Implemented two RPA-triggered workflows:
  - **Fax Upload** — after AI processing, triggers RPA to upload the structured result into the EHR (`POST /api/v1/mdland/fax_upload/queue`).
  - **Schedule Download** — triggers RPA to pull appointment schedules from the EHR (`POST /api/v1/mdland/schedule_download/queue`).
- Built a job status polling service (`jobStatusChecker.ts`) that queries the RPA backend for async job completion and syncs results back.
- Implemented **Redis token caching** for RPA backend auth tokens (access + refresh) with auto-refresh to avoid re-authentication on every request.

**Python RPA Suite (Robocorp)**
- Built an end-to-end RPA system in **Python (Robocorp framework)** to automate workflows on MDLand EHR: OTP/2FA login, patient search, document upload, and schedule download — replacing manual clinical staff effort.
- Developed a **FastAPI backend server** exposing REST endpoints (`/fax_upload`, `/schedule_download`, `/check_status`) to trigger RPA tasks programmatically, with an async execution lock to prevent concurrent runs.
- Implemented a dual authentication system supporting both **JWT Bearer tokens** and a legacy `X-RPA-Verification` header with constant-time comparison for security.
- Designed a job queuing architecture using **Redis + RQ workers** — UUID-tagged tasks with TTL-based result storage for async status polling.
- Engineered robust browser automation with triple-fallback CSS/XPath selectors, 3-retry logic per action, OTP auto-extraction via backend API call, and **headless Playwright-based execution**.
- Built a schedule download pipeline that navigates a deeply nested **iframe-based EHR UI (47+ frames)**, triggers print dialogs, captures the schedule as HTML/MHTML, and uploads artifacts to **AWS S3**.
- Extended patient search to handle middle name variations and fuzzy combinations — improved match rate on real patient records.

**Chrome Extension**
- Created a **React-based Chrome Extension** (floating widget + popup) for browser-side RPA workflow orchestration directly on the EHR page — no need to leave the clinic's existing workflow.

**Testing**
- Wrote a **Playwright test suite** for lab workflow automation on Medplum FHIR EHR — covering specimen creation, multi-observation entry, and diagnostic report generation.

**Architecture**
- Structured the project as a **modular monorepo** with separate layers: API routes, data transformers, automation components, infrastructure utilities, and external client integrations.

**Stack:** Python, Robocorp, Playwright, FastAPI, Redis, RQ, React (Chrome Extension), AWS S3, JWT, MDLand EHR, Medplum FHIR

---

## Oriserve — VoiceGenie.ai
**Role:** Frontend Developer · Sole frontend engineer
**Period:** Dec 2023 – Jan 2025 · Noida

> Sole frontend engineer on a generative-AI voice sales platform. Built the full dashboard, marketing site, and internal tooling solo.

**Product Ownership**
- Designed and built the **entire VoiceGenie platform from 0** as the sole frontend engineer: customer-facing dashboard, marketing site, and internal research tooling.
- Grew the product from **0 → $10K MRR in 11 months** as the only frontend engineer; first enterprise customers closed on this work.

**Campaign Builder**
- Built the full campaign creation flow: configure AI voice scripts, select and segment contact lists, set call schedules, define call objectives (**lead generation, sales, appointment setting**), and monitor per-contact live status in real time.

**Voice Configuration**
- Built a per-campaign voice settings panel: **ElevenLabs** voice selection, **pitch**, **speaking rate**, **AI temperature**, **engagement style**, and **tone** — letting teams tune the AI persona for each use case (cold outreach, warm follow-up, enterprise sales).

**Post-Call Analytics**
- Built a post-call review interface with full **call recordings**, **auto-generated transcripts**, **emotion detection** per call segment, and **AI-extracted entities** (name, email, phone, address, intent signals) surfaced as structured data.

**Internal R&D Dashboard**
- Built an internal analytics platform for the product and research team: **call success rates**, **conversion funnels**, drop-off analysis by script section, and **voice model performance comparisons** — used directly for product iteration and investor demos.

**Onboarding UX**
- Designed and built the end-to-end user onboarding: account setup, workspace config, first-campaign walkthrough, and guided integration steps — reducing **time-to-first-call** for new customers.

**CRM Integrations**
- Connected **HubSpot**, **GoHighLevel**, and **Cal.com**: contact sync, call outcome and entity data logged back to CRM records, and **auto calendar booking** on successful calls — contracts designed end-to-end with no dedicated backend engineer.

**Script Composer**
- Live **@token** variable composer (@name, @appointment, @product) that resolves per-contact at call time — every call personalised dynamically, no hardcoded scripts.

**Performance**
- Cut page load times **30–50%** via code splitting, lazy loading, and caching (Lighthouse-profiled), tied to reduced enterprise churn.

**Stack:** React, Next.js, TypeScript, Material UI / Ant Design, Redux, Tailwind, ElevenLabs, HubSpot, GoHighLevel, Cal.com

---

## MotionStudio — Personal Product (2026)
**Browser-based Remotion-powered video compositor with a full serverless backend.**
React 19 / TypeScript strict · 7 engines · ~5K+ lines · 85+ commits · live demo.

**Frontend**
- Single-mutation-point state: one Zustand aggregate root powers undo/redo with edit coalescing, autosave, and cloud sync — zero per-feature wiring.
- One Remotion component tree unifies editor preview, browser export, and cloud render — WYSIWYG drift eliminated by construction, not convention.
- Frame-accurate timeline: custom frame↔pixel coordinate math, draggable clips, keyframe strip driving a 5-property animation engine (Remotion `interpolate`/`spring`).
- Canvas interactions: drag/resize/rotate via `react-moveable` over composition-space coordinates; 22 lazy-loaded, code-split text animation effects.
- Cross-browser production fixes: contenteditable cursor-reset (React re-rendering DOM selection), autoplay-policy handling for muted preview, `blob:` URL preview/export incompatibility.

**Backend / Infra**
- Serverless render pipeline: Vercel Functions + AWS Remotion Lambda behind a 4-gate guard — JWT → device fingerprint → quota → invoke; failed renders never consume quota.
- Background S3 asset upload so the headless Lambda renderer can fetch media that only exists as a browser-only `blob:` URL — a `storageUrl` is patched onto the asset once the upload completes.
- Supabase auth (Google OAuth / email+password / anonymous guest) + Postgres RLS-scoped project storage.
- 3-endpoint API (`/api/render`, `/api/quota`, `/api/upload-url`) with typed request/response contracts.
- Production fix: Lambda version-drift failure resolved by pinning exact dependency versions across client and render worker.

**Engineering practice**
- Living build-notes / architecture docs; every AI-pair-programmed (Claude Code) design verified against React/Remotion internals before merge; core engines rebuilt by hand to fully own the architecture.
- PostHog + Vercel Analytics across auth/editor/export funnels.

**Stack:** Remotion, React 19, TypeScript, Zustand, Supabase, Vercel serverless, AWS Lambda, S3

---

## Key Numbers (cross-role, verified set)

| Metric | Value | Source / defense |
|---|---|---|
| Medical documents processed daily | 1,000+ | pipeline throughput |
| AI classification accuracy | ~95% across 40+ categories | ⚠ know how it was measured before interviews |
| AWS pipeline uptime | 99%+ | ⚠ know how measured (CloudWatch?) |
| Payload compression | up to ~80% (70 MB → 14 MB) | `imageUtils.ts`, verified |
| Bundle size reduction (FAXFlo) | ~60% | build output |
| Backend endpoints | 40+ | Swagger |
| SMS providers integrated | 3 (Twilio, Telnyx, Vonage) | code |
| Manual outreach reduction (Voice AI) | ~70% | — |
| MRR built (VoiceGenie, 11 months) | $10K | ⚠ be ready to say how you know |
| Page load improvement (VoiceGenie) | 30–50% | Lighthouse |
| MotionStudio | 7 engines, ~5K+ LOC, 85+ commits | repo |

*Dropped from this table: "110+ React components shipped solo" — flagged as a weak/unverifiable metric, not something an interviewer can meaningfully probe.*

---

## Open verification items (answer before interviews / new applications)
1. **GPT-4o** — is it actually invoked in the FAXFlo classification chain, and via which API? If no → remove from all resumes and describe the chain as Claude (Bedrock) + Amazon Nova Pro only.
2. **Immer diff/patch** — is it real diff/patch logic, or just immutable spread updates? Determines whether "field-level diffing" is accurate phrasing anywhere it's used.
3. How was the 95% accuracy number measured; how was 99% uptime known; how do you know the $10K MRR figure — have a real answer ready, not just the number.
4. MotionStudio live demo URL — add the direct link to resumes once the deployment is stable.

---

## Job Application Answer: Most Impactful Backend Project

> Written for a job application form question — plain, human tone. Structured as
> Problem → Approach → Solution → Implementation → Impact → Tech & Skills.
> ⚠ This answer mentions GPT-4o as a cross-check (see Open verification item #1). Confirm actual usage before submitting to a new application — if unconfirmed, swap that clause for "with Amazon Nova Pro as a fallback on oversized payloads."

**Problem**
At my last job (Diagna AI, building a product called FAXFlo), clinics received hundreds of
medical faxes and documents every day — referrals, lab reports, prior authorizations, etc.
Someone on staff had to manually open each fax, read it, and type the patient details into
the EHR system. It was slow, error-prone, and didn't scale as we onboarded more clinics. My
job was to build the backend that could do this automatically, all the way through to the
data actually landing in the EHR.

**Approach**
I broke it down into four parts: get the raw fax into a readable format, turn that into
structured patient data using AI, reliably queue and process all of this in the background at
scale, and then actually get the structured data written into the clinic's EHR system — which
turned out to be its own hard problem, since not every EHR has a usable API. Since faxes
arrive at random times in inconsistent formats, AI output isn't always reliable, and the EHR
write-back had its own failure modes, I knew error-handling and retries had to be designed in
everywhere, not added as an afterthought.

**Solution**
I built an end-to-end pipeline: incoming faxes get pulled from S3, run through AWS Textract
for OCR to extract the raw text, then passed through an AI layer (AWS Bedrock running Claude,
with GPT-4o as a cross-check) that converts that raw text into structured fields — patient
name, DOB, referral info, and a document category out of 40+ possible types. Low-confidence
extractions get flagged for a quick human review instead of going straight into the patient's
chart.

The last mile — actually getting that structured data into the EHR — was the trickiest part,
because the clinic's EHR system (MDLand) doesn't expose a usable API for writing data. So I
built an integration layer that hands off the structured result to an RPA (robotic process
automation) service I also built: it logs into the EHR (handling OTP/2FA), navigates the UI,
and fills in the patient data automatically, essentially replacing what a staff member used to
type in by hand. That job gets queued, and my backend polls for its completion status and
syncs the result back, so the whole thing — fax in, EHR filled out — happens with no manual
step.

**Implementation**
For the async processing, I used SQS in front of BullMQ (backed by Redis) so every document
and every EHR-write job runs as a background job instead of a live request. Each job gets a
retry budget — a few attempts with backoff before we give up on it. If it still fails after
retries, it goes to a Dead Letter Queue instead of just vanishing, which triggers an SNS alert
and a Slack notification, so someone finds out within minutes and can inspect the failure. On
top of that, I built a scheduled auto-retry mechanism that sweeps the DLQ every few hours (on
a cron-style interval) and automatically re-attempts the stuck jobs — a lot of DLQ failures
are transient (a token expired, the EHR was briefly unreachable, Textract rate-limited us), so
by the time the retry sweep runs, the job often just succeeds on its own. That meant most DLQ
entries resolved themselves without anyone touching them, and manual intervention was only
needed for the smaller set of jobs that kept failing after the scheduled retries too. Batches
were also built to support partial success, so if 8 out of 10 documents in a batch process
cleanly, they go through immediately instead of getting stuck waiting on the 2 that failed. On
the EHR side specifically, I used Redis to cache the RPA service's auth tokens (with
auto-refresh) so we weren't re-authenticating on every single job, and built a status-polling
service that checks in on the RPA job until it reports success or failure.

I also built a patient-matching algorithm to link extracted data to existing records without
creating duplicate charts — handling messy real-world stuff like middle-name variants — since
a bad match at this stage means the EHR write-back lands on the wrong patient.

**Impact**
The system processes 1,000+ medical faxes a day at over 99% uptime, with around 95% accuracy
on document classification across 40+ categories. It removed manual data entry end-to-end —
not just extracting the data, but actually getting it filled into the EHR — and the DLQ +
scheduled auto-retry setup meant most failures resolved themselves within hours with zero
manual intervention, with alerting catching only the genuine edge cases that needed a human
look.

**Tech & skills used:**
Node.js, TypeScript, Express, AWS Bedrock (Claude), AWS Textract, GPT-4o, Amazon Nova Pro, SQS,
BullMQ, Redis, SNS, Python (Robocorp, Playwright for the RPA layer), FastAPI, PostgreSQL,
Prisma, Medplum EHR, Docker. Skills: distributed async job architecture with retry/DLQ
handling and scheduled self-healing jobs, LLM integration and prompt reliability, browser
automation/RPA, error handling and observability, and data-matching logic.
