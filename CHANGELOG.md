# Changelog

## v0.6.0 — 2026-09-26

**Requires Home PV Control v1.5.1 or newer.**

Release through HPVC's request/confirm interface
- HESC no longer switches HPVC off. It turns `input_boolean.hpvc_external_release_request` on and waits for `binary_sensor.hpvc_external_release_active` before it counts a release and starts waiting for the charger.
- New state *Release requested, waiting for HPVC*. No confirmation within 5 minutes → the request is withdrawn and logged as *HPVC busy (status)*; the normal cooldown follows. No forced release.
- HPVC keeps all its own priorities (safety, restore, negative price, Night Restore, HBC transitions). HESC's own HPVC status gate and all-in price guard are no longer used.
- A request left on after a restart is withdrawn as soon as HESC is idle.
- The old method (switch HPVC off, set inverters to full) stays available as a fallback, **off** by default: `input_boolean.hesc_release_legacy`.
- No release when the EV is already full (optional battery-level sensor).

Charge plan (new)
- *Charge plan* tab: one-off (day, time, goal) and every week (days, time, goal), with a price chart and the planned quarters.
- `sensor.hesc_charge_plan` works out the energy needed and picks the cheapest known quarters before the deadline.
- New Node-RED node *Charge plan* (Engine tab) starts and stops the charger: in planned quarters, as a safety net when time runs short, and optionally below a set price (*take cheap chances*).
- Charger-independent: fill in a start/stop switch (`input_text.hesc_charger_start_stop_entity`) **or** a "charge now" mode value (`input_text.hesc_charger_grid_mode_value`); the day-ahead price sensor is a setting too (`input_text.hesc_price_sensor`). All on Settings → step 3 → *Charge plan*.
- Afterwards, or when the charger stops by itself (EV full, charge limit), the charger goes back to how it was before charging started (previous switch state / previous mode) and is left alone for the rest of the plan. A charge HESC did not start is never taken over.
- Restart safety: `input_boolean.hesc_plan_owns_charging`. Status: `input_text.hesc_plan_status`.

Dashboard
- Main: master-control text describes the release request; *HPVC released PV* tile while HPVC confirms a release.
- Settings: new block *Charge plan* in step 3 (start/stop switch or mode value, price sensor).

Defaults (from the test installation, 8 real solar starts over 3 days)
- Forecast power to start / hold: 2 500 / 2 000 W → **1 500 / 1 200 W**. The lowest cautious forecast at a real start was 1 504 W; the Solcast cautious estimate was up to ~30% below actual PV.
- Irradiance to start / hold: 400 / 300 W/m² → **150 / 120 W/m²** (≈ 10 W PV per W/m²; 6 of 8 real starts happened below 400 W/m²).
- Existing installations keep their own values; only new installs get the new defaults.

Wish list: expected prices beyond the known day-ahead prices (from own price history).

## v0.5.2 — 2026-09-25

- Optional EV battery level: `input_text.hesc_ev_soc_sensor` and `input_number.hesc_ev_full_soc` (default 100%).
- The battery level is stored at the start and end of every session. A release that ends at *full* is logged as **EV full** and does not count as failed.
- Advisor: *EV full* releases are left out of *releases without charging*. The report shows *(EV x→y%)*.

## v0.5.1 — 2026-09-25

- HPVC status gate (for HPVC v1.5.0): release only in a normal HPVC state (not at negative price, Night Restore, HBC Charge Priority, faults or auto-resume; all-in price above zero).
- After switching HPVC off, HESC set the HPVC inverters to full itself and kept them there. (Since v0.6.0 this is the legacy fallback.)

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
