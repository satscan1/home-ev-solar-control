# Changelog

## v0.4.0 — 2026-09-23

- **Advisor:** plain-language setting advice from the last N days (default 30), only after a minimum number of sessions (default 8). It follows the seasons and notes when the advice moves. Advice only; it never changes settings.
- Advice on the dashboard (`input_text.hesc_advice`) and at the top of the report.
- New settings: *Advice based on last* and *Minimum sessions before advice*.
- Release records now store the charger's start delay.

## v0.3.0 — 2026-09-23

- Generic chargers: EV connected may be a binary **or** a status sensor (configurable "no car" values); power sensors in W or kW; several solar-mode values (comma separated); optional extra solar switch (go-e, Wattpilot).
- Mapping table for common chargers in [Chargers and sources](docs/05-chargers-and-sources.md).
- Dashboard redesigned in the HPVC layout: badges, horizontal toggles, live inputs, control-state timeline and an apexcharts forecast vs actual graph.
- Local weather station toggle now hides its settings and switches irradiance off completely.
- New diagnostic helpers `sensor.hesc_diag_*` / `binary_sensor.hesc_diag_*` (power sensors update once per minute).

## v0.2.0 — 2026-09-23

- Source reliability: every 15 minutes in daylight, the forecast (median and cautious), actual PV and irradiance are logged, also without charging. Intervals with HPVC limiting are flagged.
- Report section *How reliable are the sources?* with per-day trend.
- Weather station fully optional; the report shows *off* when none is configured.
- New guide: [Chargers and sources](docs/05-chargers-and-sources.md) — mapping any charger, other forecasts, template helpers, tested setup (Wallbox Pulsar Plus).
- Documentation generalized; credits for layout and conventions to HPVC and HBC.

## v0.1.0 — 2026-09-23

- First preview, released in shadow mode.
- Home Assistant package with source selection, thresholds, timing, switches, status and report helpers.
- Node-RED flow with four tabs: Inputs, Engine, Outputs, Reports.
- Release state machine with hysteresis, stability timer, cooldown, daily attempt limit and an ownership flag.
- Forecast vs actual per Eco charging session and per day; JSONL history.
- On-demand HTML support report.
- Separate dashboard (Main, Settings).
