# Persistent Cloudflare Access settings

`wrangler.jsonc` now includes the two values from your Cloudflare screenshots in the top-level `vars` section. They will be part of the version-controlled Worker configuration and redeploy with it.

- `ACCESS_TEAM_DOMAIN`: `damp-cake-d02f.cloudflareaccess.com`
- `ACCESS_AUD`: `44cfcfb8fb546deab8a2757845bb2c425393a0566218e428fe89ea58485ff152`

**Important:** These are Cloudflare Access configuration identifiers, not API secrets. If this repository is public, anyone can read them. They do not by themselves bypass Access, but you may prefer keeping the audience identifier private. If you prefer that, store these as dashboard variables instead and do not include `vars` in public source.

**To deploy:** Replace the repository's root `wrangler.jsonc` with the updated file from this ZIP and commit it. Cloudflare's GitHub-connected Wrangler deployment should then apply these `vars`. Do not replace the existing Access application or its policies. Verify `/health` after deployment.

**Other required bindings:** D1 `DB`, R2 `FILES`, and assets `ASSETS`. This file does not invent D1 database IDs or R2 bucket names; keep those connected to your existing resources. Groq and Gemini keys must remain Worker secrets and should NEVER be added to Wrangler `vars` or committed to GitHub.

**Note:** If Cloudflare dashboard values differ from `wrangler.jsonc`, deployment configuration may overwrite the dashboard values. Use this file as the single source of truth for these two settings.
