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

The plan itself is a Home Assistant template (`sensor.hesc_charge_plan`, attribute `plan`): active plan (one-off or weekly, the earliest wins), goal, deadline, energy needed (battery level × usable capacity), number of quarters at the grid charging power, and the cheapest known quarters before the deadline (`planned`), taken from the price sensor in `input_text.hesc_price_sensor`. It is recalculated every minute and whenever a plan setting changes.

The *Charge plan* node in the Engine tab runs every 30 seconds and decides:

| Reason on the dashboard | Charger |
|---|---|
| Planned quarter | started from the grid |
| Safety net: only just enough time left | started (remaining time ≤ charging time + 15 min) |
| Cheap chance (x ct ≤ y ct) | started, only when *take cheap chances* is on |
| Waiting for the next planned quarter / No active plan | not started; if HESC started it, back to how it was |
| Goal reached (x%) | back to how it was |
| Finished, charger stopped by itself | the charger drew no power for the *charger stopped* time after the *wait for charger* time; back to how it was, and left alone until the deadline |
| EV already charging, left alone | a charge HESC did not start (for example on sun) is never taken over |

How it starts follows from what is filled in: a start/stop switch is switched on; otherwise the mode is set to the "charge now" value. Back to how it was: the switch returns to the state it had before HESC started (normally off), or the mode that was active before is selected again (or the first solar value). After a restart, `input_boolean.hesc_plan_owns_charging` tells HESC that it had started the charger, so it is put back.

Every start and stop is written to the history (`type: charge_plan`).

Not yet: expected prices beyond the known day-ahead prices. Until then only known quarters are planned; the safety net makes sure the deadline is still met.

## Advisor

The Reports tab also holds the **HESC Advisor**. It runs daily at 21:30, 90 seconds after a deploy, and before every report. It reads the history of the last *N* days and writes one short line to `input_text.hesc_advice`. The report gets the full advice. The Advisor never changes settings.

| Advice | Based on | Minimum |
|---|---|---|
| Start / hold threshold | Solar sessions that kept charging for 20 min or more. Per session: non-EV use = PV + grid − EV (house and battery together) and expected surplus = cautious forecast − non-EV use. Advice = surplus that worked (25th percentile) + typical non-EV use (median), i.e. translated back to the gross forecast that `hesc_p_start` uses. Hold = 80% of start. Without a grid sensor: 25th percentile of the gross forecast, marked as such | minimum sessions |
| Wait for the charger | start delay after real releases (9 of 10 within the advice, plus 2 min) | half the minimum |
| Releases without charging | share of real releases that led to charging (< 50% → raise start threshold) | half the minimum |
| Forecast quality | actual PV vs forecast in daylight intervals without curtailment | 3 × minimum hours |
| Weather station | irradiance at the start of lasting solar sessions; hold = 75% of start | minimum sessions |

## Report

The Reports tab reads the history, builds a self-contained HTML page and writes it to `www/hesc/report.html`. It runs on demand and never inside the evaluation cycle.
