# HESC v0.6.0

**Requires Home PV Control v1.5.1 or newer.**

## Release through HPVC's own interface

HPVC v1.5.1 added a generic request/confirm handshake for companion controllers. HESC now uses it instead of switching HPVC off:

```
HESC request on → HPVC checks its priorities → HPVC confirms (active)
→ HESC counts the release, charger starts on sun → end → HESC request off → HPVC resumes
```

- The wait for the charger only starts after HPVC confirms.
- No confirmation within 5 minutes → request withdrawn, logged as *HPVC busy (status)*, normal cooldown. No forced release.
- HPVC keeps all its own priorities; HESC no longer duplicates them.
- No release when the EV is already full.
- Fallback to the v0.5.1 method stays available, off by default (`input_boolean.hesc_release_legacy`).

## Charge plan

Charge to a goal by a set time, one-off or every week, in the cheapest known quarters, with a safety net and optional *take cheap chances*. Grid charging works through a start/stop switch or a "charge now" mode value, so it is not tied to one charger. When the charger stops by itself, it is put back to how it was and left alone for the rest of the plan.

## Upgrade from v0.5.x

1. Upgrade HPVC to v1.5.1 first.
2. Replace `home assistant/hesc_config.yaml`, check the configuration and restart (or reload input_boolean / input_text / input_select / template).
3. Re-import `node-red/hesc_flow.json` (Replace) and deploy with *Modified flows*.
4. Replace the dashboard.
5. For the charge plan: Settings → *Charging from the grid* → choose the method and your charger's start/stop switch or mode value. Nothing is charged from the grid until you switch a plan (or *take cheap chances*) on.

Wish list: expected prices beyond the known day-ahead prices (from own price history).
