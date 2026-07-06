# Work Experience Summary — Shivam Govind Rao
> Reference doc for resume variations, job applications, and cover letters.
> All details are accurate; pick/combine bullets per role or JD.

---

## Diagna AI — FAXFlo
**Role:** Software Development Engineer (Full-Stack)
**Period:** Jan 2025 – April 2026 · Gurugram

---

### Frontend — React (Vite · TypeScript · Ant Design · Zustand)

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

**Core Platform**
- Built a multi-file upload component with 5 MB limit, batch upload support, and S3-URL PDF preview.
- Implemented global patient search (trimmed + lowercased), date range filters, sorting, and full pagination across the inbox.
- Added analytics via **PostHog** (HIPAA-compliant) and build optimisation (code splitting, lazy loading — **~60% bundle reduction**).
- Developed a Referral Manager page and profile views.
- Built **110+ React components** solo across the entire platform.

**Stack:** React 19, Vite, TypeScript, Ant Design, Zustand, Axios, React Router, Framer Motion, PDF.js, PostHog, dayjs

---

### Backend — Node.js / TypeScript / AWS

**Core System**
- Built and maintained a TypeScript/Express backend service for automated AI processing of inbound medical faxes and documents for US clinics.
- Designed an end-to-end document ingestion pipeline: PDF/fax → **AWS Textract** extraction → **AWS Bedrock (Claude)** AI processing → structured EHR data.
- Built **40+ REST endpoints** with JWT + RBAC auth, input validation, and Swagger/OpenAPI documentation across all routes.

**AI & ML Integration**
- Integrated **AWS Bedrock with Claude Sonnet** as the primary model for document understanding — token counting, structured JSON extraction, confidence scoring, and retry logic for malformed outputs.
- Extended Claude context window support up to **1M tokens**; added image path + S3 path support for multimodal document processing.
- Built batch processing with partial success/failure handling and Slack alerting for model job outcomes.
- Multi-model chain: **Claude (Sonnet) + GPT-4o + AWS Bedrock** achieving **~95% classification accuracy** across **40+ medical document categories**.

**Async Job Processing**
- Architected an **SQS + BullMQ (Redis)** worker queue system for async document and AI job processing with **Dead Letter Queue (DLQ)** handling and SNS-triggered retries.
- Built a scheduled polling service and end-to-end pipeline scripts for schedule syncing and job creation.
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
- Added **Jest + Supertest** configuration for API integration testing.

**Stack:** TypeScript, Node.js, Express, Prisma, PostgreSQL, Redis, BullMQ, AWS (Bedrock, S3, SQS, SNS, Textract, Lambda), Medplum EHR, Twilio, Telnyx, Vonage, Slack API, Claude AI, OpenAI, JWT, Docker, Swagger

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

**Stack:** Python, Robocorp, Playwright, FastAPI, Redis, RQ, Robocorp, React (Chrome Extension), AWS S3, JWT, MDLand EHR, Medplum FHIR

---

## Oriserve — VoiceGenie.ai
**Role:** Frontend Developer
**Period:** Dec 2023 – Jan 2025 · Noida

> Sole frontend engineer on a generative-AI voice sales platform. Built the full dashboard, marketing site, and internal tooling solo.

**Product Ownership**
- Designed and built the **entire VoiceGenie platform from 0** as the sole frontend engineer: customer-facing dashboard, marketing site, and internal research tooling.
- Grew the product from **0 → $10K MRR in 11 months** as the only frontend engineer.

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
- Connected **HubSpot**, **GoHighLevel**, and **Cal.com**: contact sync, call outcome and entity data logged back to CRM records, and **auto calendar booking** on successful calls.

**Script Composer**
- Live **@token** variable composer (@name, @appointment, @product) that resolves per-contact at call time — every call personalised dynamically, no hardcoded scripts.

**Performance**
- Cut page load times **30–50%** via code splitting, lazy loading, and caching.

**Stack:** React, Next.js, TypeScript, Material UI / Ant Design, Redux, Tailwind, ElevenLabs, HubSpot, GoHighLevel, Cal.com

---

## Key Numbers (cross-role)

| Metric | Value |
|---|---|
| React components shipped solo | 110+ |
| Medical documents processed daily | 1,000+ |
| AI document classification accuracy | ~95% |
| Medical document categories | 40+ |
| MRR built (VoiceGenie, 11 months) | $10K |
| Bundle size reduction (FAXFlo) | ~60% |
| Manual outreach reduction (Voice AI) | ~70% |
| Page load improvement (VoiceGenie) | 30–50% |
| AWS pipeline uptime | 99%+ |
| Backend endpoints | 40+ |
| SMS providers integrated | 3 (Twilio, Telnyx, Vonage) |

---

## Job Application Answer: Most Impactful Backend Project

> Written for a job application form question — plain, human tone. Structured as
> Problem → Approach → Solution → Implementation → Impact → Tech & Skills.

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
Node.js, TypeScript, Express, AWS Bedrock (Claude), AWS Textract, GPT-4o, SQS, BullMQ, Redis,
SNS, Python (Robocorp, Playwright for the RPA layer), FastAPI, PostgreSQL, Prisma, Medplum
EHR, Docker. Skills: distributed async job architecture with retry/DLQ handling and scheduled
self-healing jobs, LLM integration and prompt reliability, browser automation/RPA, error
handling and observability, and data-matching logic.
