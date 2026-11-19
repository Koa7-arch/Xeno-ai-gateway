# XENO 3.6 — R&D Laboratory

Built on the XENO 3.5 Project Command Center. Adds versioned design/research artifacts, research-source register, engineering calculator, project-specific AI context, and an R&D tab on the iPhone-friendly Project Command Center.

## Upgrade
1. Back up D1 and your existing GitHub deployment.
2. Run **only** the three `CREATE TABLE` and two `CREATE INDEX` statements under `XENO 3.6 additive R&D migration` at the end of `schema.sql` in your existing D1 database.
3. Upload the entire package to the existing GitHub repository; keep existing Cloudflare Access, D1 `DB`, R2 `FILES`, and API secrets.
4. Open Project Command Center → select project → R&D Lab. Create an artifact, revise it, save a source, run a calculation, and ask project AI about the saved artifact.
5. Run `npm run check` and `npm test` locally before deployment, and validate on the live Worker.

## Limits
- R&D artifacts are text-based structured notes/code drafts, **not CAD files or interactive 3D models**.
- Calculator uses elementary formulas and consistent user-supplied units; not certified engineering analysis.
- Research sources are user-entered and not independently verified by XENO.
- Project AI reads recent R&D records but cannot autonomously edit them.
- No background jobs, simulations, GitHub writes, or fabrication integrations.
- Existing global memory retrieval may still include cross-project information; strict context isolation is not guaranteed.
- Approval is required for consequential external actions, and no such R&D actions are enabled.
