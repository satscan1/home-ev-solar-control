# Chargers and sources 

HESC does not talk to a charger or a forecast service directly. It only reads Home Assistant entities that you select in **Settings**. Any charger and any forecast that expose the entities below can be used.

## What HESC needs from your charger

| Need | Helper | Typical entity | Notes |
|---|---|---|---|
| Is the EV connected? | `hesc_ev_connected_sensor` | `binary_sensor.*` **or** a status `sensor.*` | A binary sensor counts as connected when `on`. For a status sensor, every state that is **not** in *EV not-connected states* counts as connected |
| Which status values mean "no car"? | `hesc_ev_disconnected_values` | text, comma separated | Optional. Default: `off, disconnected, ready, available, no_ev_connected, unplugged, not_connected, no car, idle, ev disconnected` (case does not matter) |
| How much does the EV draw? | `hesc_ev_power_sensor` | `sensor.*` in W or kW | kW is converted automatically (unit of measurement) |
| Is the charger in its solar mode? | `hesc_charger_mode_entity` | `select.*`, `sensor.*` or `switch.*` | Whatever tells you the charger waits for surplus |
| Which value means solar mode? | `hesc_charger_eco_value` | text, comma separated | One or more values, e.g. `eco_mode, full_solar`. Case does not matter |
| Extra solar switch (optional) | `hesc_charger_solar_switch_entity` | `switch.*` | For chargers that need a mode **and** a PV-surplus switch (go-e, Wattpilot). Must be `on` |
| Solar energy per session (optional) | `hesc_ev_green_energy_sensor` | `sensor.*` in kWh | Only used for the solar share in the report |

### Charging from the grid (charge plan)

Only needed for the charge plan. Chargers do this in one of two ways; fill in the matching field in Settings → step 3 → *Charge plan*.

| Field | Use when | Examples (check your own entities) |
|---|---|---|
| Start/stop switch | the charger has a switch that pauses/resumes charging | Wallbox *Pause/resume* (`switch.<name>_pause_resume`; filled in automatically when you choose charger type *Wallbox*), some Easee and Ohme setups |
| Mode value | "charge now" is a value of the same mode entity you use for solar mode | Zappi `Fast`, evcc `now`, go-e / Wattpilot non-Eco mode, Peblar / Alfen / SMA non-solar mode |

Only the Wallbox *Pause/resume* switch has been built and checked against a real installation. For other chargers, test in shadow mode first and check that the charger returns to its solar mode afterwards.

### EV charging threshold

`input_number.hesc_ev_active_w` (default 400 W) decides when the EV counts as *charging*. Set it above the standby draw of your charger and below the lowest charging power it uses. Most chargers start at 6 A: about 1.4 kW single-phase or 4.1 kW three-phase.

### Start and hold thresholds

`hesc_p_start` and `hesc_p_hold` are **forecast production** thresholds. Your charger starts on **surplus**, which is production minus house load minus battery charging. Choose a start threshold that leaves enough surplus for your charger's solar-mode start level. The per-day tables in the report show whether releases actually led to charging; adjust from there. The **Advice** in the report does this for you: it works out the surplus at which Eco kept charging, adds your typical house-and-battery use, and gives the result as a start threshold.

## Tested with

HESC was developed and tested with:

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

### Charger type in Settings

You can pick your charger under **Settings → 1 · Your charger → Charger type**. HESC then:

- fills in the value(s) that mean solar mode and the status values that mean "no car" for that brand;
- searches for the charger's entities and fills in a field only when it finds exactly **one** match; with more matches the setup check lists them as *Suggested*. Fields you already filled in are never overwritten;
- shows whether the charger has been tested and any brand notes.

The search does not depend on your Home Assistant language: the mode entity is found by its options (they contain the solar value), the charging power by `device_class: power` on the same device. Press **Search again** after installing or renaming the charger integration. Choose **Other (manual)** for any charger not in the list.

All charger data lives in **one table**: the `sensor.hesc_charger_profile` template in `hesc_config.yaml`. To add or correct a charger, change only that table (and, for the documentation, the table below). Corrections from users with other chargers are very welcome as an issue.

## Other common chargers

HESC only helps when the charger (or its controller) has its **own** solar mode that waits for export. The table lists what to select. It is based on the integration source code, not on tests: entity ids are patterns (`<name>` = your device name), so always pick the real entities in **Developer tools → States**.

