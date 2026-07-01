<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your portfolio with PostHog analytics. A `PHProvider` client component initializes PostHog via the `posthog-js/react` provider (the correct approach for Next.js 14 App Router), and a reverse proxy is configured in `next.config.js` so tracking requests route through `/ingest` rather than directly to PostHog — improving reliability against ad blockers. A server-side client (`lib/posthog-server.ts`) handles API route tracking via `posthog-node`. Five key portfolio conversion events are now captured across four components and one API route, with a `ResumeButton` client component introduced to make the download buttons trackable from the server-rendered home page.

| Event | Description | File |
|---|---|---|
| `contact_form_submitted` | Visitor submits the contact form — the primary conversion event | `components/ContactForm.tsx` |
| `email_copied` | Visitor copies the contact email address to clipboard | `components/CopyEmail.tsx` |
| `resume_downloaded` | Visitor clicks a resume download button, indicating hiring intent | `components/ResumeButton.tsx` |
| `project_link_clicked` | Visitor clicks the Live or GitHub link on a project card | `app/projects/page.tsx` |
| `contact_message_sent` | Server-side: email successfully sent via Resend | `app/api/contact/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/493070/dashboard/1783396)
- [Contact form submissions](https://us.posthog.com/project/493070/insights/7FUTSE0o)
- [Resume downloads](https://us.posthog.com/project/493070/insights/ydZPiPTZ)
- [Email copies](https://us.posthog.com/project/493070/insights/dbdrSW4U)
- [Project link clicks by project](https://us.posthog.com/project/493070/insights/L4n60tVa)
- [Hiring signals combined](https://us.posthog.com/project/493070/insights/0tYhw4kX)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any deployment environment (Vercel, etc.) so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
