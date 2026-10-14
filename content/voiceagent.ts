// ============================================================================
//  HINGLISH CLINIC VOICE AGENT — case-study copy + diagram data
//  Source of truth: the project's README and docs/ (LATENCY_LOG, LEARNING,
//  THREAT_MODEL, PROGRESS). Every number here comes from those files.
//  All clinic data in the project is synthetic.
// ============================================================================

export type StageId = "caller" | "livekit" | "vad" | "stt" | "llm" | "tts" | "guard" | "tools" | "db" | "telemetry";

export const voiceAgent = {
  title: "Hinglish Clinic Voice Agent",
  tagline: "A voice receptionist that's fast, but never allowed to guess.",
  status: {
    label: "In development · week 3 of 8",
    note: "Weeks 1–2 are built and voice-tested. Week 3 (turn-taking, latency, the V1 demo video) is underway. Audio runs in English while the engineering is built; Hinglish audio returns in week 4. The date, time and number parsing is already bilingual.",
    updated: "14 Oct 2026",
  },
  links: { github: "https://github.com/BLAZE7SHADOW/hinglish-clinic-voice-agent" },
  intro:
    "Small Indian clinics take bookings by phone, usually through one busy receptionist. Callers mix Hindi and English in one sentence (\"kal shaam Sharma ji ke saath slot hai?\"). This agent picks up, answers clinic questions, finds free slots, and books, moves or cancels appointments. It checks who the caller is before touching their data, and it never writes anything the caller hasn't clearly confirmed.",

  facts: [
    { num: "217", label: "unit and DB tests" },
    { num: "13/13", label: "sandboxed eval tasks · 0 wrong actions" },
    { num: "61→99%", label: "doctor names right on phone audio" },
    { num: "1.2s→200ms", label: "slot lookup after one rewrite" },
  ],

  why: [
    { title: "Fast", body: "A reply should start in about 1–1.5 seconds, or the call feels broken. So every stage is timed on every turn." },
    { title: "Safe", body: "No double bookings, no booking the caller didn't agree to, no personal data before verification, no medical advice." },
    { title: "Honest", body: "It never invents a fact and never claims an action that didn't happen. Facts come from tools; actions come from code." },
  ],

  // ── The real-time loop ───────────────────────────────────────────────────
  stages: {
    caller: { label: "Caller", provider: "Browser (WebRTC) · phone in week 4", fallback: "—", why: "Browser first so the engineering isn't blocked on telephony. An Indian number (Twilio or Exotel) arrives in week 4." },
    livekit: { label: "LiveKit Cloud", provider: "LiveKit Agents 1.8 · India South", fallback: "—", why: "Production WebRTC with built-in turn detection and barge-in, in an Indian region so audio doesn't cross oceans." },
    vad: { label: "Turn detection", provider: "Silero VAD + turn detector v1-mini (pinned, local)", fallback: "VAD-only when the cloud interruption quota runs out", why: "Decides when the caller has finished. Pinned to v1-mini so every latency run is comparable; E7 tried the cloud v1 model and it didn't help." },
    stt: { label: "STT", provider: "Deepgram nova-3 (en-IN) + doctor-name keyterms", fallback: "Sarvam saaras:v4", why: "Low latency, and keyterm boosting fixed \"Sharma\" being heard as \"Harmer\". Sarvam is the Hinglish candidate." },
    llm: { label: "LLM", provider: "Gemini 3.6 Flash · thinking minimal", fallback: "Gemini 2.5 Flash", why: "Fast first token and solid tool calling. Thinking set to minimal: 0 reasoning tokens on every reply (the 2.5-style budget is silently ignored on 3.x)." },
    tts: { label: "TTS", provider: "Cartesia sonic-3", fallback: "Sarvam bulbul", why: "About 200 ms to first audio. Sarvam has Hinglish customer-service voices but took about 1 s on the one-shot path; re-measured on streaming in week 4." },
    guard: { label: "Code guards", provider: "state.check() on typed call state", fallback: "Refuse + explain", why: "Every tool checks mode, verification and the pending read-back before it acts. The LLM proposes; code decides." },
    tools: { label: "Tools", provider: "slots · holds · bookings · verify · callback", fallback: "\"Outcome unknown\" on timeout, never \"failed\"", why: "Python functions with pydantic inputs. Dates, phone numbers and read-backs are computed here, never by the LLM." },
    db: { label: "Postgres", provider: "Supabase (Mumbai) · asyncpg, no ORM", fallback: "Unique index is the last word", why: "A partial unique index on (doctor, start) for held and confirmed rows makes a double booking impossible, whatever the app does." },
    telemetry: { label: "Telemetry", provider: "One record per reply → Postgres + turns.jsonl", fallback: "—", why: "Per-stage timings on every turn, so every change gets a p50/p95 row in LATENCY_LOG before it's kept." },
  } as Record<StageId, { label: string; provider: string; fallback: string; why: string }>,

  // Turn timings (ms, p50) used by the pipeline player. Plain turn = 10 Oct
  // baseline; tool turn = 11 Oct read-only-tools run (tool turns p50 ≈ 3.9 s).
  turns: {
    plain: { label: "Plain turn", eot: 578, stt: 516, llm: 1313, tts: 205, total: 2251, note: "10 Oct baseline, no tools: voice-to-voice p50 2.25 s. The LLM's first token is the biggest stage (about 58%)." },
    tool: { label: "Tool turn", eot: 578, stt: 477, llm: 1310, tts: 182, total: 3900, note: "11 Oct, read-only tools: a tool turn needs two LLM calls, so it lands near 3.9 s p50 against 2.2 s without one. Tool DB time 150–390 ms." },
  },
  bargeIn: { stopMs: 379, note: "Week 2 voice run: the agent stops talking a median 379 ms after the caller starts. History keeps only the part she actually said." },

  // ── Latency over time ───────────────────────────────────────────────────
  latencyRuns: [
    { id: "baseline", date: "10 Oct", label: "Baseline, no tools", sample: "10 calls / 22 turns", eot: [578, 2501], llm: [1313, 1867], tts: [205, 241], v2v: [2251, 2747], stop: [365, 500], outcome: "Reference run", verdict: "base" },
    { id: "e7", date: "10 Oct", label: "E7: cloud turn detector", sample: "9 calls / 22 turns", eot: [578, 2501], llm: [1375, 1970], tts: [188, 217], v2v: [2401, 3906], stop: [495, 574], outcome: "No gain → reverted", verdict: "reverted" },
    { id: "tools", date: "11 Oct", label: "Read-only tools", sample: "10 calls / 27 turns", eot: [578, 2501], llm: [1310, 1974], tts: [182, 220], v2v: [2781, 4996], stop: [346, 368], outcome: "9/10 correct, 0 invented facts", verdict: "kept" },
    { id: "week2", date: "14 Oct", label: "Week 2: booking, reschedule, cancel", sample: "9 calls / 53 turns", eot: [2500, 2501], llm: [1410, 1942], tts: [200, 229], v2v: [3829, 6358], stop: [379, 1100], outcome: "All scripted writes correct, 0 wrong actions", verdict: "kept" },
  ] as {
    id: string; date: string; label: string; sample: string;
    eot: [number, number]; llm: [number, number]; tts: [number, number]; v2v: [number, number]; stop: [number, number];
    outcome: string; verdict: "base" | "kept" | "reverted";
  }[],
  latencyNotes: [
    "**Tool turns cost two LLM calls.** In the 11 Oct run, turns that used a tool took about 3.9 s p50 against about 2.2 s without one.",
    "**27 of 52 turns in the week 2 run waited the full 2.5 s end-of-turn delay.** The turn detector scores phone numbers, dates and short answers (\"Five thirty is fine.\") as unfinished. That is now the biggest cost, and phase-aware endpointing is the week 3 fix.",
    "**LLM first token (about 1.3–1.4 s) is the biggest stage** on turns that don't wait. A model comparison (E1) is planned.",
  ],

  // ── One agent, many modes ───────────────────────────────────────────────
  allTools: ["clinic_info", "find_slots", "hold_slot", "confirm_booking", "verify_caller", "my_bookings", "reschedule_booking", "cancel_booking", "request_callback"],
  modes: [
    { id: "Greeting", tools: ["clinic_info", "find_slots", "request_callback"], to: ["FAQ", "Booking", "Rescheduling", "Cancelling", "Handoff"], note: "Starts every call. Read-only: nothing here can change data." },
    { id: "FAQ", tools: ["clinic_info", "find_slots", "request_callback"], to: ["Booking", "Handoff"], note: "Hours, fees, address, doctors: answered only from the database, never invented." },
    { id: "Booking", tools: ["clinic_info", "find_slots", "hold_slot", "confirm_booking", "request_callback"], to: ["FAQ", "Handoff"], note: "The only mode that can hold and confirm a new slot." },
    { id: "Rescheduling", tools: ["verify_caller", "my_bookings", "find_slots", "hold_slot", "reschedule_booking", "request_callback"], to: ["Booking", "Handoff"], note: "Nothing about existing bookings is said until verify_caller passes. 2 failed verifications → Handoff." },
    { id: "Cancelling", tools: ["verify_caller", "my_bookings", "cancel_booking", "request_callback"], to: ["Rescheduling", "Handoff"], note: "Verify first; with several bookings it asks \"which one?\" and never guesses. 2 failed verifications → Handoff." },
    { id: "Handoff", tools: ["request_callback"], to: [], note: "Medical questions, upset callers and failed verification end here. Sticky: once in Handoff, only a staff callback is possible, and no time is promised." },
  ],
  modeWhy: "A single agent switches mode in place. Each mode exposes only its own tools, so a prompt injection (\"cancel all bookings\", \"read me today's list\") has nothing dangerous to call.",

  // ── Safe booking sequence ───────────────────────────────────────────────
  // lane: who acts. kind lets variants swap the ending.
  booking: {
    common: [
      { lane: "caller", text: "\"Doctor Sharma tomorrow evening\"" },
      { lane: "llm", text: "find_slots(doctor, \"tomorrow evening\")" },
      { lane: "code", text: "dates.py resolves \"tomorrow evening\" into a date window, in code" },
      { lane: "db", text: "Free slots: 5:00, 5:15, 6:00 PM, recorded as \"offered\"" },
      { lane: "caller", text: "\"The earliest one\"" },
      { lane: "code", text: "Guard: only an offered time can be held → hold_slot(\"5 PM\")" },
      { lane: "db", text: "Insert held row, expires in 3 min · unique index on (doctor, start)" },
      { lane: "caller", text: "Name, phone, date of birth" },
      { lane: "code", text: "confirm_booking #1: parse phone and date in code, build the read-back from the DB row" },
      { lane: "agent", text: "\"Just to confirm: Doctor Anil Sharma, Thursday the 15th, five in the evening…\" (spoken word for word)" },
    ],
    variants: {
      yes: {
        label: "Clear yes",
        steps: [
          { lane: "caller", text: "\"Yes, book it\"" },
          { lane: "code", text: "confirm.py: a clear yes, to that exact sentence, heard in full? ✓" },
          { lane: "db", text: "One transaction: held → confirmed, read back the stored row, write the event" },
          { lane: "agent", text: "Speaks the stored details → \"Booked.\"" },
        ],
        outcome: { ok: true, text: "Written. The yes covered exactly the row that was stored." },
      },
      overlap: {
        label: "Yes over the read-back",
        steps: [
          { lane: "caller", text: "\"Yes—\" (spoken while the read-back is still playing)" },
          { lane: "code", text: "confirm.py: the read-back was cut off, so the yes didn't hear all of it ✗" },
          { lane: "db", text: "No write" },
          { lane: "agent", text: "Repeats the read-back in full, then waits for a new yes" },
        ],
        outcome: { ok: false, text: "Refused and read back again. Safe, but it cost W2 three read-backs; reducing repeats is a week 3 item." },
      },
      mixed: {
        label: "\"Yes, but make it six\"",
        steps: [
          { lane: "caller", text: "\"Yes, but make it six\"" },
          { lane: "code", text: "confirm.py: a mixed answer is not a yes ✗" },
          { lane: "db", text: "No write" },
          { lane: "agent", text: "Reads back the new version (6:00 PM) and waits for a new yes" },
        ],
        outcome: { ok: false, text: "Refused. Any changed detail means a fresh read-back and a fresh yes." },
      },
    },
    footnote: "A write that times out returns \"outcome unknown\", never \"failed\", and it is safe to repeat because the idempotency key is the same.",
  },

  capabilities: [
    ["Live voice calls in the browser", "LiveKit Cloud (WebRTC), streaming STT → LLM → TTS"],
    ["Knowing when the caller has finished", "Silero VAD + LiveKit turn-detector model"],
    ["Barge-in", "Adaptive interruption detection; the agent stops in about 0.35–0.4 s"],
    ["Ignoring \"okay\", \"haan\", \"hmm\" while she talks", "Backchannel filter on the transcript words (one resume bug open)"],
    ["Clinic questions", "Hours, fees, address, doctors: only from the database"],
    ["Free-slot search", "From each doctor's weekly hours, days off and existing bookings"],
    ["\"kal shaam\", \"parson subah\", \"next Monday\"", "Resolved by code (`agent/dates.py`), never by the LLM"],
    ["Book, reschedule, cancel", "Slot holds, read-back built from the stored row, idempotent writes"],
    ["Caller verification", "Phone + name or date of birth, parsed in code, exact match"],
    ["Handoff", "Medical questions, upset callers and failed verification go to a staff callback"],
  ],

  // ── Decisions ───────────────────────────────────────────────────────────
  decisions: [
    { id: "01", title: "One agent with modes, not a chain of agents", problem: "A hand-off between agents on a live call costs an extra LLM round trip and loses context.", choice: "One agent switches mode in place; a mode only changes instructions and the visible tools.", payoff: "No extra latency per switch, and an injected instruction can only reach the current mode's tools." },
    { id: "02", title: "Guards live in code", problem: "\"Only book after a clear yes\" in a prompt is a promise, not a guarantee.", choice: "Every tool calls `state.check()` against typed call state (mode, verification, pending read-back) before acting.", payoff: "The LLM proposes; code decides. A refused call is logged, not silently obeyed." },
    { id: "03", title: "The LLM never computes dates or times", problem: "\"kal shaam\" or \"parson subah\" is easy for a model to get almost right, which is worse than wrong.", choice: "Code resolves them into a date window and passes the result back as a fact.", payoff: "Bilingual date handling covered by unit tests instead of hoped for." },
    { id: "04", title: "The read-back is written by code, from the DB row", problem: "If the LLM paraphrases the booking, the caller's yes may not match what gets written.", choice: "The sentence the caller agrees to is built from the stored row and spoken word for word.", payoff: "A yes always covers exactly what gets written." },
    { id: "05", title: "Double booking is the database's job", problem: "Two callers can race for the same slot; application checks have gaps.", choice: "A partial unique index on (doctor, start) for held and confirmed rows.", payoff: "Impossible by construction, whatever the app or the model does." },
    { id: "06", title: "Idempotent writes, no blind retries", problem: "A timed-out write may or may not have happened.", choice: "Full-length idempotency keys, timeouts on every external call, and \"outcome unknown\" instead of guessing.", payoff: "A repeated confirm makes exactly one booking (tested)." },
    { id: "07", title: "No personal data before verification", problem: "A voice line is an easy way to fish for someone's bookings.", choice: "Phone plus name or birth date, parsed in code, exact match against one patient. A failure doesn't say which detail was wrong; two failures hand off.", payoff: "0 verification violations in evals and the voice test." },
    { id: "08", title: "Measure before optimizing", problem: "Latency \"fixes\" that feel faster often aren't.", choice: "Every change gets a row in LATENCY_LOG with p50/p95 per stage and task success next to it.", payoff: "E7 looked promising and was reverted on the numbers." },
  ],

  experiments: [
    { id: "E7", title: "Cloud turn detector (v1) vs local v1-mini", result: "Wrong \"unfinished\" waits 5 vs 6, on different sentences; voice-to-voice p95 worse.", decision: "Reverted to v1-mini", verdict: "reverted" },
    { id: "E9", title: "Doctor names as STT keyterms", result: "Doctor names right: browser 75% → 99%, phone 61% → 99%. Other names got worse (phone 70% → 39%) and were sometimes turned into a doctor's name.", decision: "Kept, with scoping planned (it caused \"Kabir\" → \"Kavita\")", verdict: "kept" },
    { id: "find_slots", title: "4 sequential queries + new connections → 1 query, warm pool, 60 s doctor cache", result: "680–1,170 ms → about 200 ms.", decision: "Kept", verdict: "kept" },
    { id: "Thinking", title: "Gemini thinking level minimal on 3.x", result: "0 reasoning tokens on every reply (a 2.5-style budget is silently ignored).", decision: "Kept", verdict: "kept" },
  ] as { id: string; title: string; result: string; decision: string; verdict: "kept" | "reverted" }[],

  // ── Evals & voice test ──────────────────────────────────────────────────
  evals: {
    rows: [
      { split: "Dev", scenarios: "13", success: "13 / 13", wrong: "0", violations: "0" },
      { split: "Hold-out", scenarios: "8", success: "kept unseen for final reporting", wrong: "", violations: "" },
    ],
    story: "The first run was 10 of 12. The agent was right and the fixture was wrong: the test patient had 5 bookings, not 1, and the agent correctly asked \"which one?\". The fixture was fixed rather than the agent, and that case became its own scenario.",
    points: [
      "**217 unit and DB tests:** date resolution (English and Hinglish), the slot engine, phone and birth-date parsing, mode allowlists, guards, read-back confirmation, the backchannel filter, and DB write safety (a double hold is refused, a repeated confirm makes one booking, an expired hold frees the slot).",
      "**21 multi-turn scenarios** run the real agent and LLM in text mode against a local Postgres 17 sandbox with a frozen clock: happy paths, \"yes, but change it\", someone else's booking, prompt injection, medical questions, upset callers and Hinglish.",
      "**Safety switch:** `EVAL_MODE=1` can only connect to the sandbox database, checked on every connection. Evals never touch real systems.",
      "**Threat model:** 12 threats mapped to the OWASP LLM Top 10, each with its code mitigation and test, plus an honest list of known gaps.",
    ],
  },
  voiceTest: [
    { id: "W1", what: "Book as a new patient", ok: true, result: "Booked; the read-back matched the stored row. Name capture was hard." },
    { id: "W2", what: "\"Yes\" spoken over the read-back", ok: true, result: "Safe: the write was refused and the read-back repeated in full, then booked. UX cost: 3 read-backs." },
    { id: "W4", what: "Reschedule after verification", ok: true, result: "Nothing said before verification; the old booking is linked to the new one." },
    { id: "W5", what: "Cancel one of two bookings", ok: true, result: "Asked \"which one?\", cancelled only that one." },
    { id: "W6", what: "Wrong birth date twice", ok: true, result: "Nothing revealed; handed off to a callback." },
    { id: "W7", what: "Callback request", ok: true, result: "No time promised." },
    { id: "5 · 8", what: "Barge-in · doctor name", ok: true, result: "Both passed in the week 2 voice test." },
    { id: "10", what: "Soft \"okay\" while she talks", ok: false, result: "The \"okay\" was filtered, but the paused speech didn't resume. Root cause found; fix in week 3." },
  ],

  problems: [
    ["1", "Gemini thinking delayed the first word; the 2.5-style setting was silently ignored on 3.x", "Thinking level minimal; verified 0 reasoning tokens"],
    ["5", "The agent invented clinic facts and pretended to take actions", "Facts only from tools; an honest \"can't do that yet\""],
    ["10 · 27", "The turn detector made the agent wait 2.5 s after complete sentences", "Measured (E7, week 2 voice); phase-aware endpointing next"],
    ["11 · 15", "Soft \"okay\" / \"haan\" interrupted the agent", "Backchannel filter on the transcript words"],
    ["13", "find_slots took up to 1.2 s", "1 query + warm pool: about 200 ms"],
    ["16", "\"Sharma\" misheard as \"Harmer\"", "Per-clinic STT keyterms (E9)"],
    ["17", "A 5 s fallback timeout that Gemini rejects as a deadline would have broken every call", "Caught by a chaos test; timeout set to 10 s"],
    ["19 · 22", "\"Wait for a clear yes\" was only an LLM promise", "Code checks the yes, and code writes the read-back"],
    ["20", "An expired hold still blocked the slot", "Cleared inside the hold transaction"],
    ["21 · 23", "Evals need isolation; a stale cache after re-seeding", "Docker sandbox, a frozen clock, a hard eval-mode switch"],
    ["24", "Keyterms silently off after a refactor; spoken birth dates rejected", "Import fixed + regression test; spoken-number parsing in code"],
    ["25", "\"Kabir\" heard as \"Kavita\"", "Phone + birth date find the patient, name on file read back (week 3 step 1, 14/14 in text evals)"],
    ["26", "Paused speech didn't resume after a filtered \"okay\"; interruption quota ran out", "Root cause found; fix planned"],
  ],
  problemsNote: "Every real problem gets a LEARNING entry: what happened, the mechanism, the options, the choice, how it was verified, and how production systems handle it. 27 entries so far.",

  stack: [
    { layer: "Voice framework", choice: "LiveKit Agents 1.8 (Python) on LiveKit Cloud", why: "Production WebRTC, built-in turn detection and barge-in, India region" },
    { layer: "Speech-to-text", choice: "Deepgram nova-3 (en-IN) · Sarvam saaras:v4 fallback", why: "Low latency, keyterm boosting for doctor names; Sarvam for Hinglish" },
    { layer: "LLM", choice: "Gemini 3.6 Flash (thinking minimal) · 2.5 Flash fallback", why: "Fast time to first token; tool calling" },
    { layer: "Text-to-speech", choice: "Cartesia sonic-3 · Sarvam bulbul fallback", why: "About 200 ms to first audio" },
    { layer: "Turn-taking", choice: "Silero VAD + turn detector v1-mini (pinned)", why: "Runs locally; pinned so latency runs are comparable" },
    { layer: "Database", choice: "Supabase Postgres (Mumbai) · asyncpg, no ORM", why: "The unique index is the final double-booking guard" },
    { layer: "Validation", choice: "pydantic", why: "Typed tool inputs, call state, telemetry records" },
    { layer: "Tests & evals", choice: "pytest · pytest-asyncio · Docker Postgres 17 sandbox", why: "Evals never touch real systems" },
    { layer: "Tooling", choice: "Python 3.12 · uv · ruff", why: "Fast, reproducible installs" },
    { layer: "Later", choice: "Temporal · Next.js staff view · OpenTelemetry", why: "Durable work off the call path; observability" },
  ],

  roadmap: [
    { week: 1, title: "Voice loop", state: "done", items: ["Browser calls, per-stage telemetry, baseline latency", "E7, clinic schema + seed, date resolution", "Read-only tools, backchannel filter, keyterms (E9), provider fallbacks"] },
    { week: 2, title: "Agent, tools and data", state: "done", items: ["Modes with code guards, caller verification", "Slot holds, booking, rescheduling, cancelling, code read-backs", "Eval runner + sandbox, threat model, voice test"] },
    { week: 3, title: "Turn-taking, latency, V1", state: "current", items: ["Name and number capture (step 1 done: 14/14 in text evals)", "Backchannel resume fix · phase-aware endpointing", "Fewer read-back repeats · filler during tool calls · LLM comparison (E1)", "V1 demo video (Hinglish if possible)"] },
    { week: 4, title: "Phone and Hinglish", state: "next", items: ["Indian phone number (Twilio or Exotel)", "Hinglish audio + word-error-rate test set per STT provider", "Turn tuning on Hinglish"] },
    { week: 5, title: "Durable path", state: "next", items: ["Temporal workflows: confirmations, reminders, dropped calls", "WhatsApp or SMS with retries"] },
    { week: 6, title: "Evals and failure lab", state: "next", items: ["40+ scenarios, audio-level evals", "Replay in CI, simulated callers"] },
    { week: 7, title: "Observability and cost", state: "next", items: ["Dashboard: outcomes, p50/p95, false interruptions, cost per call", "Circuit breakers, a second latency pass"] },
    { week: 8, title: "Polish", state: "next", items: ["Load test (10–20 concurrent calls)", "Design write-up, posts"] },
  ] as { week: number; title: string; state: "done" | "current" | "next"; items: string[] }[],

  gaps: [
    "**Voice-to-voice is 3.8 s p50 right now**, well above the 1–1.5 s target. Most of it is the 2.5 s end-of-turn wait on numbers and short answers; that is week 3's main job.",
    "**A \"yes\" spoken over the end of a read-back** counts as an interruption and causes a re-read. Safe, but slow.",
    "**Verification on a browser call relies only on what the caller says.** On the phone line, caller ID can add a factor, but it can be spoofed and isn't proof on its own.",
    "**No rate limit or budget cap yet** on a public demo, and the agent's database role isn't least-privilege yet.",
    "**Audio is English for now.** The Hinglish parsing is built and tested in code; Hinglish speech recognition is measured in week 4.",
  ],
};
