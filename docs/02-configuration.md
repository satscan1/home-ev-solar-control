# Settings

The **Settings** tab is split into three steps. A new user only fills in step 1; everything else is taken over from Home PV Control (HPVC) or has a working default. Without HPVC, switch on **No HPVC (standalone)** in step 2 and also pick your PV and grid sensors there.

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

- Switch **PV & grid from HPVC** (`input_boolean.hesc_use_hpvc_sources`) off to pick other PV or grid sensors; the two fields then appear. Your own choice is kept: switching it on remembers your sensors (`input_text.hesc_own_pv_power_sensor` / `hesc_own_grid_power_sensor`), switching it off puts them back.
- Switch **Change forecast & HPVC** (`input_boolean.hesc_edit_sources`) on to edit the forecast and HPVC entities.
- Switch **No HPVC (standalone)** (`input_boolean.hesc_standalone`) on when you do not use Home PV Control. The HPVC fields disappear and are no longer required, the PV and grid fields are shown so you can pick your own sensors, and HESC skips the release step: without HPVC nothing is curtailed, so the charger starts on solar by itself. A new install without HPVC switches this on by itself. In standalone the edit switch is called **Change forecast**.

## Optional

Shown with **Show optional fields** (`input_boolean.hesc_show_optional`).

| Field | When you need it |
|---|---|
| `hesc_ev_disconnected_values` | Only when *EV connected* is a status sensor: the values that mean "no car", comma separated |
| `hesc_charger_solar_switch_entity` | Chargers that need an extra switch to be `on` for solar mode (go-e, Wattpilot) |
| `hesc_ev_green_energy_sensor` | The charger's solar energy counter, for "kWh from solar" in the report |
| `hesc_ev_soc_sensor` + `input_number.hesc_ev_full_soc` | The EV's battery level (%) and the level that counts as full (default 80%; set 100% for LFP batteries). Used for *EV full* and the charge plan |

**Local weather station**: two switches side by side. **Use** (`input_boolean.hesc_use_irradiance`) switches the weather station on or off; **Settings** (`input_boolean.hesc_show_weather_settings`) shows or hides the irradiance sensor and its start/hold thresholds. Without it HESC works on the forecast alone.

## 3 · Advanced — only if needed

Three separate blocks, each with its own switch. The defaults work for most installations; the advice in the report tells you when a change would help.

| Block (switch) | Settings | Defaults |
|---|---|---|
| Thresholds (`hesc_show_thresholds`) | Forecast power to start / hold, EV counts as charging above | 1 500 W / 1 200 W, 400 W (EV charging) · irradiance 150 / 120 W/m² |
| Timing (`hesc_show_timing`) | Stable before release, wait for charger, allowed dip, charger stopped before restore, maximum duration, cooldown, failed releases per day | 5, 10, 5, 5, 240, 30 min, 3 |
| Advice (`hesc_show_advice`) | Advice based on last, minimum sessions before advice | 30 days, 8 sessions |
| Charge plan (`hesc_show_plan_settings`) | Charger start/stop switch **or** "charge now" mode value, day-ahead price sensor | empty (no grid charging) |
| Minimum charge: **Use** (`hesc_min_charge_enabled`) + **Settings** (`hesc_show_min_charge_settings`) | Minimum battery level (`input_number.hesc_min_charge_soc`), reach it within (`input_number.hesc_min_charge_hours`) | off · 20% · 3 h |

**Minimum charge** (optional). When the EV is plugged in below the minimum level, HESC charges it to that level within the set time, in the cheapest quarters of that window; at the end of the window the safety net starts charging, and without known prices it charges straight away. It works next to the charge plan and stops as soon as the level is reached. Useful for a quick trip after coming home with an almost empty battery.

More on the defaults: *Shipped defaults* in the [README](../README.md#shipped-defaults). Manual or scheduled starts are left out of the advice automatically, see [How it works](03-how-it-works.md#manual-and-scheduled-starts).

## Charge plan

On the **Charge plan** tab.

| Setting | Meaning |
|---|---|
| One-off: day, time, goal, active | Charge to the goal by that day and time, once |
| Every week: days, time, goal, active | Charge to the goal on the selected days at that time |
| Take cheap chances + price | Also charge whenever the price is at or below this price (€/kWh), also without an active plan. Skipped when the solar forecast for the rest of that day covers what the EV still needs with 20% to spare |
| Usable battery capacity | kWh, to work out the energy needed |
| Grid charging power | kW your charger delivers from the grid, to work out the number of quarters |

**Grid charging settings** are on the **Settings** tab, step 3, block *Charge plan* (switch `input_boolean.hesc_show_plan_settings`). Fill in **one** of the first two:

| Field | Meaning |
|---|---|
| `input_text.hesc_charger_start_stop_entity` | A start/stop switch: switched on in a planned quarter. E.g. Wallbox *Pause/resume* |
| `input_text.hesc_charger_grid_mode_value` | Or: the value of the mode entity (step 1) that means "charge now", e.g. Zappi `Fast`, evcc `now` |
| `input_text.hesc_price_sensor` | Your day-ahead price sensor with `raw_today` / `raw_tomorrow` attributes (e.g. Nord Pool). The price chart on the Charge plan tab follows it |
| `input_text.hesc_solar_today_sensor` / `hesc_solar_tomorrow_sensor` | Solar forecast per half hour for today and tomorrow (attribute `detailedForecast`, e.g. Solcast *forecast today / tomorrow*). The plan counts on this sun before the deadline. Empty = no sun in the plan |
| `input_number.hesc_plan_final_check_min` | Final check this many minutes before the ready-by time: below the goal = charge to the goal, whatever the price. Default 60, 0 = off |
| `input_text.hesc_notify_services` | Notify services for a message when the EV is not at its goal at the ready-by time, comma separated, e.g. `notify.mobile_app_phone`. Empty = only a notification inside Home Assistant |

Grid charging only starts when the EV is more than 3% below its goal (fixed for now); once charging, it continues to the goal. Afterwards: with a start/stop switch the charger stays **paused**, so the car cannot top itself up from the grid; HESC switches it on again for solar charging, a drop of more than 3% (when no planned charge is coming), a new plan or unplugging. With a mode value the previous mode is selected again. Nothing filled in = no grid charging. With charger type *Wallbox*, HESC fills in the start/stop switch (*Pause/resume*) itself when it finds exactly one.

## Switches

| Switch | Meaning |
|---|---|
| HESC enabled | Master switch. Off = no evaluation; if HESC owned HPVC, HPVC is restored |
| Shadow mode | Evaluate and log only; never switches HPVC |
| Use local weather station | Shows the irradiance settings and also requires the irradiance thresholds. Off = forecast only |
| HESC release via HPVC off (legacy fallback) | Off = ask HPVC for a release (needs HPVC 1.5.1). On = the old method (switch HPVC off and set its inverters to full). Keep off |
| HESC switched HPVC off | Legacy ownership flag, set by HESC only. Do not change it manually |
| HESC charge plan owns charging | Set while the charge plan started the charger. Do not change it manually |
