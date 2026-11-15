# XENO v1.2.0 — Capability Inventory & Integrated Core

This is a **full repository replacement ZIP** based on the v1.0.1 source snapshot. It retains the existing Groq chat, Cloudflare Access gateway, 15 deterministic tools, task proposals, adaptive workspaces, goals, and local on-open reminders.

## What v1.2 actually adds

- A searchable, categorized master inventory of **all requested capabilities** with explicit status.
- A copyable system acceptance prompt inside the Capability Center.
- Clear distinction between implemented, partial, integration-required, and not-implemented items.
- A new service-worker cache namespace.

**It does not magically implement every item in the roadmap.** Live search, document/media analysis, voice, cloud background automations, external APIs, iPhone push, and payment or financial account actions require separate implementations, permissions, and often provider credentials. Do not use the catalog as evidence that these are functional.

## Deploy

1. Back up conversations and unified workspace data in XENO.
2. Upload the files in this ZIP to the root of the existing GitHub repository, preserving paths.
3. Do not upload the ZIP itself as a repository file.
4. Commit and wait for Cloudflare to deploy.
5. Refresh XENO; open **Capabilities** from the navigation.
6. Copy the acceptance prompt and run it in Chat. Test individual category tools as well.

## Important limitations

- Local storage is device/browser scoped; it is not cloud-synced memory.
- On-open reminders do not execute when the browser is closed.
- Task proposals require explicit approval; a proposal is not a completed task.
- Inventory status is a conservative development estimate, not a substitute for device-level acceptance tests.
- API costs depend on your existing Groq usage and limits. No new paid provider is configured.

## Rollback

Revert the GitHub commit and redeploy. Keep your local backups.
