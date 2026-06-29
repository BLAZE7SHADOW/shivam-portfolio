# Demo media

Drop your blurred screenshots and demo videos here, then list them in each project's
`media` array in content/data.ts. You can add as many as you like per project.

Example for FAXFlo (multiple items):

  media: [
    { type: "image", src: "/demos/faxflo-dashboard.png", caption: "Operational dashboard" },
    { type: "image", src: "/demos/faxflo-inbox.png",     caption: "Clinical document inbox" },
    { type: "image", src: "/demos/faxflo-kanban.png",    caption: "Referral workflow Kanban" },
    { type: "video", src: "/demos/faxflo-triage.mp4",    caption: "eFax triage in action" },
    { type: "video", src: "/demos/faxflo-voice.mp4",     caption: "Voice-AI scheduling loop" },
  ],

The first item is the main frame; the rest appear as clickable thumbnails.
Blur any PHI / patient data before adding. Empty array => "demo coming soon" placeholder.
