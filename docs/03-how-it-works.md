# How it works

## Evaluation

The Inputs tab triggers the Engine every 30 seconds. The Engine reads about 20 entities from the Home Assistant state cache of Node-RED (`global.homeassistant.homeAssistant.states`). It does not call the API and does not copy the full state table.

## Standalone mode

With *No HPVC (standalone)* switched on (`input_boolean.hesc_standalone`), HESC skips the release completely: the HPVC inputs are not required and the state machine below stays in **Idle** with the reason *Standalone (no HPVC): the charger starts on solar by itself*. Following sessions, the 15-minute accuracy records, the charge plan, the advice and the report work as described on this page. Switching standalone on during a running release ends that release cleanly.

## State machine (with HPVC) 

| State | Enters when | Leaves when |
|---|---|---|
| Idle | default | all start conditions hold for the stability time → Release requested |
| Release requested — waiting for HPVC | `input_boolean.hpvc_external_release_request` switched on (or would be, in shadow mode) | HPVC confirms (`binary_sensor.hpvc_external_release_active` on) → Waiting for EV · no confirmation within 5 min → *HPVC busy*, request off · EV disconnected, sunset, inputs missing → request off |
| Release — waiting for EV | HPVC confirmed; the release is counted from here | EV charges → Charging · no start within the wait time → Release ended |
| Release — EV charging | EV above the charging threshold | EV stopped, solar below hold for longer than the allowed dip, EV disconnected / charger not in solar mode, sunset, maximum duration → Release ended |

**Release ended:** the request is switched off, HPVC resumes normal control, the cooldown starts. HESC never switches HPVC itself (unless the legacy fallback is on, see below).

Start conditions:

- the EV is connected, not charging, not full (when a battery-level sensor is set) and in solar mode;
- HPVC is limiting and offers the release interface (v1.5.1 or newer);
- the lower of forecast-now and forecast-+30 min is at least the start threshold;
- irradiance is at least its start threshold (optional);
- there is no cooldown;
- the failed attempts today are below the maximum;
- the sun is up.

## Outputs

- **Status:** `hesc_state`, `hesc_reason`, `hesc_last_action` and `hesc_insight_1..3`, written only on change.
- **Release request:** `input_boolean.hpvc_external_release_request` on/off, never in shadow mode. A request found on while HESC is idle (for example after a restart) is switched off.
- **Charger (charge plan only):** the start/stop switch or the mode entity you selected, never in shadow mode.
- **Ownership:** `input_boolean.hesc_plan_owns_charging` (charge plan) and, legacy only, `input_boolean.hesc_owns_hpvc_off`.
- **History:** one JSON line per event, session or 15-minute interval in `hesc-data/history.jsonl` (about 50 lines per sunny day).

## History records

| type | Contents |
|---|---|
| `event` | release / restore decisions with a snapshot of the inputs |
| `release` | a full release: duration, forecast Wh, PV Wh, actual/forecast %, EV Wh, EV solar kWh, EV started, reason |
| `eco_charge` | every daytime charging session in solar mode, with the same forecast vs actual fields, plus `forced_start` (see below) |
| `accuracy` | every 15 minutes in daylight: median and cautious forecast (W), actual PV (W), irradiance (W/m², if set) and the share of time HPVC was limiting |

### Manual and scheduled starts

Many chargers keep reporting their solar mode (for example Wallbox *Eco*) when you press start yourself or when a schedule starts charging. To keep the advice and the accuracy figures clean, HESC checks every solar session at its start: if the forecast (the estimate chosen in Settings) **and** the actual PV are both below the hold threshold, the session was started by hand or by a schedule. It is still logged (`forced_start: true`) and shown in the report as *Manual/scheduled (not counted)*, but it is left out of the advice, the accuracy figures and the daily solar totals. This only uses forecast and PV, so it works the same for every charger.

### Handshake with HPVC

