# Changelog

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
