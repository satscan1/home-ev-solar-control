# Settings

## Sources (`input_text.hesc_*`)

| Helper | Required | Description |
|---|:-:|---|
| `hesc_forecast_now_sensor` | ✅ | Forecast PV power now (W) |
| `hesc_forecast_30m_sensor` | ✅ | Forecast PV power in 30 minutes (W) |
| `hesc_forecast_attribute` | | Attribute to use instead of the state, e.g. `estimate10` (Solcast cautious estimate). Empty = state |
| `hesc_irradiance_sensor` | | Local irradiance (W/m²), optional. Used and logged only when *Use local weather station* is on |
| `hesc_pv_power_sensor` | ✅ | Actual PV power (W or kW), used for forecast vs actual |
| `hesc_grid_power_sensor` | | Grid power (W, negative = export), for context in the history |
| `hesc_ev_connected_sensor` | ✅ | EV connected: binary sensor, or a status sensor |
| `hesc_ev_disconnected_values` | | Status values that mean "no car", comma separated (only for a status sensor) |
| `hesc_ev_power_sensor` | ✅ | EV charging power (W or kW) |
| `hesc_ev_green_energy_sensor` | | Charger's solar energy counter (kWh), for the solar share per session |
| `hesc_charger_mode_entity` | ✅ | Charger mode entity (select/sensor) |
| `hesc_charger_eco_value` | ✅ | Value(s) of that entity that mean solar mode, comma separated, e.g. `eco_mode, full_solar` |
| `hesc_charger_solar_switch_entity` | | Extra switch that must be `on` as well (go-e, Wattpilot) |
| `hesc_hpvc_enabled_entity` | ✅ | Default `input_boolean.hpvc_enabled` |
| `hesc_hpvc_limited_entity` | ✅ | Default `binary_sensor.hpvc_pv_limited` |

How to map your own charger: [Chargers and sources](05-chargers-and-sources.md).

## Thresholds and timing

See the *Shipped defaults* table in the [README](../README.md#shipped-defaults).

## Advice

| Setting | Default | Meaning |
|---|---|---|
| Advice based on last | 30 days | Only this recent period is used, so the advice follows the season |
| Minimum sessions before advice | 8 | No advice until this many Eco sessions of 20 minutes or more are collected (half of it for release-based advice) |

## Switches

| Switch | Meaning |
|---|---|
| HESC enabled | Master switch. Off = no evaluation; if HESC owned HPVC, HPVC is restored |
| Shadow mode | Evaluate and log only; never switches HPVC |
| Use local weather station | Shows the irradiance settings and also requires the irradiance thresholds. Off = forecast only |
| HESC switched HPVC off | Ownership flag, set by HESC only. Do not change it manually |
