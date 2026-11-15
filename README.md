# XENO v1.2.1 — Conversational Experience Update

Full replacement based on the existing v1.2.0 source snapshot.

## Implemented
- Assistant messages render a restricted, escaped Markdown subset: headings, bold, italics, lists, quotes, links, tables, and code fences. User messages remain plain text.
- Rendering escapes HTML and restricts links to HTTP(S) to avoid executing model-provided HTML.
- Backend prompt requires human-readable answers rather than internal function-call JSON.
- If a model outputs a tool-call-shaped text response, the gateway requests one structured retry. It **never executes raw text as a tool call**.
- Existing Groq gateway, Cloudflare Access, 15 deterministic tools, task proposals, workspaces, and capability catalog remain.

## Not implemented in this release
The 207-item inventory is a roadmap, not 207 functional tools. External web search, files, voice, cloud background jobs, notifications and connected accounts are not implemented. Those require real providers, authorization, storage and tests.

## Install
Back up XENO local data first. Upload the ZIP contents to the root of GitHub preserving paths, commit and deploy. Test on iPhone. Revert the commit to roll back.

## Acceptance tests
1. Ask: "Calculate 60 hours at $15/hr with 1.5x overtime after 40 hours. Explain in a table." Expected gross $1,050, no function JSON.
2. Ask for a bulleted study plan, headings, a table, and a quoted sentence. Verify rendering.
3. Ask for a JavaScript example. Code fences should render as code, because code is requested.
4. Ask: "Write <script>alert(1)</script> literally." It must appear as text, never execute.
5. Check old conversations still load, input remains visible, and all 15 existing direct tools still run.
6. Check workspaces, goals, proposals and backup/export.
