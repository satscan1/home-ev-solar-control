# Settings

The **Settings** tab is split into three steps. A new user only fills in step 1; everything else is taken over from Home PV Control (HPVC) or has a working default.

Until step 1 is complete, the **Main** tab shows only a welcome card with a setup checklist (same idea as HPVC's onboarding). The rest of the dashboard appears as soon as `binary_sensor.hesc_configuration_valid` turns on. The checklist is repeated at the bottom of step 1, with the live value of every source, so you can see straight away whether an entity works.

## 1 · Your charger — required

Start with **Charger type** (`input_select.hesc_charger_type`): HESC fills in the brand values and suggests the entities it finds (only fills a field when there is exactly one match). **Search again** (`input_button.hesc_charger_search`) repeats the search. See [Chargers and sources](05-chargers-and-sources.md#charger-type-in-settings).

| Field (`input_text.*`) | What to enter |
|---|---|
| `hesc_ev_connected_sensor` | The entity that shows the car is plugged in: a binary sensor, or a status sensor |
| `hesc_ev_power_sensor` | The charging power, in W or kW |
| `hesc_charger_mode_entity` | The select or sensor with the charger's charging mode |
| `hesc_charger_eco_value` | The value(s) of that entity that mean solar charging, comma separated (e.g. Wallbox `eco_mode`, Zappi `Eco+`) |

Examples per charger: [Chargers and sources](05-chargers-and-sources.md).

## 2 · Taken over automatically

Only change these if you really have to.

| Field | Default | Where it comes from |
|---|---|---|
| `hesc_pv_power_sensor` | HPVC's PV power sensor | Kept in sync with `input_text.hpvc_pv_power_sensor` while **PV & grid from HPVC** is on |
| `hesc_grid_power_sensor` | HPVC's grid power sensor | Kept in sync with `input_text.hpvc_grid_power_sensor` (optional; used for the surplus in the advice) |
| `hesc_forecast_now_sensor` | `sensor.solcast_pv_forecast_power_now` | Set on first install |
| `hesc_forecast_30m_sensor` | `sensor.solcast_pv_forecast_power_in_30_minutes` | Set on first install |
| `hesc_forecast_attribute` | `estimate10` (Solcast cautious estimate) | Empty = use the state |
| `hesc_hpvc_enabled_entity` | `input_boolean.hpvc_enabled` | HPVC |
| `hesc_hpvc_limited_entity` | `binary_sensor.hpvc_pv_limited` | HPVC |

- Switch **PV & grid from HPVC** (`input_boolean.hesc_use_hpvc_sources`) off to pick other PV or grid sensors; the two fields then appear.
- Switch **Change forecast & HPVC** (`input_boolean.hesc_edit_sources`) on to edit the forecast and HPVC entities.

## Optional

Shown with **Show optional fields** (`input_boolean.hesc_show_optional`).

| Field | When you need it |
|---|---|
| `hesc_ev_disconnected_values` | Only when *EV connected* is a status sensor: the values that mean "no car", comma separated |
| `hesc_charger_solar_switch_entity` | Chargers that need an extra switch to be `on` for solar mode (go-e, Wattpilot) |
| `hesc_ev_green_energy_sensor` | The charger's solar energy counter, for "kWh from solar" in the report |
| `hesc_ev_soc_sensor` + `input_number.hesc_ev_full_soc` | The EV's battery level (%) and the level that counts as full (default 100%). Used for *EV full* and the charge plan |

**Local weather station**: switch *Use local weather station* on to show the irradiance sensor and its start/hold thresholds. Without it HESC works on the forecast alone.

## 3 · Advanced — only if needed

Three separate blocks, each with its own switch. The defaults work for most installations; the advice in the report tells you when a change would help.

| Block (switch) | Settings | Defaults |
|---|---|---|
| Thresholds (`hesc_show_thresholds`) | Forecast power to start / hold, EV counts as charging above | 2 500 W / 2 000 W, 400 W |
| Timing (`hesc_show_timing`) | Stable before release, wait for charger, allowed dip, charger stopped before restore, maximum duration, cooldown, failed releases per day | 5, 10, 5, 5, 240, 30 min, 3 |
| Advice (`hesc_show_advice`) | Advice based on last, minimum sessions before advice | 30 days, 8 sessions |

More on the defaults: *Shipped defaults* in the [README](../README.md#shipped-defaults). Manual or scheduled starts are left out of the advice automatically, see [How it works](03-how-it-works.md#manual-and-scheduled-starts).

## Charge plan

On the **Charge plan** tab.

| Setting | Meaning |
|---|---|
| One-off: day, time, goal, active | Charge to the goal by that day and time, once |
| Every week: days, time, goal, active | Charge to the goal on the selected days at that time |
| Take cheap chances + price | Also charge whenever the price is at or below this price (€/kWh) |
| Usable battery capacity | kWh, to work out the energy needed |
| Grid charging power | kW your charger delivers from the grid, to work out the number of quarters |

**Charging from the grid**

| Field | Meaning |
|---|---|
| `input_select.hesc_grid_charge_method` | *Off*, *Start/stop switch* or *Mode value* |
| `input_text.hesc_charger_start_stop_entity` | Start/stop switch: `on` = charge, `off` = pause (back to solar mode). E.g. Wallbox *Pause/resume* |
| `input_text.hesc_price_sensor` | Your day-ahead price sensor with `raw_today` / `raw_tomorrow` attributes (e.g. Nord Pool). Also replace it in the dashboard's price chart |
| `input_text.hesc_charger_grid_mode_value` | Mode value: the value of the mode entity (step 1) that means "charge now", e.g. Zappi `Fast`, evcc `now` |

## Switches

| Switch | Meaning |
|---|---|
| HESC enabled | Master switch. Off = no evaluation; if HESC owned HPVC, HPVC is restored |
| Shadow mode | Evaluate and log only; never switches HPVC |
| Use local weather station | Shows the irradiance settings and also requires the irradiance thresholds. Off = forecast only |
| HESC release via HPVC off (legacy fallback) | Off = ask HPVC for a release (needs HPVC 1.5.1). On = the old v0.5.1 method. Keep off |
| HESC switched HPVC off | Legacy ownership flag, set by HESC only. Do not change it manually |
| HESC charge plan owns charging | Set while the charge plan started the charger. Do not change it manually |
