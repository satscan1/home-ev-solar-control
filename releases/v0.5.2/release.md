# HESC v0.5.2

Optional EV battery level, used to explain sessions (not to control them).

- New optional fields: `input_text.hesc_ev_soc_sensor` and `input_number.hesc_ev_full_soc` (default 100%).
- Battery level stored at the start and end of every session; a stop at full is logged as **EV full** and does not count as a failed release.
- Advisor and report: *EV full* releases are left out of *releases without charging*; sessions show *(EV x→y%)*.

Upgrade from v0.5.1: replace `home assistant/hesc_config.yaml`, re-import the flow and deploy.
