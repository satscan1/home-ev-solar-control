# HESC v0.5.0

Simpler settings, charger type selection and a report in the HPVC style.

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

Upgrade from v0.4.x: replace `home assistant/hesc_config.yaml`, re-import `node-red/hesc_flow.json` (Replace) and the dashboard, restart Home Assistant and deploy.
