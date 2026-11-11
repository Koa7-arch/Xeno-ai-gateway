# XENO Mobile v0.3 — STAGED UPGRADE (do not deploy yet)

This package replaces the gateway repository files and adds `public/` static assets. Existing GitHub Pages remains untouched. Cloudflare Access MUST protect both production and preview Worker URLs before deploying.

## Required Cloudflare Worker settings BEFORE upload

- Secret `GROQ_API_KEY` — retain existing value.
- Text `ACCESS_TEAM_DOMAIN` — your Cloudflare Access team domain, e.g. `myteam.cloudflareaccess.com` (no `https://`).
- Text `ACCESS_AUD` — the Access application **AUD tag** (not its name or ID).
- The existing `XENO_ACCESS_TOKEN` and `ALLOWED_ORIGIN` may remain in Cloudflare but are not used by v0.3. Do not expose them.
- Ensure the existing Access application covers **all** Worker URLs and has an Allow policy restricted to your email. Test the Worker in a private tab before uploading.

## Deploy

Only after the two new variables are configured, upload the contents of this package to the private `Xeno-ai-gateway` GitHub repository, preserving `public/` as a directory. GitHub-connected Cloudflare deployment should start automatically. Confirm `/health` returns version `0.3` after Access login. Then visit the Worker root `/` in Safari, sign in if prompted, test chat, and use Safari Share > Add to Home Screen for a **new** installation. Do not delete the old GitHub Pages installation yet.

## Notes

- Chat history stays in each origin's localStorage; it does not automatically migrate from GitHub Pages.
- Cloudflare Access email login and PWA cookie/session behavior on iPhone require real-device testing.
- The Worker verifies Access JWT signatures with Cloudflare's public JWKS and checks issuer, audience, and expiry. It fails closed if settings are missing.
- This is a personal hobby prototype, not a production-hardened service. Add Cloudflare rate limiting/usage limits before heavy usage.
- Service worker caches only approved static assets after checking response content type; API responses are never cached.
