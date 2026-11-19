XENO D1 schema migration via GitHub Actions

1. BACK UP your production D1 database first.
2. In the GitHub repository root, replace/add schema.sql with the included schema.sql.
3. Add .github/workflows/xeno-d1-migrate.yml at the same path.
4. In GitHub repository Settings > Secrets and variables > Actions, create secrets CLOUDFLARE_API_TOKEN (Cloudflare API token with D1 edit access) and CLOUDFLARE_ACCOUNT_ID (your account ID).
5. Open GitHub Actions > XENO D1 schema migration > Run workflow.
6. Review action output and test XENO.

This workflow is MANUAL by design. It does not run automatically on every deployment.
It executes the full existing schema.sql from the XENO 4.0 package with CREATE TABLE IF NOT EXISTS statements; this preserves existing tables and data but cannot correct incompatible existing table definitions. Check SQL before execution.
Replacing schema.sql alone does NOT create tables in the remote database.
Never commit the Cloudflare API token to the repository.