HPVC v1.5.1 treats the request as a question, not a command. It waits behind its own safety and restore handling, negative-price protection, Night Restore and HBC transition states, respects its normal cooldown and write confirmation, sets the configured inverters to full and only then turns *active* on. So:

- HESC never assumes PV is free right after switching the request on;
- every HESC timer that is about the charger starts **after** *active*;
- the only timer before *active* is the 5-minute limit after which HESC gives up for now (*HPVC busy*).

### Legacy fallback

`input_boolean.hesc_release_legacy` (off by default) brings back the old method: switch HPVC off, set its Number-entity inverters to full and keep them there, with HESC's own HPVC status gate and all-in price guard. Keep it off with HPVC v1.5.1 or newer.

## Charge plan

The plan itself is a Home Assistant template (`sensor.hesc_charge_plan`, attribute `plan`): active plan (one-off or weekly, the earliest wins), goal, deadline, energy needed (battery level × usable capacity), the part expected from the sun (`solar_kwh`), the rest from the grid (`grid_kwh`), the number of quarters that takes at the grid charging power, and the cheapest known quarters before the deadline (`planned`), taken from the price sensor in `input_text.hesc_price_sensor`. It is recalculated every minute and whenever a plan setting changes.

**Sun in the plan.** For every half hour between now and the deadline the plan reads the cautious solar forecast (`pv_estimate10`, kW) from the two solar forecast sensors (today and tomorrow). A half hour counts with the same rule as the *Expected solar charging* bar: at or above the start threshold the charger can start, after that at or above the hold threshold it keeps charging. Such a half hour adds (forecast − 0.4 kW for the house) × 0.5 h, at most the grid charging power. Example: 2.0 kW forecast gives (2.0 − 0.4) × 0.5 = 0.8 kWh. What the sun cannot deliver is planned from the grid.

The *Charge plan* node in the Engine tab runs every 30 seconds and decides:

| Reason on the dashboard | Charger |
|---|---|
| Planned quarter | started from the grid |
| Safety net: only just enough time left | started (remaining time ≤ charging time + 15 min) |
| Final check: below goal, charging to goal | started in the last *final check* minutes before the deadline (default 60) while the EV is below its goal, whatever the price |
| Cheap chance (x ct ≤ y ct) | started, only when *take cheap chances* is on |
| Cheap chance skipped: enough sun today (~x kWh for y kWh) | not started: the cautious solar forecast for the rest of today covers the need with 20% to spare |
| Within 3% of goal (x%, charges below y%) | not started: the EV is less than 3% below its goal |
| Minimum charge: below x%, waiting for the cheapest quarter … / charging | the optional minimum charge (see below) |
| Waiting for the next planned quarter / No active plan | not started; if HESC started it, back to how it was |
| Goal reached (x%) | charger paused (start/stop switch) or previous mode |
| Finished, charger stopped by itself | the charger drew no power for the *charger stopped* time after the *wait for charger* time; back to how it was, and left alone for 30 minutes (then the plan continues; the final check ignores this pause) |
| EV already charging, left alone | a charge HESC did not start (for example on sun) is never taken over |

How it starts follows from what is filled in: a start/stop switch is switched on; otherwise the mode is set to the "charge now" value.

**3% margin.** Grid charging (planned quarter, safety net, final check, cheap chance) only starts when the EV is more than 3% below the goal; once charging, it continues to the goal. This stops the charger from starting for a few minutes of nothing.

**Afterwards: paused.** With a start/stop switch that was on before HESC started, the charger stays paused after grid charging, so the EV cannot top itself up from the grid. HESC switches it on again when there is enough sun to start solar charging (cautious forecast now at or above the start threshold, sun up), when the EV drops more than 3% below the goal (plan goal, otherwise *EV counts as full at*) and no planned charge is still coming, when a plan starts, or when the EV is unplugged. A refused pause is retried after 30 minutes, a refused resume after 5 minutes, each at most 3 times (`pause_retry`, `pause_failed`, `resume_retry`, `resume_failed` in the history). With a mode value the mode that was active before is selected again (or the first solar value).

