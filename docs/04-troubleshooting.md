# Troubleshooting

| Reason shown | Check |
|---|---|
| `Waiting for inputs: …` | The listed source is empty, misspelled or unavailable (see Settings and the report's *Live inputs*) |
| `HPVC is not limiting PV — nothing to release` | Normal: HPVC is not curtailing, so the charger can already use surplus |
| `Charger not in Eco mode` | The mode entity does not equal the configured Eco value |
| `Forecast too low` | The cautious forecast (now or +30 min) is below the start threshold |
| `Cooldown until …` | A release ended recently |
| `Maximum release attempts reached today` | Too many failed releases today; resets at midnight |

**No source reliability data.** Records are written every 15 minutes in daylight, only when the forecast and PV sensors are valid. Wait at least 15 minutes after sunrise or after a restart.

**Irradiance shows *off*.** No irradiance sensor is set. That is fine: HESC works on the forecast alone.

**The report is empty.** Sessions are written when they end. Charge first, then generate the report again. Refresh the browser if an old version is shown.

**HPVC stays off.** HESC always restores HPVC on Node-RED startup when it owned it. If HPVC was switched off by someone else, HESC does not touch it (ownership flag off).
