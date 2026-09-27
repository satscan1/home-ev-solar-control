# Troubleshooting

| Reason shown | Check |
|---|---|
| `Waiting for inputs: …` | The listed source is empty, misspelled or unavailable (see Settings and the report's *Live inputs*) | 
| `HPVC is not limiting PV — nothing to release` | Normal: HPVC is not curtailing, so the charger can already use surplus |
| `Waiting for HPVC to confirm the release (x/5 min, HPVC: …)` | Normal for a short while: HPVC finishes its own higher-priority state, cooldown or write confirmation first |
| `Release ended: HPVC busy (…), no release confirmation within 5 min` | HPVC stayed in a higher-priority state (for example negative price, Night Restore, HBC transition). HESC tries again after the cooldown. Check `input_text.hpvc_status` and `hpvc_reason` |
| `HPVC has no external release interface (needs HPVC 1.5.1 or newer)` | Upgrade HPVC. Until then no releases happen (or switch on the legacy fallback) |
| `EV already full, no release needed` | The battery level is at *EV counts as full at* |
| `Charger not in solar mode` | The mode entity does not match the configured solar mode value(s), or the extra solar switch is off |
| `Forecast too low` | The cautious forecast (now or +30 min) is below the start threshold |
| `Cooldown until …` | A release ended recently |
| `Maximum release attempts reached today` | Too many failed releases today; resets at midnight |

**No source reliability data.** Records are written every 15 minutes in daylight, only when the forecast and PV sensors are valid. Wait at least 15 minutes after sunrise or after a restart.

**Irradiance shows *off*.** The local weather station is switched off or no irradiance sensor is set. That is fine: HESC works on the forecast alone.

**The report is empty.** Sessions are written when they end. Charge first, then generate the report again. Refresh the browser if an old version is shown.

**The release request stays on.** HESC switches it off as soon as it is idle. If HESC is disabled, switch `input_boolean.hpvc_external_release_request` off by hand; HPVC then resumes.

**HPVC stays off (legacy fallback only).** HESC restores HPVC on Node-RED startup when it owned it. If HPVC was switched off by someone else, HESC does not touch it (ownership flag off).

## Charge plan

| Plan status | Check |
|---|---|
| `Grid charging not set up (Settings → Charge plan)` | Settings → step 3 → *Charge plan*: fill in the start/stop switch or the "charge now" mode value |
| `No active plan` | Switch the one-off or weekly plan on |
| `Waiting for the next planned quarter` | Normal. The planned quarters are shown green in the price chart |
| `EV already charging, left alone` | The car was already charging (for example on sun). HESC does not take it over |
| `Finished, charger stopped by itself` | The charger drew no power for a few minutes (car full or its own charge limit). HESC put it back and waits for the next plan |
| Prices known only until tonight | Normal before the next day's prices are published (about 13:00). The plan firms up then; the safety net still meets the deadline |