| Charger · integration | EV connected | Charging power | Mode entity → solar value(s) | Extra solar switch | Solar mode waits for export? |
|---|---|---|---|---|---|
| **Wallbox** Pulsar Plus / Copper · core `wallbox` | `sensor.<name>_status_description` (not-connected: `Ready, Disconnected`) or your own binary sensor | `sensor.<name>_charging_power` (kW) | `select.<name>_solar_charging` → `eco_mode` and/or `full_solar` | — | ✅ tested |
| **Alfen** Eve · `leeyuentuen/alfen_wallbox` | `sensor.<name>_status_code_socket_1` (not-connected: `Available`) | `sensor.<name>_active_power_total_socket_1` (W) | `select.<name>_solar_charging_mode` → `Green` (or `Comfort`) | — | ✅ needs a meter on the Alfen load balancing |
| **Peblar** · core `peblar` | `sensor.<name>_state` (not-connected: `no_ev_connected`) | `sensor.<name>_power` (W) | `select.<name>_smart_charging` → `pure_solar` (or `smart_solar`) | — | ✅ |
| **myenergi Zappi** · `CJNE/ha-myenergi` | `sensor.myenergi_<name>_plug_status` (not-connected: `EV Disconnected`) | Zappi internal-load CT power sensor (W) | `select.myenergi_<name>_charge_mode` → `Eco+` (or `Eco`) | — | ✅ |
| **go-e Charger** · `marq24/ha-goecharger-api2` | `binary_sensor.goe_<serial>_car_0` | `sensor.goe_<serial>_nrg_11` (W) | `select.goe_<serial>_lmo` → `4` (Eco) | `switch.goe_<serial>_fup` | ✅ needs grid/PV data (go-e Controller or pushed from HA) |
| **Fronius Wattpilot** · `mk-maddin/wattpilot-HA` | `sensor.<name>_car_connected` (not-connected: `no car`) | `sensor.<name>_charging_power` | `select.<name>_charging_mode` → `Eco` | `switch.<name>_pv_surplus` | ✅ uses the Fronius meter |
| **SMA EV Charger** · `alengwenus/ha-sma-ev-charger` | `sensor.<name>_charging_session_status` (not-connected: `not_connected`) | `sensor.<name>_charging_station_power` (W) | `select.<name>_operating_mode_of_charge_session` → `optimized_charging` | — | ✅ via Sunny Home Manager |
| **evcc** (any charger) · `marq24/ha-evcc` | `binary_sensor.evcc_<lp>_connected` | `sensor.evcc_<lp>_chargepower` (W) | `select.evcc_<lp>_mode` → `pv` (or `minpv`) | — | ✅ read evcc's loadpoint, not the charger |
| **Ohme** · core `ohme` | `sensor.<name>_status` (not-connected: `unplugged`) | `sensor.<name>_power` (kW) | `switch.<name>_solar_boost` → `on` | — | ⚠️ partly (Home Pro with clamp) |
| **Easee** · `nordicopen/easee_hass` | `sensor.<name>_status` (not-connected: `disconnected`) | `sensor.<name>_power` (kW) | Equalizer *surplus charging* switch → `on` | — | ⚠️ only with an Easee Equalizer |
| **Zaptec**, **Tesla Wall Connector**, **OCPP** | — | — | no solar mode of their own | — | ❌ use evcc and select evcc's entities |

**Solar-only or mixed?** Many chargers offer a *solar-only* mode (Wallbox `full_solar`, Peblar `pure_solar`, Alfen `Green`, Zappi `Eco+`, evcc `pv`) and a *solar plus grid* mode. Both can be listed, comma separated. The solar-only modes profit most from HESC, because they never start while export is held at zero.

Sources: Home Assistant core integrations (`wallbox`, `peblar`, `ohme`, `tesla_wall_connector`) and the GitHub repositories named in the table.

### Checking another charger

Only the Wallbox Pulsar Plus has been tested in practice. Before switching shadow mode off:

1. Pick your charger type (or *Other (manual)*) and check the charger fields.
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

Switch **Use local weather station** on in Settings to show its fields.

| *Use local weather station* | Behaviour |
|---|---|
| off | Forecast only. The irradiance fields are hidden and the report shows *off* |
| on | Irradiance is logged every 15 minutes and must also be above its start/hold thresholds |

Tip: start with low irradiance thresholds. After a few weeks the report shows how well your weather station explains your PV output.

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

A status sensor and kW power sensors work directly. A template helper is only needed for special cases, for example when "connected" depends on two entities:

```yaml
{{ is_state('binary_sensor.<charger>_cable', 'on') and is_state('binary_sensor.<charger>_car', 'on') }}
```

Check the status values of your own charger in **Developer tools → States**.
