# HESC v1.1.0 — HPVC is now optional

**Home EV Solar Control (HESC)** now also runs **without Home PV Control**. It follows solar charging, compares it with the solar forecast, gives setting advice from your own history and can charge your EV to a goal by a set time in the cheapest hours. With HPVC it also asks HPVC for a temporary PV release, exactly as in v1.0.0.

## Standalone mode

- New switch **No HPVC (standalone)** in Settings, step 2.
- On: the HPVC fields are hidden and no longer required, and the release step is skipped. Without HPVC nothing is curtailed, so the charger starts on solar by itself. HESC follows every session, compares forecast and actual PV, writes the report and gives advice. The charge plan works as before (it uses its own price sensor).
- You pick your own PV and grid power sensors.
- A new install without HPVC turns standalone on by itself. Existing installs keep it off, so nothing changes for HPVC users.

## Also in this release

- Grid charging power for the charge plan steps in 0.5 kW.
- New document: **[A day in practice](../../docs/06-a-day-in-practice.md)**, a real day with a home battery (Home Battery Control), HPVC and HESC working side by side, with the numbers.

## Upgrade from v1.0.0

1. Replace `/config/packages/hesc_config.yaml` and reload helpers, template entities and automations (or restart Home Assistant).
2. Replace the dashboard with `home assistant/hesc_dashboard.yaml`.
3. Re-import `node-red/hesc_flow.json` (or replace only the *Evaluate HESC* function node) and deploy with **Modified flows**.

Your settings and history stay as they are.
