# XENO v0.9.0 — AI-Callable Tool Suite

Full replacement source package based on v0.8.0. Replace matching files in the GitHub repository while retaining the directory structure. Export your conversation backup first. Keep Cloudflare secrets and Access configuration unchanged.

## Included

15 direct, deterministic calculation/utility tools (the existing six plus nine new tools; see `/tools/catalog`), plus `propose_task` (approval-only). The new tools: loan_payment, goal_timeline, compound_growth, budget_summary, fuel_trip_estimate, work_shift_hours, date_offset, split_expense, text_statistics. AI multi-round execution and tool activity are preserved. The new Tools screen panel has a JSON argument tester for all direct tools and a searchable catalog; the existing guided finance forms remain available.

## Deployment

1. In XENO, export a JSON conversation backup.
2. Unzip and upload all project files to `Koa7-arch/Xeno-ai-gateway` (replace matching paths). Do not put files under an extra enclosing folder.
3. Commit and allow Cloudflare Workers to redeploy.
4. Open XENO from its Home Screen shortcut; refresh/relaunch if the old build is cached.
5. Check `/health` (authenticated), then Tools > AI Tool Suite.
6. Test the example in the suite, then ask XENO to use `loan_payment` and `goal_timeline` in one conversation.

## Security and boundaries

No browsing, email, calendar, device, bank, Discord, phone calls, or notifications are claimed. No arbitrary network fetch, code execution, or external side effects. `propose_task` does not create a task without approval. Existing local memory/profile/conversations are not migrated or overwritten by this source update. All financial outputs are estimates, not professional advice. No new paid services.

The suite is a substantial set of *local deterministic tools*, not literally every conceivable AI capability. External integrations and actions require separate authenticated connectors and permission design.
