# HESC v0.3.0

More chargers and the HPVC dashboard layout.

- **Chargers:** status sensors, kW power, several solar-mode values and an optional extra solar switch. Mapping table for Wallbox, Alfen, Peblar, Zappi, go-e, Wattpilot, SMA, evcc, Ohme and Easee in [Chargers and sources](../../docs/05-chargers-and-sources.md).
- **Dashboard:** same layout as Home PV Control — badges, horizontal toggles, live inputs, control-state timeline, forecast vs actual graph (apexcharts-card).
- **Weather station:** one toggle; when off, its fields are hidden and irradiance is not used or logged.
- Still ships in **shadow mode**.

Upgrade from v0.2.0:

1. Replace `/config/packages/hesc_config.yaml` and restart Home Assistant (new helpers and template entities).
2. If your recorder uses an include list, add the eight `hesc_diag_*` entities (see the package comments).
3. Re-import `node-red/hesc_flow.json` (Replace) or paste the new *Evaluate HESC* and *Build HESC report (HTML)* code. Deploy.
4. Replace the dashboard with `home assistant/hesc_dashboard.yaml` (install apexcharts-card from HACS first).

Known limitations:

- Thresholds compare forecast **production**, not surplus.
- Only the Wallbox Pulsar Plus has been tested in practice; the other chargers are mapped from their integration source code.
- The effect of HPVC being off on HBC strategy control has not yet been assessed.
