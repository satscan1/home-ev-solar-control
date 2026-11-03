"""Constants for HESC v3.

Defaults are the v2.0.0 defaults (reference/v2.0.0/hesc_flow.json, "Evaluate HESC" node,
and hesc_config.yaml). Nothing here is tuned to one household.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Final

DOMAIN: Final = "hesc"
NAME: Final = "HESC v3"
VERSION: Final = "3.1.3"  # same as manifest.json (tests/test_manifest_version)
BUILD_DATE: Final = "03-11-2026"  # date of this build, shown next to the version under the logo on Main; set to the release date when a release is made

# v2 runs its decision round every 30 s; v3 reads its inputs at the same pace.
UPDATE_INTERVAL: Final = timedelta(seconds=30)

# Setup choices (config entry data / options)
CONF_CHARGER_TYPE: Final = "charger_type"
CONF_PV_POWER: Final = "pv_power_sensor"
CONF_GRID_POWER: Final = "grid_power_sensor"
CONF_GRID_EXPORT_POSITIVE: Final = "grid_export_positive"
CONF_FORECAST_NOW: Final = "forecast_now_sensor"
CONF_FORECAST_30M: Final = "forecast_30m_sensor"
CONF_FORECAST_ATTRIBUTE: Final = "forecast_attribute"
CONF_SOLAR_TODAY: Final = "solar_today_sensor"
CONF_CHARGER_CURRENT: Final = "charger_current_entity"  # charging current control
CONF_SOLAR_TOMORROW: Final = "solar_tomorrow_sensor"
CONF_USE_IRRADIANCE: Final = "use_irradiance"
CONF_IRRADIANCE: Final = "irradiance_sensor"
CONF_EV_CONNECTED: Final = "ev_connected_sensor"
CONF_EV_DISCONNECTED_VALUES: Final = "ev_disconnected_values"
CONF_EV_POWER: Final = "ev_power_sensor"
CONF_EV_SOC: Final = "ev_soc_sensor"
CONF_EV_GREEN_ENERGY: Final = "ev_green_energy_sensor"
CONF_CHARGER_MODE: Final = "charger_mode_entity"
CONF_CHARGER_ECO_VALUES: Final = "charger_eco_values"
CONF_CHARGER_SOLAR_SWITCH: Final = "charger_solar_switch_entity"
CONF_CHARGER_START_STOP: Final = "charger_start_stop_entity"
CONF_CHARGER_RESUME: Final = "charger_resume_entity"
CONF_STANDALONE: Final = "standalone"
CONF_HPVC_ENABLED: Final = "hpvc_enabled_entity"
CONF_HPVC_LIMITED: Final = "hpvc_limited_entity"
CONF_USE_HPVC_SOURCES: Final = "use_hpvc_sources"
# since rc3 (phase advice): grid power per phase, optional
CONF_GRID_POWER_L1: Final = "grid_power_l1_sensor"
CONF_GRID_POWER_L2: Final = "grid_power_l2_sensor"
CONF_GRID_POWER_L3: Final = "grid_power_l3_sensor"
CONF_GRID_POWER_PHASES: Final = (CONF_GRID_POWER_L1, CONF_GRID_POWER_L2, CONF_GRID_POWER_L3)

# HPVC's own settings: v2 takes PV and grid power from these when "use HPVC sources" is on.
HPVC_PV_HELPER: Final = "input_text.hpvc_pv_power_sensor"
HPVC_GRID_HELPER: Final = "input_text.hpvc_grid_power_sensor"

CHARGER_OTHER: Final = "Other (manual)"
CHARGER_NOT_CHOSEN: Final = "Not chosen"

# v2.0.0 defaults (Evaluate HESC: C = {...})
DEFAULT_ECO_VALUES: Final = "eco_mode"
DEFAULT_DISCONNECTED_VALUES: Final = (
    "off,disconnected,ready,available,no_ev_connected,unplugged,not_connected,no car,idle,ev disconnected"
)
DEFAULT_HPVC_ENABLED: Final = "input_boolean.hpvc_enabled"
DEFAULT_HPVC_LIMITED: Final = "binary_sensor.hpvc_pv_limited"
DEFAULT_FORECAST_ATTRIBUTE: Final = "estimate10"

# What v2 fills in once on a new install, as far as the setup screen is concerned
# (automations hesc_apply_defaults_on_first_install and hesc_apply_defaults_v120).
# Standalone is added when HPVC is not found. Tuning values follow with the tuning entities.
FIRST_INSTALL_DEFAULTS: Final[dict[str, str | bool]] = {
    CONF_USE_HPVC_SOURCES: True,
    CONF_USE_IRRADIANCE: False,
    CONF_FORECAST_NOW: "sensor.solcast_pv_forecast_power_now",
    CONF_FORECAST_30M: "sensor.solcast_pv_forecast_power_in_30_minutes",
    CONF_FORECAST_ATTRIBUTE: DEFAULT_FORECAST_ATTRIBUTE,
    CONF_CHARGER_ECO_VALUES: DEFAULT_ECO_VALUES,
    CONF_HPVC_ENABLED: DEFAULT_HPVC_ENABLED,
    CONF_HPVC_LIMITED: DEFAULT_HPVC_LIMITED,
    CONF_SOLAR_TODAY: "sensor.solcast_pv_forecast_forecast_today",
    CONF_SOLAR_TOMORROW: "sensor.solcast_pv_forecast_forecast_tomorrow",
}

# States v2 treats as "no value" (BAD list in Evaluate HESC).
BAD_STATES: Final = ("unknown", "unavailable", "none", "")
