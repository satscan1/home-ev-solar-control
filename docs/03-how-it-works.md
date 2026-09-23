# How it works

## Evaluation

The Inputs tab triggers the Engine every 30 seconds. The Engine reads about 20 entities from the Home Assistant state cache of Node-RED (`global.homeassistant.homeAssistant.states`). It does not call the API and does not copy the full state table.

## State machine

| State | Enters when | Leaves when |
|---|---|---|
| Idle | default | all start conditions hold for the stability time → Release |
| Release — waiting for EV | HPVC switched off (or would be, in shadow mode) | EV charges → Charging · no start within the wait time → Restore |
| Release — EV charging | EV above the charging threshold | EV stopped, solar below hold for longer than the allowed dip, EV disconnected / not Eco, sunset, maximum duration → Restore |

Start conditions:

- the EV is connected, not charging, and in solar/Eco mode;
- HPVC is enabled and limiting;
- the lower of forecast-now and forecast-+30 min is at least the start threshold;
- irradiance is at least its start threshold (optional);
- there is no cooldown;
- the failed attempts today are below the maximum;
- the sun is up.

## Outputs

- **Status:** `hesc_state`, `hesc_reason`, `hesc_last_action` and `hesc_insight_1..3`, written only on change.
- **HPVC:** `input_boolean.turn_off` / `turn_on` on the configured HPVC switch, never in shadow mode.
- **Ownership:** `input_boolean.hesc_owns_hpvc_off`.
- **History:** one JSON line per event, session or 15-minute interval in `hesc-data/history.jsonl` (about 50 lines per sunny day).

## History records

| type | Contents |
|---|---|
| `event` | release / restore decisions with a snapshot of the inputs |
| `release` | a full release: duration, forecast Wh, PV Wh, actual/forecast %, EV Wh, EV solar kWh, EV started, reason |
| `eco_charge` | every daytime charging session in solar/Eco mode, with the same forecast vs actual fields |
| `accuracy` | every 15 minutes in daylight: median and cautious forecast (W), actual PV (W), irradiance (W/m², if set) and the share of time HPVC was limiting |

## Advisor

The Reports tab also holds the **HESC Advisor**. It runs daily at 21:30, 90 seconds after a deploy, and before every report. It reads the history of the last *N* days and writes one short line to `input_text.hesc_advice`. The report gets the full advice. The Advisor never changes settings.

| Advice | Based on | Minimum |
|---|---|---|
| Start / hold threshold | Eco sessions that kept charging for 20 min or more. Per session: non-EV use = PV + grid − EV (house and battery together) and expected surplus = cautious forecast − non-EV use. Advice = surplus that worked (25th percentile) + typical non-EV use (median), i.e. translated back to the gross forecast that `hesc_p_start` uses. Hold = 80% of start. Without a grid sensor: 25th percentile of the gross forecast, marked as such | minimum sessions |
| Wait for the charger | start delay after real releases (9 of 10 within the advice, plus 2 min) | half the minimum |
| Releases without charging | share of real releases that led to charging (< 50% → raise start threshold) | half the minimum |
| Forecast quality | actual PV vs forecast in daylight intervals without curtailment | 3 × minimum hours |
| Weather station | irradiance at the start of lasting Eco sessions; hold = 75% of start | minimum sessions |

## Report

The Reports tab reads the history, builds a self-contained HTML page and writes it to `www/hesc/report.html`. It runs on demand and never inside the evaluation cycle.
