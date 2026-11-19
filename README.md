XENO 3.1 — Project & Life Hub expansion

# XENO v1.4.1 — Capability Registry & Tool Access

Full replacement of v1.4.0. Upload files to the repository root preserving paths. Back up local app data first.

## Changes
- Added authenticated `GET /capabilities/verified` to associate implemented direct tools with named capabilities and run read-only diagnostic fixtures.
- Capability Center now shows Verified or Partial based on the actual registry and fixture results, rather than stale manual labels, for mapped entries.
- Added Open tool(s) actions to mapped capabilities, opening the existing tool category and the relevant tool form.
- Preserves existing mobile navigation, chat, tools, memory and local storage keys.
- Does not claim all 207 capabilities are implemented. Broad categories remain partial when only a subset of functions exists.

## Test
1. Deploy and hard-refresh the PWA. Check version v1.4.1.
2. Open Capability Center. Confirm 'Force torque pressure and power' shows Verified with an Open tools button.
3. Tap Open tools and confirm Engineering opens with Force tool form. Run 10 kg × 9.81 m/s² = 98.1 N.
4. Confirm Geometry and trigonometry shows Partially implemented (circle, triangle, Pythagorean only).
5. Run Full Diagnostics; expected 44 PASS, 0 FAIL, 3 SKIP, 0 BLOCKED with Groq configured.
6. Confirm chat and existing conversations still work.

## Scope & limitations
Statuses prove specific backend fixture checks, not comprehensive browser/AI tests. Unmapped catalog entries retain their original roadmap status. No external integrations or background automations were added.
