# XENO v0.9.2 — Category navigation repair

This is a **targeted replacement** for the existing v0.9.1 installation.

Replace the following files in the GitHub repository, preserving their paths:

- `public/index.html`
- `public/xeno-violet.js`
- `public/xeno-tool-suite-v09.js`
- `public/sw.js`

Do not upload the ZIP itself. Commit the four files and wait for Cloudflare deployment.

## What changed
- Removed legacy category click handlers and misleading “More tools planned” badges.
- Each category opens its own focused tool page in place of the card grid.
- All direct backend tools are available as input forms within their appropriate category.
- The old generic tester and duplicate legacy forms are hidden.
- Integrations accurately reports that no external integrations are connected.
- Header version and script URLs updated to v0.9.2.

## Verify
1. Refresh XENO and confirm header says `v0.9.2`.
2. Tap Tools → Finance → Overtime Pay.
3. Enter 60 hours at $15/hour, 40-hour threshold, 1.5 multiplier. Expect $1,050 gross.
4. Tap “All categories” and test Work & Field → Work Shift Hours.

If the header still says v0.9.0 or v0.9.1, the new frontend has not been served; check Cloudflare deployment and GitHub branch before changing code again.

No paid integrations or permission changes are introduced. Live deployment is not confirmed by this package.
