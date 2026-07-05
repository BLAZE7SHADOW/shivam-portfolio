// ============================================================================
//  MOTIONSTUDIO CASE STUDY  —  /projects/motionstudio
//  Sourced from ARCHITECTURE.md. Edit this file to grow the page over time.
//  Add demo videos/screenshots to `media` (files go in /public/demos).
// ============================================================================
import type { Media } from "./data";

export const motionstudio = {
  title: "MotionStudio",
  status: "In development",
  year: "2026",
  role: "Personal project · solo build",
  tagline: "A browser-based video editor, built on Remotion.",
  intro:
    "Place text, images, video and audio on a canvas, arrange them on a frame-accurate timeline, animate them, and export to MP4 / WebM / GIF / MOV — entirely in the browser, no backend. This page is the living build journal: the architecture, the decisions, and the bugs that taught me something.",

  // Drop demo videos / screenshots here as the build progresses.
  media: [
    { type: "image", src: "/images/MotionStudio.png", caption: "The editor today — canvas, properties panel, frame-accurate timeline" },
  ] as Media[],

  facts: [
    { num: "~3.8K", label: "Lines of strict TypeScript" },
    { num: "7", label: "Engines — data & logic, zero UI" },
    { num: "60", label: "Logically-grouped commits" },
    { num: "0", label: "Backend services — fully client-side" },
  ],

  // ————— Why Remotion is the foundation —————
  remotion: {
    heading: "Why Remotion is the core bet",
    body:
      "The product renders real video. Remotion gives me frames as a first-class unit, <Sequence> for temporal composition, <Player> for in-app preview, and renderMedia for the actual encode — building a renderer and encoder myself would be months of work that teaches nothing about this product. The interesting engineering is everything I built on top of it:",
    points: [
      "**Frame-based temporal model** — every element carries `startFrame` + `durationInFrames`, mapped 1:1 onto `<Sequence from={startFrame}>`. Visibility is the half-open window `[start, start + duration)`. Frames, not seconds, because Remotion is frame-based and frames are exact — no floating-point drift.",
      "**One shared renderer = guaranteed WYSIWYG** — the editor preview and the Remotion export call the *same* style function, differing only by a `scale` argument (editor < 1, Remotion = 1). WYSIWYG isn't \"we tried to match\" — the preview is *mathematically* the export.",
      "**Animation on Remotion's primitives** — `interpolate` with `extrapolate: 'clamp'` so animations finish instead of extrapolating to infinity, and `spring` for physics (it needs `fps`, because a bounce is real-time). Multiple animations accumulate into one transform — factors multiply, offsets add — the same algebra compositors use.",
      "**Export via the Remotion CLI** — Remotion renders in Node (headless Chrome + FFmpeg), not the browser. A `registerRoot` entry exposes the composition, `calculateMetadata` derives size/fps/duration per project, and the in-app Export dialog generates the exact `npx remotion render` command plus a `props.json`. Formats via `--codec` (h264 / vp8 / gif / prores).",
      "**DOM video vs Remotion video** — the editor previews with a DOM `<video>` (seek on scrub for exact frames, play natively during playback, muted for reliable autoplay); the export uses `<OffthreadVideo>`, which is authoritative.",
    ],
  },

  // ————— Tech stack, with the why —————
  stack: [
    { name: "Remotion", why: "Frames, <Sequence>, <Player>, renderMedia — the video engine. The one dependency the product is genuinely built around." },
    { name: "React 19 + TypeScript (strict)", why: "Discriminated-union element types; adding a new element type = one type + one renderer." },
    { name: "Zustand", why: "Global state with zero boilerplate: one create() → a hook + selectors. No providers, no reducers." },
    { name: "React Router v7", why: "/ dashboard, /editor/:projectId — the URL is the single input that selects a project." },
    { name: "react-moveable", why: "Drag/resize/rotate handles are a solved problem; rebuilding them is weeks of hit-testing math that teaches nothing about this product." },
    { name: "Tailwind v4 + shadcn/ui", why: "Fast, consistent dark UI via design tokens; accessible primitives (Dialog, Popover, Select) without reinventing them." },
    { name: "IndexedDB + localStorage", why: "Client-only persistence, split by data shape: small JSON state in localStorage, large media blobs in IndexedDB." },
  ],

  // ————— Architecture —————
  architecture: {
    heading: "Two layers, one rule",
    diagram: `engines/   own DATA + LOGIC   (no UI)
features/  own UI             (compose engines)`,
    rule:
      "The Project is the aggregate root. One Project object owns all data — elements, assets, settings. Engines don't keep their own copies; they expose verbs that read and write the one Project through a single mutation point (updateProject). Everything downstream falls out of this: undo/redo hooks the one mutation point and covers every edit automatically, autosave persists the one Project with nothing to wire per-feature, and state drift is impossible because there's only ever one source of truth.",
    movesTitle: "The three data moves — immutability everywhere",
    moves: `add     → [...arr, x]
remove  → arr.filter(x => x.id !== id)
update  → arr.map(x => x.id === id ? { ...x, ...patch } : x)`,
    movesWhy:
      "React and Zustand detect change by reference identity, and undo snapshots must stay frozen. A single .push() would skip re-renders and corrupt history.",
  },

  engines: [
    { name: "project", owns: "The projects array (aggregate root) + undo history + persistence", note: "The only real store" },
    { name: "editor", owns: "Ephemeral view state: selection, current frame, playing, zoom", note: "Deliberately not persisted" },
    { name: "canvas", owns: "Verbs: addText/Image/Video/Audio, updateElement, removeElement, reorderLayer", note: "A hook, not a store — owns no data" },
    { name: "timeline", owns: "Pure frame ↔ pixel math", note: "Stateless helpers" },
    { name: "animation", owns: "interpolate / spring evaluation + presets", note: "Pure functions" },
    { name: "rendering", owns: "The shared style.ts + Remotion MotionComposition", note: "One renderer, two consumers" },
    { name: "asset", owns: "Upload, metadata probing, blob persistence", note: "Reads/writes project.assets" },
  ],
  enginesWhy:
    "Why some engines are stores and others are hooks: a store owns state (Project, Editor). A hook owns verbs over state it doesn't hold — Canvas and Asset read the active project and write back via updateProject. Keeping element data on the Project, not in the Canvas engine, is the aggregate root enforced.",

  // ————— Core systems —————
  systems: [
    {
      title: "Composition-space coordinates",
      body:
        "Elements are stored in output resolution (16:9 = 1920×1080), not screen pixels; the editor renders a scaled view. The export must match the editor — store coordinates once at final resolution and every view (editor at ~50%, Remotion at 100%) just multiplies by its own scale. This one conversion powers canvas dragging, drop-to-canvas, and scrubbing.",
      code: `data → screen : × scale   (shrink to fit the window)
screen → data : ÷ scale   (grow a drag back to real coords)`,
    },
    {
      title: "Timeline coordinate math",
      body:
        "The same idea, on the time axis. Dragging a clip to retime it is updateElement(id, { startFrame }) — the same verb as canvas dragging, through the same door.",
      code: `pxPerFrame  = trackWidth / totalFrames
frameToX(f) = f × pxPerFrame          (draw a clip / ruler tick)
xToFrame(x) = round(x / pxPerFrame)   (scrub / drag)`,
    },
    {
      title: "Time-based playback clock",
      body:
        "Playback advances by real elapsed time × fps, not currentFrame++ per animation frame. requestAnimationFrame fires at the monitor's rate — 60 or 120Hz, dropping under load — so frame++ would play 30fps content at 60fps on a 60Hz screen. Measuring wall-clock time keeps speed correct on any hardware.",
    },
    {
      title: "Persistence, split by data shape",
      body:
        "Object URLs die on reload, so the bytes are persisted and a fresh URL is minted each session. localStorage can't hold large binaries; IndexedDB is built for Blobs. Editor view state is intentionally not persisted — you don't want to reopen frozen mid-playback.",
      code: `metadata (JSON, small)  → localStorage via Zustand persist
media bytes (binary)    → IndexedDB`,
    },
    {
      title: "Undo/redo — snapshots + coalescing",
      body:
        "History is snapshots of the projects array. Because edits build new objects immutably, snapshots share unchanged sub-objects — no deep copies. Rapid edits within ~500ms coalesce into one step, so a whole drag or a typing burst is one undo. It was nearly free to build, because every edit already flows through updateProject.",
    },
  ],

  // ————— Problems & fixes (the war stories) —————
  problems: [
    {
      problem: "Omit on a discriminated union silently collapses to common fields — updateElement lost content, assetId, and friends with no error.",
      fix: "An ElementPatch type: the intersection of per-member partials, so every field of every union member is patchable.",
    },
    {
      problem: "Remotion's <Composition> inferred props as unknown. An interface isn't assignable to Record<string, unknown> — it could be augmented later; a type alias is.",
      fix: "Changed interface ExportProps to type ExportProps. One keyword, fixed inference.",
    },
    {
      problem: "contenteditable cursor jumped to the start on every keystroke — React re-rendering the element reset the DOM selection.",
      fix: "Set initial text via a ref on mount only, then let onInput push to the store without React re-writing the node.",
    },
    {
      problem: "react-moveable under a scaled canvas: element coords are composition-space but the stage is scaled, so handles and elements disagreed.",
      fix: "Drive drag/resize with client-pixel deltas ÷ scale, committing composition coords on release.",
    },
    {
      problem: "Layer reorder did nothing. The first attempt shuffled array order — but stacking is driven by zIndex, not array order.",
      fix: "Rewrote it to reassign contiguous zIndex values.",
    },
    {
      problem: "Undo restored dead blob: URLs — asset rehydration went through updateProject and entered history.",
      fix: "Rehydration became a silent update ({ history: false }).",
    },
    {
      problem: "White-on-white text: default text color was #ffffff on a white canvas. Invisible, and no error anywhere.",
      fix: "A default that contrasts with the canvas — and a lesson that \"no crash\" ≠ \"correct.\"",
    },
  ],

  // ————— Honest limitations —————
  tradeoffs: [
    "Export is terminal-based — a true in-browser render needs a backend or Lambda; Remotion can't render inside a tab.",
    "Uploaded media in exports needs real file paths in props.json — blob: URLs are browser-only.",
    "Editor audio/video preview is muted and autoplay-dependent; the export is authoritative for sound and timing.",
    "No scene grouping yet — sequencing is done by positioning clips on the timeline.",
    "Fonts fall back to system sans-serif in the Node render (not bundled yet).",
  ],

  payoffs: [
    { decision: "Project as aggregate root", payoff: "Undo/redo + autosave added at one point, covered everything" },
    { decision: "Engines own verbs, not state", payoff: "No state drift; features stayed thin and composable" },
    { decision: "One shared renderer", payoff: "WYSIWYG guaranteed, not hoped for" },
    { decision: "Composition-space coords", payoff: "Editor preview = export, at any zoom" },
    { decision: "Frames + <Sequence>", payoff: "Timeline maps directly onto Remotion; export just works" },
    { decision: "Immutable updates", payoff: "Cheap undo (structural sharing) + reliable re-renders" },
    { decision: "Discriminated-union elements", payoff: "New element type = one type + one renderer" },
  ],

  lessons: [
    "A single mutation path is a superpower — it's what made undo, autosave, and WYSIWYG cheap. Decide where data changes before deciding how.",
    "Store data in the target domain (output resolution, frames), not the view's units — views come and go, the data shouldn't.",
    "\"No error\" isn't \"correct\" — white-on-white text and silent Omit-on-union both shipped zero warnings.",
    "Buy the boring parts (moveable handles, encoding) and build the parts that are actually your product: the composition model, the timeline, the animation system.",
  ],
};
