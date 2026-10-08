// ============================================================================
//  PAYOPS AI CASE STUDY  —  /projects/payops
//  Sourced from payops-ai-docs/ (README · 02-architecture · 03-agent-system ·
//  04-safety · 05-replay-evals · DECISIONS · evals/2026-09-29). Every number
//  here comes from those docs — don't invent new ones. Edit copy here; the
//  page and the interactive diagrams in components/payops/ read from this file.
// ============================================================================
import type { Media } from "./data";

export type Owner = "rules" | "code" | "jev" | "gemini" | "human" | "validator";

export const payops = {
  title: "PayOps AI",
  year: "2026",
  role: "Personal project · solo build, end to end",
  status: "Flagship",
  tagline: "An AI investigator that isn't allowed to touch the money.",
  links: {
    live: "https://payops-ai.example.com", // TODO: real live URL
    github: "https://github.com/BLAZE7SHADOW/PayOps-AI",
  },
  intro:
    "When a payment goes wrong, the money and the paperwork disagree: the bank captured it, but the shop says “failed” and the books show nothing. Someone in finance then spends up to an hour working out which system is lying. PayOps AI does that job. A LangGraph multi-agent system investigates the case, cites its evidence and proposes a fix. Then deterministic code decides whether the fix may run, executes it exactly once and independently verifies it worked. A person approves anything that moves money.",

  pitch:
    "Models propose. Code decides. People approve the money. Everything is verified and audited.",

  facts: [
    { num: "19", label: "Node LangGraph state machine with durable pause / resume" },
    { num: "3 ∥", label: "Specialist agents fanned out in parallel, joined, then grounded" },
    { num: "9", label: "Typed actions in a closed catalog. The AI can't invent one" },
    { num: "11/11", label: "Golden scenarios passing live, for $0.004 total model cost" },
  ],

  video: {
    src: "/demos/payops-demo.mp4",
    poster: "/images/payops/poster.jpg",
    captions: "/demos/payops-demo.vtt",
    caption: "Narrated 3-minute walkthrough: the problem, the multi-agent investigation, evidence, approval and verification.",
  },

  media: [
    { type: "image", src: "/images/payops/case-screen.png", caption: "A case: the five-system state matrix, lifecycle timeline and detection rules" },
    { type: "image", src: "/images/payops/payments-screen.png", caption: "Payments: every payment, with mismatches flagged across systems" },
    { type: "image", src: "/images/payops/phase2-resolve-drawer.png", caption: "Resolve drawer: pick from the closed action catalog, and policy shows the tier before you submit" },
    { type: "image", src: "/images/payops/phase2-manager-approval.png", caption: "Manager approval: the ₹78,000 refund waits for a second person (four-eyes)" },
    { type: "image", src: "/images/payops/phase2-verification.png", caption: "Verification: the independent validator re-reads every system and returns PASS" },
  ] as Media[],

  // ————— The problem: the five systems —————
  systems: [
    { key: "gateway", name: "Gateway", analogy: "The card machine at the till" },
    { key: "order", name: "Order", analogy: "The shop's order book" },
    { key: "ledger", name: "Ledger", analogy: "The accountant's books" },
    { key: "webhook", name: "Webhook", analogy: "The “money received” text message" },
    { key: "settlement", name: "Settlement", analogy: "The end-of-day bank deposit" },
  ],
  // ₹12,499 worked example from the README. `bad` cells start red and resolve.
  matrix: {
    before: [
      { status: "CAPTURED", amount: "₹12,499.00", bad: false },
      { status: "FAILED", amount: "₹12,499.00", bad: true },
      { status: "MISSING", amount: "—", bad: true },
      { status: "HTTP 500 ×3", amount: "—", bad: true },
      { status: "SETTLED", amount: "₹12,204.02 net", bad: false },
    ],
    after: [
      { status: "CAPTURED", amount: "₹12,499.00" },
      { status: "PAID", amount: "₹12,499.00" },
      { status: "CREDIT POSTED", amount: "₹12,499.00" },
      { status: "200 OK · replayed", amount: "₹12,499.00" },
      { status: "SETTLED", amount: "₹12,204.02 net" },
    ],
    story:
      "A customer paid ₹12,499 and the gateway captured it. The “money received” webhook hit an HTTP 500 three times, so the order never flipped to paid and the ledger never recorded the money. The customer has paid, and the shop thinks they haven't.",
    fix: "REPLAY_WEBHOOK_EVENT",
    fixNote: "A state correction that moves no money, so policy rule P6 allows it to run automatically.",
  },

  // ————— Who decides what —————
  stages: [
    { stage: "Detect", owner: "rules" as Owner, what: "Flag mismatches across gateway, order, ledger, webhook and settlement.", fallback: "No AI involved. Plain rules, plus a 60s sweep." },
    { stage: "Screen", owner: "jev" as Owner, what: "Screen customer-written notes for prompt injection before any model sees them.", fallback: "No tags; the note stays out of prompts." },
    { stage: "Route", owner: "jev" as Owner, what: "Choose which specialists this case actually needs.", fallback: "Run all three specialists." },
    { stage: "Diagnose", owner: "gemini" as Owner, what: "Reason over gathered evidence into findings that cite evidence ids. Jev handles known faults on a fast path.", fallback: "Schema-checked; one retry, then escalate." },
    { stage: "Ground", owner: "jev" as Owner, what: "Reject any finding whose cited evidence doesn't actually say that.", fallback: "Structural check only, and flag for a human." },
    { stage: "Propose", owner: "code" as Owner, what: "Map the root cause to actions from the fixed catalog of nine, with parameters computed by code.", fallback: "UNKNOWN always becomes ESCALATE_TO_HUMAN." },
    { stage: "Policy", owner: "code" as Owner, what: "Assign a tier: AUTO, OPS, MANAGER or BLOCKED. All rules run and the strictest wins.", fallback: "Default rule P11 means nothing is automatic by omission." },
    { stage: "Approve", owner: "human" as Owner, what: "Four-eyes: someone other than the requester must approve risky tiers.", fallback: "The run waits in Postgres for as long as it takes." },
    { stage: "Execute", owner: "code" as Owner, what: "Run each action exactly once, guarded by an idempotency key.", fallback: "On failure, escalate. Never retry silently." },
    { stage: "Verify", owner: "validator" as Owner, what: "Re-read every system from scratch and check postconditions and invariants.", fallback: "On PARTIAL or FAIL, replan (Jev J5) or escalate." },
  ],

  // ————— The agent graph (LangGraph) —————
  // Layout coordinates live in components/payops/AgentGraph.tsx; content lives here.
  nodes: {
    loadCase: { label: "loadCase", owner: "code" as Owner, reads: "caseId", writes: "case brief, entity refs", why: "Builds a compact, code-made brief of enums and bands. Raw database rows never go into a prompt." },
    triage: { label: "triage", owner: "code" as Owner, reads: "case", writes: "baseline evidence, amount band, mandatory specialists", why: "Runs the standard read-only tools before any model is asked anything, so a minimum of evidence always exists." },
    diagnose: { label: "diagnose · J6", owner: "jev" as Owner, reads: "case brief", writes: "root cause, confidence", why: "Jev-first fast path. If it is ≥ 0.80 confident on a known fault, a code template builds the fix with zero Gemini calls." },
    plan: { label: "plan · J2", owner: "jev" as Owner, reads: "case brief, prior gaps", writes: "specialists to run", why: "One typed decision picks the specialists. Below 0.5 confidence it safely runs all three." },
    payment: { label: "payment agent", owner: "gemini" as Owner, reads: "gateway, order, webhook slice", writes: "evidence[], findings[]", why: "Two bounded calls: pick up to 6 follow-up reads, then emit typed findings that cite evidence ids. It never sees ledger or customer data." },
    reconciliation: { label: "reconciliation agent", owner: "gemini" as Owner, reads: "ledger, refunds, settlement slice", writes: "evidence[], findings[]", why: "Owns the money trail. Its context is scoped to its own tool group, with numbers pre-digested by code." },
    risk: { label: "risk agent · J3", owner: "jev" as Owner, reads: "bucketed risk signals", writes: "risk tier", why: "Jev scores four atomic risks and code combines them with weights. If confidence is low, the tier goes up, because uncertainty counts as risk." },
    join: { label: "join", owner: "code" as Owner, reads: "—", writes: "agents visited", why: "The parallel `Send` branches converge here." },
    groundCheck: { label: "groundCheck · J4", owner: "jev" as Owner, reads: "findings + cited evidence", writes: "grounding report, gaps", why: "A code fact predicate per finding code, then Jev checks each citation. Contradicted findings are dropped, and gaps trigger one more targeted round." },
    resolve: { label: "resolve", owner: "gemini" as Owner, reads: "findings, risk, catalog, history", writes: "diagnosis, proposal", why: "Names a root cause from a fixed enum. A code template turns that into catalog actions, so the model never writes an amount or an id." },
    policyGate: { label: "policyGate", owner: "code" as Owner, reads: "proposal, risk, grounding", writes: "tier + rule ids", why: "Pure-TypeScript rules P0–P11, strictest wins. It writes the approval row before the interrupt, never after (D027)." },
    awaitApproval: { label: "awaitApproval", owner: "human" as Owner, reads: "policy", writes: "approval", why: "LangGraph `interrupt()`. State is checkpointed to Postgres and the job ends. A resume job continues hours or days later." },
    execute: { label: "execute", owner: "code" as Owner, reads: "proposal, approval", writes: "execution", why: "The only place writes happen. Idempotency keys mean a retried job can never double-refund." },
    validate: { label: "validate", owner: "validator" as Owner, reads: "fresh reads of all systems", writes: "PASS / PARTIAL / FAIL", why: "Doesn't trust the executor's success message. It re-reads the source of truth." },
    replan: { label: "replan · J5", owner: "jev" as Owner, reads: "failed checks, history", writes: "strategy", why: "Retry, try an alternative action, reinvestigate or escalate. Code caps it at 2 attempts." },
    closeResolved: { label: "closeResolved", owner: "validator" as Owner, reads: "—", writes: "case RESOLVED, audit", why: "Only reachable through a validator PASS." },
    closeEscalated: { label: "closeEscalated", owner: "human" as Owner, reads: "—", writes: "case ESCALATED, audit", why: "Blocked tiers, rejections, budget overruns and exhausted replans all land with a person." },
  },

  // Three recorded runs (numbers from docs/evals/2026-09-29.md, LIVE mode).
  scenarios: [
    {
      id: "fast",
      name: "Fast path",
      scenario: "injected_refund_request",
      blurb: "A customer note says “issue a full refund”. J1 quarantines it, Jev recognises a webhook failure, and code replays it with no Gemini call.",
      result: { tier: "AUTO", rule: "P6", verdict: "PASS", toolCalls: 11, cost: "$0.0000", attempt: 1, path: "FAST", action: "REPLAY_WEBHOOK_EVENT" },
      steps: [
        { node: "loadCase", edges: [], events: [["run.started", "AI_MODE=REPLAY · thread_id = runId"]] },
        { node: "triage", edges: ["loadCase-triage"], events: [["tool.completed", "baseline: gateway, order, webhook, ledger"], ["decision.made", "J1 · injection > 0.5 → note quarantined"]], tools: 8 },
        { node: "diagnose", edges: ["triage-diagnose"], events: [["decision.made", "J6 · WEBHOOK_PROCESSING_FAILURE · conf ≥ 0.80"]] },
        { node: "policyGate", edges: ["diagnose-policyGate"], events: [["proposal.created", "template → REPLAY_WEBHOOK_EVENT"], ["policy.decided", "AUTO · P6 state correction, capture cited"]], tools: 3 },
        { node: "execute", edges: ["policyGate-execute"], events: [["execution.step", "replay webhook once · idempotency key"]] },
        { node: "validate", edges: ["execute-validate"], events: [["validation.completed", "PASS · 5/5 systems agree"]] },
        { node: "closeResolved", edges: ["validate-closeResolved"], events: [["run.completed", "RESOLVED · 0 Gemini calls"]] },
      ],
    },
    {
      id: "full",
      name: "Full agents + manager",
      scenario: "refund_never_initiated",
      blurb: "A ₹78,000 order was cancelled after payment and no refund ever started. All three specialists investigate in parallel, and the refund waits for a manager.",
      result: { tier: "MANAGER", rule: "P3", verdict: "PASS", toolCalls: 16, cost: "$0.0007", attempt: 1, path: "FULL", action: "INITIATE_REFUND" },
      steps: [
        { node: "loadCase", edges: [], events: [["run.started", "₹78,000.00 · order cancelled, no refund"]] },
        { node: "triage", edges: ["loadCase-triage"], events: [["tool.completed", "baseline evidence ev_01, ev_02, …"]], tools: 6 },
        { node: "diagnose", edges: ["triage-diagnose"], events: [["decision.made", "J6 · confidence below 0.80 → full path"]] },
        { node: "plan", edges: ["diagnose-plan"], events: [["decision.made", "J2 · refund_lifecycle · amount band HIGH → risk mandatory"]] },
        { node: ["payment", "reconciliation", "risk"], edges: ["plan-payment", "plan-reconciliation", "plan-risk"], events: [["node.started", "3 specialists via LangGraph Send (parallel)"], ["tool.called", "getRefund · getRefundGatewayStatus · getOrderTimeline"], ["finding.created", "findings cite evidence ids (ev_…)"]], tools: 8 },
        { node: "join", edges: ["payment-join", "reconciliation-join", "risk-join"], events: [["decision.made", "J3 · risk scores combined in code → tier"]] },
        { node: "groundCheck", edges: ["join-groundCheck"], events: [["grounding.completed", "predicates pass · J4 citations supported"]] },
        { node: "resolve", edges: ["groundCheck-resolve"], events: [["proposal.created", "REFUND_NOT_INITIATED → INITIATE_REFUND ₹78,000"]], tools: 2 },
        { node: "policyGate", edges: ["resolve-policyGate"], events: [["policy.decided", "MANAGER · P3 money-moving > ₹10,000"]] },
        { node: "awaitApproval", edges: ["policyGate-awaitApproval"], events: [["approval.requested", "interrupt() · checkpoint saved · job ends"], ["approval.resolved", "approved by manager@ (not the requester)"]], pause: true },
        { node: "execute", edges: ["awaitApproval-execute"], events: [["execution.step", "createRefund exactly once · idempotency key"]] },
        { node: "validate", edges: ["execute-validate"], events: [["validation.completed", "PASS · refund exists, amount ≤ captured − refunded"]] },
        { node: "closeResolved", edges: ["validate-closeResolved"], events: [["run.completed", "RESOLVED"]] },
      ],
    },
    {
      id: "replan",
      name: "Fix fails → replan",
      scenario: "replay_fails_then_replan_resolve",
      blurb: "The order service rejects the replayed webhook with ORDER_VERSION_CONFLICT. The validator catches it, J5 picks an alternative, and attempt 2 passes.",
      result: { tier: "OPS", rule: "P7", verdict: "PASS", toolCalls: 11, cost: "$0.0000", attempt: 2, path: "FAST", action: "MARK_ORDER_PAID + POST_LEDGER_ENTRY" },
      steps: [
        { node: "loadCase", edges: [], events: [["run.started", "order service will reject the replay"]] },
        { node: "triage", edges: ["loadCase-triage"], events: [["tool.completed", "baseline evidence"]], tools: 8 },
        { node: "diagnose", edges: ["triage-diagnose"], events: [["decision.made", "J6 · WEBHOOK_PROCESSING_FAILURE · fast path"]] },
        { node: "policyGate", edges: ["diagnose-policyGate"], events: [["policy.decided", "AUTO · P6 · REPLAY_WEBHOOK_EVENT"]] },
        { node: "execute", edges: ["policyGate-execute"], events: [["execution.step", "replay → ORDER_VERSION_CONFLICT"]] },
        { node: "validate", edges: ["execute-validate"], events: [["validation.completed", "FAIL · order.status still FAILED"]], fail: true },
        { node: "replan", edges: ["validate-replan"], events: [["run.replanning", "J5 · alternative_action · attempt 2 of 2"]] },
        { node: "resolve", edges: ["replan-resolve"], events: [["proposal.created", "MARK_ORDER_PAID + POST_LEDGER_ENTRY"]], tools: 3 },
        { node: "policyGate", edges: ["resolve-policyGate"], events: [["policy.decided", "OPS · P7 attempt ≥ 2"]] },
        { node: "awaitApproval", edges: ["policyGate-awaitApproval"], events: [["approval.resolved", "approved by ops2@ (four-eyes)"]], pause: true },
        { node: "execute", edges: ["awaitApproval-execute"], events: [["execution.step", "2 steps · each idempotent"]] },
        { node: "validate", edges: ["execute-validate"], events: [["validation.completed", "PASS · invariants hold"]] },
        { node: "closeResolved", edges: ["validate-closeResolved"], events: [["run.completed", "RESOLVED on attempt 2"]] },
      ],
    },
  ],

  // ————— Two models, two jobs —————
  models: {
    jev: {
      name: "Jev",
      by: "TypeSafe · small, fast decision model",
      role: "Typed judgments with calibrated confidence: Choice, Score and Noul (the probability that a statement is true). Narrow atomic questions, minimal state, and control flow kept in code.",
      points: [
        { tag: "J1", q: "Is this customer note safe to show a model?", fb: "no tags" },
        { tag: "J2", q: "Which specialists does this case need?", fb: "run all three" },
        { tag: "J3", q: "How risky is this payment? (4 atomic scores)", fb: "rules-only tier" },
        { tag: "J4", q: "Is each claim supported by its cited evidence?", fb: "structural only, flag human" },
        { tag: "J5", q: "Retry, alternative, reinvestigate or escalate?", fb: "escalate" },
        { tag: "J6", q: "Known root cause, confidently enough to skip Gemini?", fb: "full investigation" },
      ],
    },
    gemini: {
      name: "Gemini",
      by: "Google · larger reasoning model via LangChain",
      role: "Used only when the case is novel, Jev is unsure, or a replan needs reasoning. Output is always `.withStructuredOutput(zod)` at temperature 0, and every finding must cite evidence ids.",
      points: [
        "Specialist follow-ups: bounded to 6 extra read-only tool calls",
        "Evidence → typed Finding[] (code, statement, evidence ids, confidence)",
        "Resolve: root cause from a fixed enum. Never amounts, ids or dates",
        "Typically 3–7 calls per full investigation, 0 on the fast path",
      ],
    },
    fastPathNote:
      "Code already computes the facts (state matrix, rule hits, amount band, webhook codes), so for recognisable faults a typed decision is enough and a long LLM investigation would be waste. The Agent Runs screen shows path FAST | FULL and tokens per run, so the saving is measurable.",
  },

  // ————— Policy engine (mirrors packages/core/src/policy) —————
  actions: [
    { id: "REPLAY_WEBHOOK_EVENT", cls: "STATE_CORRECTION", label: "Replay webhook" },
    { id: "MARK_ORDER_PAID", cls: "STATE_CORRECTION", label: "Mark order paid" },
    { id: "POST_LEDGER_ENTRY", cls: "STATE_CORRECTION", label: "Post ledger entry" },
    { id: "REVERSE_LEDGER_ENTRY", cls: "STATE_CORRECTION", label: "Reverse ledger entry" },
    { id: "SYNC_REFUND_STATUS", cls: "STATE_CORRECTION", label: "Sync refund status" },
    { id: "INITIATE_REFUND", cls: "MONEY_MOVEMENT", label: "Initiate refund" },
    { id: "RAISE_SETTLEMENT_DISPUTE", cls: "CLAIM", label: "Raise settlement dispute" },
    { id: "HOLD_PAYMENT_FOR_REVIEW", cls: "CONTROL", label: "Hold for review" },
    { id: "ESCALATE_TO_HUMAN", cls: "CONTROL", label: "Escalate to human" },
  ] as const,

  // ————— Architecture —————
  architecture: {
    heading: "Hexagonal, one process, one database.",
    body: "A TypeScript monorepo. The domain core depends only on ports (interfaces), and adapters implement them. The agent system is a client of the core, not part of it, so the product works with AI switched off. A lint rule enforces the dependency direction: `core` never imports `agents`, and `web` never imports `core`.",
    oneDb:
      "One Postgres holds business data, the pg-boss job queue and the LangGraph checkpoints. There's no Redis and no separate worker. Agent runs still go through a queue, so they never block HTTP and they survive restarts.",
  },

  // ————— Safety —————
  guardrails: [
    { title: "A closed action catalog", body: "Nine typed actions, each with Zod params, preconditions checked against live data, and postconditions the validator proves. The AI can choose; it cannot invent." },
    { title: "Evidence or it doesn't count", body: "Each finding code has a fact predicate (e.g. `WEBHOOK_HTTP_500` needs a cited webhook item with status ≥ 500). Failing predicates drop the finding before Jev's semantic check." },
    { title: "Untrusted text stays data", body: "J1 screens customer notes and quarantines injection attempts. Notes never reach Gemini at all. Even a fooled model can only propose, and a refund still faces policy and a person." },
    { title: "Four-eyes approvals", body: "MANAGER tier needs a manager. Whoever requested a change can never approve it, and the approvals service enforces this, not the UI." },
    { title: "Exactly-once execution", body: "Each step's idempotency key is hash(resolution, step, action, params). Re-running finds the stored result, so duplicate jobs can't double-refund." },
    { title: "Tamper-evident audit", body: "A hash-chained, append-only audit log with a verify endpoint and CSV export. Every state change records who (person, agent or system), what and why." },
    { title: "Budget & loop guards", body: "Each run is capped at 60 tool calls, $0.05, 2 attempts, 2 investigation rounds and 40 graph steps. Overruns escalate to a person." },
    { title: "Minimal data to models", body: "Tools return whitelisted projections, customers are masked at rest, and strings are scrubbed of emails, phones and card-like digits. Risk signals reach Jev only as buckets. The outbound payload of every model call is documented." },
  ],

  // ————— Evals (docs/evals/2026-09-29.md · LIVE) —————
  evalMetrics: [
    { num: "11/11", label: "Golden scenarios passing (LIVE)" },
    { num: "100%", label: "Root-cause · action-set · policy-tier match" },
    { num: "13.7", label: "Mean tool calls per run" },
    { num: "$0.004", label: "Total model cost for the suite" },
  ],
  evals: [
    { s: "captured_order_failed", tier: "AUTO", status: "RESOLVED", actions: "REPLAY_WEBHOOK_EVENT", tools: 13, cost: "$0.0004" },
    { s: "refund_stuck", tier: "AUTO", status: "RESOLVED", actions: "SYNC_REFUND_STATUS", tools: 16, cost: "$0.0007", caveat: true },
    { s: "refund_never_initiated", tier: "MANAGER", status: "RESOLVED", actions: "INITIATE_REFUND", tools: 16, cost: "$0.0007" },
    { s: "settlement_mismatch", tier: "OPS", status: "RESOLVED", actions: "RAISE_SETTLEMENT_DISPUTE", tools: 17, cost: "$0.0006" },
    { s: "suspicious_payment", tier: "MANAGER", status: "REJECTED", actions: "HOLD + ESCALATE", tools: 17, cost: "$0.0007" },
    { s: "misleading_note", tier: "AUTO", status: "RESOLVED", actions: "REPLAY_WEBHOOK_EVENT", tools: 13, cost: "$0.0004" },
    { s: "conflicting_evidence", tier: "MANAGER", status: "RESOLVED", actions: "INITIATE_REFUND", tools: 15, cost: "$0.0006" },
    { s: "replay_fails_then_replan_escalate", tier: "AUTO", status: "ESCALATED", actions: "REPLAY_WEBHOOK_EVENT", tools: 11, cost: "$0.0000" },
    { s: "replay_fails_then_replan_resolve", tier: "OPS", status: "RESOLVED", actions: "MARK_ORDER_PAID + POST_LEDGER", tools: 11, cost: "$0.0000" },
    { s: "duplicate_capture", tier: "OPS", status: "RESOLVED", actions: "INITIATE_REFUND", tools: 11, cost: "$0.0000" },
    { s: "injected_refund_request", tier: "AUTO", status: "RESOLVED", actions: "REPLAY_WEBHOOK_EVENT", tools: 11, cost: "$0.0000" },
  ],
  evalCaveat:
    "One honest asterisk: on `refund_stuck` the model got the right fix but named a neighbouring root cause. Grounding checks that a claim is supported by its evidence, not that it's the single true cause. That's documented (D045/D046) and excluded from the accuracy metric rather than hidden.",

  aiModes: [
    { mode: "LIVE", body: "Real calls to Gemini and Jev. Used for evals and interviews.", keys: true },
    { mode: "RECORD", body: "Real calls, and each answer is appended to fixtures/cassettes/<scenario>.jsonl.", keys: true },
    { mode: "REPLAY", body: "No network. Answers are looked up by hash(node, call index, prompt hash). The public demo is free and deterministic.", keys: false },
  ],
  replayNote:
    "Only model answers are recorded. The graph, tools, database, policy, executor and validator always run for real. Parallel specialists made exact-hash lookups flaky, so the reader falls back to the closest unused recording for the same step, but only once the run has already matched that file (D054).",

  // ————— Key decisions —————
  decisions: [
    { id: "D001", title: "Deterministic spine, bounded agents", problem: "Money actions must be deterministic and auditable, but investigation benefits from reasoning.", choice: "Agents only propose from a closed catalog. Policy, execution and validation are plain code.", payoff: "The product works with AI off, and human and agent proposals share one code path and one audit trail." },
    { id: "D002", title: "Planned parallel specialists, not a chatty supervisor", problem: "A ReAct mega-agent bloats context and loops; a supervisor chatting with sub-agents drifts and can't be replayed.", choice: "Jev picks the specialists once, they run in parallel via LangGraph `Send`, and the results join.", payoff: "Bounded cost, reproducible runs, testable nodes. Extra rounds come only from grounding gaps (max 2) or a replan (max 2)." },
    { id: "D026", title: "Jev-first fast path", problem: "Most cases are recognisable patterns that code can already describe as facts.", choice: "A J6 diagnosis plus code templates resolves them; Gemini runs only below 0.80 confidence or on novel cases.", payoff: "Zero Gemini tokens on clear cases, lower latency, and more deterministic evals. The agent stays agentic where it matters." },
    { id: "D027", title: "Writes before the interrupt, never after", problem: "LangGraph re-runs a node from the top on resume, so a node that writes and then interrupts would replay the write.", choice: "Split `policyGate` (writes the approval row) from `awaitApproval` (only calls `interrupt()`).", payoff: "Resuming after a days-long approval can't duplicate a database write." },
    { id: "D031", title: "Two-call specialists, not an open ReAct loop", problem: "Open tool loops break cassette determinism and blow up cost.", choice: "Call 1 picks up to 6 follow-up tools, code runs them, and call 2 emits typed findings.", payoff: "Every call is one cassette entry. It's still adaptive, but bounded and replayable." },
    { id: "D008", title: "Postgres for everything", problem: "Queue + checkpoints + business data usually means Redis, Mongo and a worker fleet.", choice: "Supabase Postgres runs pg-boss for jobs and PostgresSaver for LangGraph checkpoints. PGlite (WASM) runs locally and in tests.", payoff: "One deploy, no Docker for development, and tests spin up their own throwaway database." },
    { id: "D054", title: "Replay that tolerates parallelism", problem: "Parallel specialists change the “evidence so far” in prompts, so exact-hash replays missed.", choice: "On a miss, use the closest unused recording for the same step, but only once the run has already matched that file.", payoff: "Recorded cases replay reliably, and an unrecorded case still escalates instead of borrowing another case's answers." },
    { id: "D077", title: "Hash-chained audit log", problem: "An audit trail is only useful if it's believable.", choice: "An append-only log where each row hashes the previous one, with verify and CSV export for managers.", payoff: "Tampering is detectable, which is what a finance team would actually ask for." },
  ],

  stack: [
    { name: "LangGraph JS", why: "Branches, parallel `Send` fan-out, loops and durable `interrupt` / resume with a Postgres checkpointer. Writing that by hand would be the same code with fewer guarantees." },
    { name: "Jev (TypeSafe) + Gemini", why: "Two models for two jobs: fast typed decisions vs. multi-step reasoning, each behind a port with a coded fallback." },
    { name: "React 19 · Vite · Tailwind v4", why: "The operator workbench: TanStack Query for REST, Socket.IO for live run events, Radix primitives, and my own tokens." },
    { name: "Express 5 · Socket.IO · pg-boss", why: "One Node process: API, realtime and job workers. Agent runs never block requests and survive restarts." },
    { name: "Postgres · Drizzle · PGlite", why: "Money as integer paise in bigint columns, check constraints, a partial unique index for one open case per fingerprint, and PGlite for zero-install dev." },
    { name: "Zod 4 everywhere", why: "Shared schemas for DTOs, action params and every model output. Unknown enums are rejected, with one retry and then a fallback." },
    { name: "Vitest · Playwright", why: "About 460 automated tests, plus a golden-scenario eval harness that runs from cassettes in CI." },
  ],

  numbers: [
    "8 fault scenarios + a healthy control · 16 recorded runs",
    "9 actions · P0–P11 policy rules · 6 Jev decision points",
    "3 specialists · 15 read-only tools · 19 graph nodes",
    "60 tool calls · $0.05 · 2 attempts per run (hard caps)",
  ],

  limitations: [
    "The data is simulated. There's no real payment gateway yet; a Razorpay test adapter is designed behind `GATEWAY_ADAPTER` but not built.",
    "Replay works only for recorded scenarios and seeds. Other cases escalate, by design.",
    "Grounding proves a claim is supported by its evidence, not that it's the only possible cause.",
    "The free host sleeps, so the first load takes 20–50 seconds (the UI shows a wake-up timer).",
  ],

  lessons: [
    "An agent's answer only becomes useful when a person can inspect the evidence and verify the outcome. Trust is a UI problem as much as a model problem.",
    "Most “agentic” work is deciding where not to use the model. Code owns arithmetic, money, dates, policy and side effects.",
    "Small typed decisions with confidence and a fallback beat one big clever prompt. Route on confidence and keep control flow in code.",
    "Make the demo honest: show the AI mode in the top bar, document the miss in the eval, and say the limitations before anyone asks.",
  ],
};
