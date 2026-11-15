# XENO Mobile v0.7.0 — Complete Replacement Package

This ZIP contains the entire application source tree (not just patch files), assembled from the previously working v0.6.1 frontend and v0.6 backend plus the v0.7 financial tools and verified tool activity.

## Installation
1. Back up your existing GitHub repository and export XENO conversations from Settings.
2. In repository `Koa7-arch/Xeno-ai-gateway`, replace the corresponding root files and the files under `public/` with the files in this package. **Preserve the folder structure.**
3. Keep existing Cloudflare secrets and Access settings. Do not commit API keys.
4. Deploy via your existing Cloudflare integration.
5. On iPhone, close and reopen XENO. Check the header version, Tools > Finance & Calculations, and run the smoke tests below.

## Smoke tests
- Tools > Finance & Calculations > Overtime: 60 hours, $15/hour, 40-hour threshold, 1.5 multiplier => $1,050 gross.
- Savings: $3,000 + $500 x 12 periods => $9,000.
- Percentage change: 100 to 125 => +25%.
- Chat: Ask XENO to use the calculator to multiply 17 x 23 => 391. A verified tool activity disclosure should appear **only when the backend actually reports a tool call**.
- Verify existing tasks, approvals, and profile still work.

## Scope / limitations
- This is v0.7's expanded-tools and transparency release, **not** cloud memory, Discord, calendar, web research, background push, or voice calling.
- Tasks, conversations and profiles remain device-local. Back up before clearing browser data.
- Calculations are gross estimates and do not access bank accounts.
- GitHub write access is unavailable to this assistant, so this package is NOT deployed.
- Static syntax checks were run; live Cloudflare/iPhone behavior must be verified after installation.

## Rollback
Restore your prior repository commit and redeploy. Existing localStorage data is not intentionally migrated or deleted by this package.
