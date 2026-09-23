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

- the EV is connected, not charging, and in Eco mode;
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
| `eco_charge` | every daytime charging session in Eco mode, with the same forecast vs actual fields |
| `accuracy` | every 15 minutes in daylight: median and cautious forecast (W), actual PV (W), irradiance (W/m², if set) and the share of time HPVC was limiting |

## Report

The Reports tab reads the history, builds a self-contained HTML page and writes it to `www/hesc/report.html`. It runs on demand and never inside the evaluation cycle.
