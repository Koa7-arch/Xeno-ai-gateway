# XENO v1.0 — Unified Adaptive Core

## Deployment
1. Export your existing XENO conversation backup and save your profile separately. Export the v1.0 unified data after first use.
2. Upload **all files in this archive** to the root of `Koa7-arch/Xeno-ai-gateway`, preserving paths. Replace existing files. Do not delete unrelated repository files.
3. Commit and wait for the existing Cloudflare Workers GitHub deployment.
4. Open XENO, confirm `v1.0.0` and `/health` reports `1.0.0`. Open **Manage** in bottom navigation or **Workspaces & Automations** on Home.
5. Create a workspace, set goals, switch focus, adjust settings, test a tool, and send a chat message.

## Features
- Preserves v0.9.3 Groq chat, 16 tool definitions (15 direct tools + task proposal), category tools, and existing local conversation/profile storage.
- Adds active workspaces, goals, user-adjustable style, local activity log, workspace backup/import, and user-controlled sharing of workspace context to the chat backend.
- Adds local on-open reminders and optional creation of local tasks. **These do not run in the background**. No remote notifications, external account actions, or scheduled Cloudflare execution are included.
- Explicitly displays unavailable integration capabilities. No new paid services or secrets.

## Privacy and limitations
- Workspace and automation data is saved to browser localStorage on the current device. It is not cross-device cloud memory. Clearing site data deletes it without a backup.
- Workspace context is sent to Groq **only if** workspace context sharing is enabled and a chat message is sent. This is separate from existing profile awareness.
- Automation scheduling is device-local and checks when the app loads; it does not guarantee on-time background execution. Recurring reminders skip missed intervals.
- Existing profile and conversations have separate export/import systems.
- This is a unified **core**, not a claim of completed email, calendar, web search, voice, push, or background automation integrations.
- Keep Cloudflare Access configured; `GROQ_API_KEY`, `ACCESS_TEAM_DOMAIN`, and `ACCESS_AUD` remain required.

## Smoke test
1. `/health` shows version `1.0.0`.
2. Finance → Overtime Pay returns readable `$1,050` for 60 hours at $15/hr, 40h threshold, 1.5×.
3. Create two workspaces; switch focus and confirm independent goals.
4. Enable workspace context sharing; ask XENO which workspace is active. Disable it and verify it is no longer transmitted in chat requests.
5. Create a local reminder due in one minute, close and reopen the app after it is due; confirm activity log records the trigger.
6. Export unified data and preserve your conversation backup.

## Rollback
Restore the v0.9.3 files from your GitHub commit history. Existing local conversation/profile storage keys were not changed.
