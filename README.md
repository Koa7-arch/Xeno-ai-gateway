# XENO v1.0.1 — Integrated Stable Release (candidate)

This replaces the v1.0 frontend while preserving the existing Groq/Cloudflare Worker, existing local chat/profile storage keys, 15 direct deterministic tools, and AI task proposal approval.

## Fixes
- Chat composer is recovered when navigating from Home, Manage, Memory, Tools, or Conversations to Chat; iPhone-safe layout and 16px input.
- All 15 executable deterministic tools remain grouped in category pages with readable outputs. Duplicate tools across categories are intentional.
- Organization category links to the existing task manager and approval area; it is not a new backend action.
- Memory navigation exposes existing conversations and profile instead of nonfunctional Soon buttons.
- Existing adaptive workspaces, goals, settings, local on-open reminders, and data backup remain intact.
- Header version is v1.0.1. This is a candidate release until live iPhone testing is completed.

## Install
1. Back up conversations (Settings → Export), profile and unified data (Manage → Settings → Export unified data).
2. Upload/replace the contents of this ZIP into the root of the existing GitHub repo, **not the ZIP itself**. Preserve `public/` and the root Worker files.
3. Commit and wait for Cloudflare deployment. Ensure the build points to the correct branch and repository.
4. Reload XENO, confirm header v1.0.1, and test the acceptance checklist.

## Acceptance tests
1. Home → Chat: input and Send visible above bottom navigation. Type and send a message.
2. Chat → Manage → Chat: input still visible. Repeat from Tools, Memory, Conversations.
3. Tools → Finance → Overtime Pay: 60 hours, $15/hour, 40-hour threshold, 1.5 multiplier = **$1,050 gross**, readable result.
4. Tools → Work & Field → Work Shift Hours: 05:30 to 17:30, 30-minute break = **11.5 paid hours**.
5. Tools → Organization → Open task manager: create a local task; confirm it appears on Home.
6. Manage → Workspaces: create a workspace, add goal, switch focus, and test chat context sharing setting.
7. Manage → Automations: create a reminder, verify it only triggers when app opens; pause/delete.
8. Export a backup before testing import; verify old conversations remain.

## Scope and limitations
This is the complete **offline/local core plus existing AI gateway and deterministic tools**, not a finished general-purpose ChatGPT equivalent. No web search, file uploads/analysis, image understanding, email, Discord, external calendars, real background jobs, push notifications, or voice conversation are implemented. These require additional integration, consent, credentials and/or infrastructure. Do not enter real financial or personal secrets into unconnected tools. Existing memory is local profile/conversations; no new cloud memory was added.

No new paid services, permissions, or autonomous external actions are introduced. Test against the live deployment before considering it production-ready.
