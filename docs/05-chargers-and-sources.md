# Chargers and sources

HESC does not talk to a charger or a forecast service directly. It only reads Home Assistant entities that you select in **Settings**. Any charger and any forecast that expose the entities below can be used.

## What HESC needs from your charger

| Need | Helper | Typical entity | Notes |
|---|---|---|---|
| Is the EV connected? | `hesc_ev_connected_sensor` | `binary_sensor.*` | Must be `on` when a car is plugged in. No binary sensor? See [Template helpers](#template-helpers) |
| How much does the EV draw? | `hesc_ev_power_sensor` | `sensor.*` in W | kW sensors must be converted to W (template helper) |
| Is the charger in its solar mode? | `hesc_charger_mode_entity` | `select.*`, `sensor.*` or `switch.*` | Whatever tells you the charger waits for surplus |
| Which value means solar mode? | `hesc_charger_eco_value` | text | The exact state, e.g. `eco_mode`, `solar`, `pv` or `on` for a switch |
| Solar energy per session (optional) | `hesc_ev_green_energy_sensor` | `sensor.*` in kWh | Only used for the solar share in the report |

### EV charging threshold

`input_number.hesc_ev_active_w` (default 400 W) decides when the EV counts as *charging*. Set it above the standby draw of your charger and below the lowest charging power it uses. Most chargers start at 6 A: about 1.4 kW single-phase or 4.1 kW three-phase.

### Start and hold thresholds

`hesc_p_start` and `hesc_p_hold` are **forecast production** thresholds. Your charger starts on **surplus**, which is production minus house load minus battery charging. Choose a start threshold that leaves enough surplus for your charger's solar-mode start level. The per-day tables in the report show whether releases actually led to charging; adjust from there.

## Tested with

HESC v0.2 was developed and tested with:

| Part | Used |
|---|---|
| Charger | **Wallbox Pulsar Plus**, official Wallbox integration, solar charging mode **Eco** (`select.<wallbox>_solar_charging` = `eco_mode`) |
| Forecast | Solcast PV Forecast (BJReplay), `power_now` / `power_in_30_minutes` with attribute `estimate10` |
| Irradiance | Ecowitt weather station (`solar_radiation`, W/m²), optional |
| PV control | Home PV Control (HPVC) |
| Battery | Home Battery Control (HBC) |

Observed behaviour of the Pulsar Plus in Eco mode (8 weeks of history, one installation). Use it as an example only, not as a rule for other chargers:

| | Observed |
|---|---|
| Eco start | at about 1.5 kW export (middle half 0.9–2.7 kW) |
| Delay before start | about 3 minutes (middle half 1–7) |
| Power right after start | about 4.3 kW |
| Eco stop | at about 1.3 kW grid import, after the charging power has dropped to about 0.9 kW |
| Short sessions | 44% of Eco sessions last 15 minutes or less |

This is why HPVC and Eco block each other: HPVC keeps export near zero, and the Pulsar Plus waits for about 1.5 kW export.

A reference selection is in [examples/wallbox-pulsar-plus-solcast.reference.yaml](../examples/wallbox-pulsar-plus-solcast.reference.yaml).

### Other chargers

Other chargers have not been tested yet. Before switching shadow mode off:

1. Fill in the five charger helpers.
2. Check the report's **Live inputs**: nothing should show *missing*.
3. Plug in the EV in solar mode and watch the dashboard reason change from *EV not connected* to the next condition.
4. Let HESC run in shadow mode for a few sunny days and check that simulated releases are followed by charging in the report.

A report of a working setup with another charger is very welcome as an issue.

## Forecast

The primary source is a **solar power forecast in watts**, for now and for 30 minutes ahead.

- **Solcast:** use the `power_now` and `power_in_30_minutes` sensors and set the attribute to `estimate10` (the cautious estimate). HESC uses the lower of both values to start and the median estimate (the state) for forecast vs actual.
- **Other forecasts** (for example Forecast.Solar or Open-Meteo Solar Forecast): select any two sensors in W and leave the attribute empty. The state is then used for both decisions and accuracy.

## Weather station (optional)

A local irradiance sensor (W/m²) is **not required**.

| Irradiance sensor | *Use irradiance as confirmation* | Behaviour |
|---|---|---|
| empty | any | Forecast only. The report shows *off* for irradiance |
| set | off | Forecast only; irradiance is logged so you can compare it with PV |
| set | on | Forecast **and** irradiance must be above their thresholds |

Tip: leave the confirmation off at first. After a few weeks the report shows whether your irradiance sensor explains your PV output better than the forecast.

## How reliable are my sources?

Every 15 minutes in daylight, HESC stores one `accuracy` record: the forecast (median and cautious), the actual PV power, the irradiance and how often HPVC was limiting. This runs also when no EV is connected, so the picture builds up quickly.

The report section **How reliable are the sources?** shows:

| Figure | Meaning | Good when |
|---|---|---|
| Actual / forecast | actual PV as % of the median forecast | close to 100% |
| Within ±20% | share of intervals with actual within 20% of the forecast | high |
| Actual ≥ cautious | share of intervals where actual PV reached the cautious forecast | about 90% (that is what a 10th-percentile estimate promises) |
| PV per kW/m² | PV output per 1 kW/m² irradiance, with its middle half | a narrow range |
| Irradiance ↔ PV | correlation between irradiance and PV | close to 1,0 |

Intervals in which HPVC limited PV are left out: curtailed PV says nothing about how good the forecast was.

## Template helpers

If your charger integration lacks one of the entities, create a template helper in Home Assistant (**Settings → Devices & services → Helpers → Template**). Examples:

```yaml
# EV connected from a status text sensor
{{ states('sensor.<charger>_status') not in ['Ready', 'Disconnected', 'unavailable', 'unknown'] }}

# Charging power in W from a kW sensor
{{ (states('sensor.<charger>_power_kw') | float(0) * 1000) | round(0) }}
```

Check the status values of your own charger in **Developer tools → States**.
