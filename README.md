# XENO v1.3.1 — Autonomous Diagnostics Engine

Full replacement of v1.3.0. Preserve the directory paths when uploading to the existing GitHub repository. Cloudflare Access, GROQ_API_KEY, ACCESS_TEAM_DOMAIN, and ACCESS_AUD remain configured in Cloudflare; do not place secrets in GitHub.

## New functionality

- Authenticated `POST /diagnostics/run` accepts `{ "mode": "quick" | "full" | "regression" }` with same-origin and JSON checks.
- New **Diagnostics** tab runs backend fixtures automatically, compares outputs, displays pass/fail/skip/blocked, and exports a privacy-safe JSON report.
- Quick runs a small core subset. Full and Regression currently run the same comprehensive deterministic suite; Regression is a baseline for later releases, not a change-aware comparison.
- No user memory, tasks, integrations, or production data are modified by the tests.
- No AI API calls or paid service requests are made by diagnostics. Provider configuration is checked without sending a live prompt.

## Install from iPhone

1. Back up XENO conversations and workspaces first.
2. Unzip this archive; upload/replace files into `Koa7-arch/Xeno-ai-gateway` with folder paths intact.
3. Commit and wait for Cloudflare deployment. Reopen the installed PWA (relaunch if an old version is cached).
4. Check header `v1.3.1`, open **Diagnostics**, and select **Full Diagnostics**.
5. Tap **Export JSON Report** and upload the downloaded report to ChatGPT. Alternatively use **Copy Summary**.

## Limitations

- A pass verifies deterministic backend tool results for test fixtures, not the entire AI agent conversation or iPhone browser.
- Live chat formatting, background automation, connected services, and push delivery are reported as skipped when not testable.
- A configured Groq key does not prove the provider is reachable; no paid request is made.
- Self-tests do not automatically edit, deploy, or repair production code.
- For rollback, redeploy the prior v1.3.0 package. Local storage keys are unchanged.
