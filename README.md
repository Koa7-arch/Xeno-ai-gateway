# XENO Mobile v0.8.0 — Full Replacement

This is a complete replacement for the v0.7 repository files, retaining the existing mobile UI, profile, local conversations, task approval inbox, and finance tools. It adds a bounded multi-round AI tool engine and an authenticated tool catalog.

## Installation
1. In XENO Settings, **export a JSON conversation backup** before updating. Do not clear Safari or PWA site data.
2. In GitHub `Koa7-arch/Xeno-ai-gateway`, upload all files from this package preserving the directory layout. **Replace** existing files, including `index.js`, `tools-v06-backend.js`, and `public/index.html`. **Add** `tool-engine-v08.js` and `public/xeno-tool-engine-v08.js`.
3. Commit. Wait for your existing Cloudflare deployment to finish. Do not change existing Cloudflare Access configuration, secrets, or bindings.
4. On your iPhone, close and reopen XENO. Check header v0.8.0 and Tools > AI Tool Engine. Refresh the tool catalog.
5. Test: ask XENO to calculate gross earnings for 60 hours at $15 with 1.5× after 40 hours, then project 12 deposits of $500 from a $3000 balance. Expected $1050 gross and $9000 projected balance. Ask it to show both tool results.

## What's new
- Up to **4 tool-call rounds**, **8 total tool calls**, **3 per round**; validated allowlist and JSON arguments; bounded result sizes.
- A final tool-free synthesis call when the fourth round uses tools, to avoid losing the final answer.
- `/tools/catalog` authenticated read-only metadata; visible in the Tools workspace.
- Existing tool activity and task proposals remain compatible with v0.7.
- All existing v0.7 finance, calculator, conversion, and date tools remain available.

## Security and limits
- No general shell, browsing, network tool, financial transaction, or autonomous scheduled actions.
- Task proposals remain **approval-only**, and actual task creation is device-local.
- Tools are deterministic, not a general autonomous agent; the model chooses which of the existing tools to invoke.
- Each multi-round request can increase Groq usage and hit free-tier limits. No paid service is added by this package.
- Local conversations and profile are **not** converted into cloud storage or altered by this release.
- No live deployment is claimed; validate on your own Cloudflare deployment.

## Files
`index.js`, `tool-engine-v08.js`, `tools-v06-backend.js`, `wrangler.jsonc`, `public/` (existing app plus new tool engine UI), and this README.
