# Settings

## Sources (`input_text.hesc_*`)

| Helper | Required | Description |
|---|:-:|---|
| `hesc_forecast_now_sensor` | ✅ | Forecast PV power now (W) |
| `hesc_forecast_30m_sensor` | ✅ | Forecast PV power in 30 minutes (W) |
| `hesc_forecast_attribute` | | Attribute to use instead of the state, e.g. `estimate10` (Solcast cautious estimate). Empty = state |
| `hesc_irradiance_sensor` | | Local irradiance (W/m²), optional. Always logged for source reliability; used for decisions only when *Use irradiance as confirmation* is on |
| `hesc_pv_power_sensor` | ✅ | Actual PV power (W), used for forecast vs actual |
| `hesc_grid_power_sensor` | | Grid power (W, negative = export), for context in the history |
| `hesc_ev_connected_sensor` | ✅ | Binary sensor: EV connected |
| `hesc_ev_power_sensor` | ✅ | EV charging power (W) |
| `hesc_ev_green_energy_sensor` | | Charger's solar energy counter (kWh), for the solar share per session |
| `hesc_charger_mode_entity` | ✅ | Charger mode entity (select/sensor) |
| `hesc_charger_eco_value` | ✅ | The value of that entity that means Eco/solar mode, e.g. `eco_mode` |
| `hesc_hpvc_enabled_entity` | ✅ | Default `input_boolean.hpvc_enabled` |
| `hesc_hpvc_limited_entity` | ✅ | Default `binary_sensor.hpvc_pv_limited` |

How to map your own charger: [Chargers and sources](05-chargers-and-sources.md).

## Thresholds and timing

See the *Shipped defaults* table in the [README](../README.md#shipped-defaults).

## Switches

| Switch | Meaning |
|---|---|
| HESC enabled | Master switch. Off = no evaluation; if HESC owned HPVC, HPVC is restored |
| Shadow mode | Evaluate and log only; never switches HPVC |
| Use irradiance as confirmation | Also require the irradiance thresholds. Ignored when no irradiance sensor is set or it is unavailable |
| HESC switched HPVC off | Ownership flag, set by HESC only. Do not change it manually |
