# Changelog

## v0.5.0 — 2026-09-24

**Settings and onboarding**
- Settings in three steps: *1 · Your charger* (the only required fields), *2 · Taken over automatically* and *3 · Advanced*, with separate switches for thresholds, timing and advice.
- PV and grid power are taken over from Home PV Control (`input_boolean.hesc_use_hpvc_sources`, kept in sync by an automation). Switch it off to pick other sensors.
- **Charger type** selection (`input_select.hesc_charger_type`) for 10 chargers plus *Other (manual)*: fills in the brand values, suggests the charger entities (language independent) and fills a field only when exactly one match is found. All charger data sits in one table (`sensor.hesc_charger_profile`).
- Setup check `binary_sensor.hesc_configuration_valid` with a checklist and live values. Until the essentials are filled in, Main shows only a welcome card (same idea as HPVC's onboarding).

**Charger-independent wording and data**
- All texts say *solar mode* / *solar session* instead of the Wallbox term *Eco*.
- Manual or scheduled starts (charger in solar mode while forecast and PV are both below the hold threshold) are logged as `forced_start` and left out of the advice, the accuracy figures and the daily solar totals. Works for every charger.
- "Today so far" now states that the figures cover solar charging only.

**Dashboard**
- *Solar forecast vs actual · EV*: EV charging mirrored below zero, forecast as a filled area behind actual PV.
- New *Solar charging forecast*: today and tomorrow in 30-minute bars, coloured by the current settings (green = can start, orange = keeps charging, grey = too little sun).
- New *Expected solar charging* bar from sunrise to sunset (needs button-card; hidden without it).
- Report tile works like HPVC: *Generate report* → *View report* → back after opening (webhook automation `hesc_reset_report_after_view`).

**Report**
- Same structure as the HPVC report: header with Download button, section tabs, executive summary, live status cards, collapsible sessions and events.
- Whole numbers for W, W/m² and minutes; plain-language day counters.
- Opened through `/local/hesc/open.html`, which always loads the newest report (the browser caches `/local` files for a month). Written by the flow on every report.

**Solcast**: the 30-minute view uses the half-hourly breakdown (`attr_brk_halfhourly`); without it the hourly values are used.

## v0.4.1 — 2026-09-23

- Advisor: threshold advice is now based on the **derived surplus** (cautious forecast − house and battery use, from PV + grid − EV at the start of each Eco session) and translated back to the **gross start threshold** that HESC uses. The regulation itself is unchanged.
- Fallback: without a grid power sensor the advice uses the gross forecast and says so; fewer than the minimum usable sessions → no advice.

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
