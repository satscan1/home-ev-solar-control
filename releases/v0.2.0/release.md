# HESC v0.2.0

Source reliability and a generalized setup.

- **New:** every 15 minutes in daylight HESC logs forecast (median and cautious), actual PV and irradiance, also without charging.
- **New:** report section *How reliable are the sources?* (actual/forecast, within ±20%, cautious forecast held, PV per kW/m², irradiance ↔ PV correlation, per-day trend).
- **Changed:** the weather station is fully optional.
- **Docs:** [Chargers and sources](../../docs/05-chargers-and-sources.md), tested setup (Wallbox Pulsar Plus + Solcast + Ecowitt), credits to HPVC and HBC.
- Still ships in **shadow mode**.

Upgrade from v0.1.0:

1. Replace `/config/packages/hesc_config.yaml` (no helper changes; a restart is not required).
2. Re-import `node-red/hesc_flow.json` and choose **Replace** for the existing nodes, or paste the new code into *Evaluate HESC* and *Build HESC report (HTML)*. Deploy.
3. Generate the report after at least 15 minutes of daylight.

Known limitations:

- Thresholds compare forecast **production**, not surplus.
- The dashboard does not yet hide the irradiance fields when irradiance is disabled.
- Only the Wallbox Pulsar Plus has been tested.
- The effect of HPVC being off on HBC strategy control has not yet been assessed.