**Cheap chances and the sun.** Before taking a cheap chance HESC adds up the cautious solar forecast for the rest of that calendar day (half hours at or above the hold threshold, minus 0.4 kW for the house, at most the grid charging power). If that covers what the EV still needs (to the plan goal, otherwise *EV counts as full at*) with 20% to spare, the cheap chance is skipped. The price chart leaves those quarters out too.

**Minimum charge** (optional, `input_boolean.hesc_min_charge_enabled`). EV connected below the minimum level → a window of the set number of hours starts. HESC works out the quarters needed ((minimum − battery) × capacity ÷ grid charging power) and charges in the cheapest quarters of the window; at the end of the window the safety net starts, and without known prices it charges straight away. It stops at the minimum level and works independently of the charge plan. After a restart, `input_boolean.hesc_plan_owns_charging` tells HESC that it had started the charger, so it is put back.

Every start and stop is written to the history (`type: charge_plan`).

**Goal check.** At the deadline HESC compares the battery level with the goal. Below the goal: a notification inside Home Assistant (`persistent_notification`) and to the notify services in `input_text.hesc_notify_services`, and a `goal_missed` line in the history (otherwise `goal_check`).

**Restarts.** While `sensor.hesc_charge_plan` is briefly missing (Home Assistant restart, template reload), the node keeps using the last valid plan for up to 10 minutes, so a running charge is not stopped.

## Price forecast

The Engine tab also holds the **Price forecast** (every 15 minutes, and 40 s after a deploy for loading the history).

- **Own history.** Every complete day in the price sensor is stored as 24 hourly averages, together with that day's solar forecast (kWh), in `hesc-data/price_history.json` (last 90 days).
- **Profile.** The hourly pattern of the last 14 full days (fewer when there is less history; from 1 full day on).
- **Solar index.** How each hour relates to the day average, per *solar class* (the day's solar forecast as a fraction of a sunny day: the 90th percentile of the last 30 days). The index starts from a default for the Dutch market (293 days of market prices) and is refined every week with your own history; the default counts as 30 days of evidence. The forecast adds half of the index difference between tomorrow's solar class and that of the profile days.
- **Output.** 96 quarters after the last known price, published as `sensor.hesc_price_forecast` (attribute `forecast`, plus `basis_days`, `index_days`, `penalty`).

The charge plan template uses these quarters after the last known price, with a 2 ct/kWh penalty, so it only waits for an expected price when that is clearly cheaper than a known one. They show as grey *Expected price* bars in the price chart. The safety net and the final check still make sure the deadline is met.

## Advisor

The Reports tab also holds the **HESC Advisor**. It runs daily at 21:30, 90 seconds after a deploy, and before every report. It reads the history of the last *N* days and writes one short line to `input_text.hesc_advice`. The report gets the full advice. The Advisor never changes settings.

| Advice | Based on | Minimum |
|---|---|---|
| Start / hold threshold | All solar sessions (short ones too) from the way you work now: standalone or with HPVC. A threshold is good when at least 60% of the sessions it lets start keep charging for 20 min or more. When fewer than half do at the current threshold, the advice is the lowest higher threshold that reaches 60% (with at least 3 sessions), plus the trade-off: short sessions avoided and good sessions lost. Hold = 80% of start | minimum sessions, on at least 7 different days |
| Wait for the charger | start delay after real releases (9 of 10 within the advice, plus 2 min) | half the minimum |
| Releases without charging | share of real releases that led to charging (< 50% → raise start threshold) | half the minimum |
| Forecast quality | actual PV vs forecast in daylight intervals without curtailment | 3 × minimum hours |
| Weather station | irradiance at the start of lasting solar sessions; hold = 75% of start | minimum sessions |

## Report

The Reports tab reads the history, builds a self-contained HTML page and writes it to `www/hesc/report.html`. It runs on demand and never inside the evaluation cycle.
