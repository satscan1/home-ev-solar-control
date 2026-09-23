# HESC v0.1.0

First preview of Home EV Solar Control, a companion for Home PV Control (HPVC) and Home Battery Control (HBC).

- Ships in **shadow mode**: it evaluates and logs, but never switches HPVC.
- Files: `home assistant/hesc_config.yaml`, `home assistant/hesc_dashboard.yaml`, `node-red/hesc_flow.json`.
- Upgrade path: none (first release).

Known limitations:

- Thresholds compare forecast **production**, not surplus.
- The dashboard does not yet hide the irradiance fields when irradiance is disabled.
- The effect of HPVC being off on HBC strategy control has not yet been assessed.
