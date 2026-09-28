# Changelog

## v1.2.0 — 2026-09-28

**A charge plan you can rely on.**

Charge plan
- The plan now counts on expected sun. Per half hour before the ready-by time it looks at the cautious solar forecast (same rule as the *Expected solar charging* bar: the start threshold starts, the hold threshold keeps charging) and subtracts about 0.4 kW for the house. Only the rest is planned from the grid. Two new settings: *Solar forecast today* and *Solar forecast tomorrow* (`input_text.hesc_solar_today_sensor` / `hesc_solar_tomorrow_sensor`, Solcast *forecast today / tomorrow* by default).
- Final check before the ready-by time (`input_number.hesc_plan_final_check_min`, default 60 min, 0 = off): if the EV is still below its goal, HESC charges to the goal, whatever the price.
- Notification when the goal is not reached at the ready-by time: a notification inside Home Assistant, plus the notify services you choose (`input_text.hesc_notify_services`, e.g. `notify.mobile_app_phone`). The history gets a `goal_check` / `goal_missed` line.
- Fixed: when the charger did not draw power once, HESC treated the plan as finished until the ready-by time and only unplugging the EV undid that. It now pauses for at most 30 minutes, then continues with the plan.
- Fixed: a Home Assistant restart or a template reload could briefly stop a running plan. HESC now keeps the last valid plan for up to 10 minutes.
- The charge plan card no longer shows a leftover *Finished* from an earlier plan above a new plan, and shows "–" instead of "0,0 ct/kWh" while nothing is planned yet. It also shows how much of the energy is expected from the sun.

Price chart (Charge plan tab)
- The chart now follows the day-ahead price sensor chosen in Settings. You no longer have to change a sensor name in the dashboard.
- Planned grid charging quarters are shown in amber, with a legend: grey = price per quarter, amber = planned grid charging.
- When the price sensor has no prices, the chart makes way for a clear *Prices not available* message instead of an endless "Loading…" (`binary_sensor.hesc_prices_available`).

Advisor
- The start threshold advice now looks at all solar sessions, the short ones too, and shows the trade-off (short sessions avoided versus good ones lost).
- It only uses sessions from the way you work now (standalone or with HPVC); new sessions record standalone mode.
- It waits for sessions on at least 7 different days before advising.

Setup
- Choosing the charger type *Wallbox* now also fills in the start/stop switch for the charge plan (the pause/resume switch), when exactly one is found on the charger.
- In standalone, the setup checklist on Main shows *Sources* and no longer mentions HPVC.
- New installs start with: *EV counts as full at* 80% (was 100%; 100% is only advised for LFP batteries), grid charging power 11 kW, usable battery capacity 60 kWh, *Cheap when below* 0.05 €/kWh. Existing installs keep their own values.
- The new v1.2.0 settings get their starting values once, also when upgrading (`input_boolean.hesc_defaults_v120_applied`); settings you already filled in are not overwritten.

Upgrade from v1.1.0: replace `hesc_config.yaml` and the dashboard, re-import the flow (or replace the *Evaluate HESC*, *Charge plan*, *HESC Advisor* and *Build HESC report* nodes), restart Home Assistant or reload helpers, template entities and automations.

## v1.1.0 — 2026-09-27 

**HPVC is now optional.**

Standalone mode
- New switch *No HPVC (standalone)* (`input_boolean.hesc_standalone`). On: HESC runs without Home PV Control. The HPVC fields are hidden and no longer required, the release step is skipped, and you pick your own PV and grid sensors. Following solar charging, forecast vs actual, the report, the advice and the charge plan keep working.
- A new install without HPVC switches standalone on by itself. Existing installs keep it off, so nothing changes for HPVC users.
- Switching standalone on during a running release ends that release cleanly.
- Settings, step 2 adapts: *Sources* in standalone, *Taken over automatically* with HPVC. The edit switch is called *Change forecast* in standalone and *Change forecast & HPVC* with HPVC.

Other
- Grid charging power for the charge plan now steps in 0.5 kW instead of 0.1 kW.
- New document: [A day in practice](docs/06-a-day-in-practice.md), a real day with a home battery, HPVC and HESC.
- Installation guide: steps for a fresh install without HPVC (Node-RED add-on, server node, what you need first).

Upgrade from v1.0.0: replace `hesc_config.yaml` and the dashboard, re-import the flow (or replace the *Evaluate HESC* node), restart Home Assistant or reload helpers, template entities and automations.

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
