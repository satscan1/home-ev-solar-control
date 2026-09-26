# Changelog

## v1.0.0 — 2026-09-26

First public release. The earlier pre-releases (v0.1–v0.6) were test versions on one installation; their notes are no longer part of this repository.

**Requires Home PV Control v1.5.1 or newer.**

Solar charging while HPVC limits PV
- Release through HPVC's external request/confirm interface (`input_boolean.hpvc_external_release_request` / `binary_sensor.hpvc_external_release_active`). HPVC keeps all its own priorities.
- Solar power forecast as primary source (Solcast `estimate10` or any W sensor); local irradiance sensor optional.
- Hysteresis (start/hold), stability timer, wait for charger, allowed solar dip, maximum duration, cooldown, daily attempt limit.
- No confirmation from HPVC within 5 minutes → request withdrawn (*HPVC busy*). A request left on after a restart is withdrawn automatically.
- No release when the EV is already full (optional battery-level sensor).
- Shadow mode: full evaluation without writes (default for a new install).
- Legacy fallback (switch HPVC off, inverters to full) present but **off**: `input_boolean.hesc_release_legacy`.

Charge plan
- One-off and weekly plans; cheapest known day-ahead quarters before the deadline; safety net; optional *take cheap chances*.
- Grid charging through a start/stop switch or a "charge now" mode value; the charger always goes back to how it was.
- Restart safety (`input_boolean.hesc_plan_owns_charging`), status (`input_text.hesc_plan_status`).

Chargers and sources
- Charger type table for Wallbox, Alfen, Peblar, Zappi, go-e, Wattpilot, SMA, evcc, Ohme, Easee, plus *Other (manual)*.
- Binary or status connected sensor, W or kW power, one or more solar-mode values, optional extra solar switch.
- PV and grid taken over from HPVC by default.

Insight
- Forecast vs actual per solar session and per day; source reliability every 15 minutes.
- Plain-language advice from your own history (minimum sessions, recent period, follows the seasons).
- On-demand HTML support report; file-based history, no InfluxDB needed.

Dashboard
- Main (status, master control, live inputs, control states, forecast vs actual, solar charging forecast), Charge plan, and Settings in three steps with a setup checklist.

Shipped defaults
- Forecast power to start / hold 1 500 / 1 200 W; irradiance to start / hold 150 / 120 W/m² (from 8 real solar starts on the test installation).
