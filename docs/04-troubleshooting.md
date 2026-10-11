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

**The charger does not start although HESC asks, or starts when it shouldn't.** Check whether a charging schedule is set in the charger's own app or in another integration, and switch it off: two planners on one charger get in each other's way. After an update of the charger app or firmware a schedule can appear by itself.

**Right after a Home Assistant restart some values are empty, or the setup check shows a red ❌.** Normal; it fixes itself. Prices, settings and the setup check are back at once; the EV battery level, the costs and the notice line within about 5 minutes; the price forecast within 15 minutes; the start threshold advice within a few minutes. Still red after 15 minutes? Then something really is missing, and the right settings open by themselves.

**No source reliability data.** Records are written every 15 minutes in daylight, only when the forecast and PV sensors are valid. Wait at least 15 minutes after sunrise or after a restart.

**Irradiance shows *off*.** The local weather station is switched off or no irradiance sensor is set. That is fine: HESC works on the forecast alone.

**The report is empty.** Sessions are written when they end. Charge first, then generate the report again. Refresh the browser if an old version is shown.

**The release request stays on.** HESC switches it off as soon as it is idle. If HESC is disabled, switch `input_boolean.hpvc_external_release_request` off by hand; HPVC then resumes.

**HPVC stays off (legacy fallback only).** HESC restores HPVC on Node-RED startup when it owned it. If HPVC was switched off by someone else, HESC does not touch it (ownership flag off).

## Charge plan

| Plan status | Check |
|---|---|
| `Grid charging not set up (Settings → Charge plan)` | Settings → step 3 → *Charge plan*: fill in the start/stop switch or the "charge now" mode value |
| `No active plan` | Switch the *one day, every week* plan or the weekly plan on. Without an active plan HESC only charges on sun, for cheap chances and to keep the EV at *EV counts as full at* |
| `Waiting for the next planned quarter` | Normal. The planned quarters are shown in amber in the price chart |
| *Prices not available* on the Charge plan tab | `sensor.hesc_prices` has no prices right now. Check Settings → step 3 → *Charge plan*: **Price source** (*Price list in sensor* for a sensor with a price list; the other choices for sources that only work through an action) and **Price sensor**. Check or reload the price integration; the chart returns by itself. See [Energy prices](05-chargers-and-sources.md#energy-prices) |
| Wrong currency or wrong small unit (ct instead of öre) | Settings → *Charge plan* → **Currency**: *Automatic* takes it from the price sensor (`currency` attribute or unit). Pick your currency when your price sensor does not say |
| Amounts written with a comma where you expect a point (or the other way round) | HESC follows the time zone set in Home Assistant (Settings → System → General). Check it is your own |
| `Final check: below goal, charging to goal` | Normal in the last hour before the ready-by time when the EV is still below its goal. HESC charges to the goal whatever the price |
| Notification *EV goal missed* (P1) | At the ready-by time the EV was more than 3% below its goal. The message shows the level it reached; check the charger, the plan settings and the report |
| `EV already charging, left alone` / *☀ charging by itself* | The car was already charging (for example on sun). HESC does not take it over; choose full power in the charger app if you need it |
| *⚠ not enough time left for the goal* | Normal warning: the planned quarters have moved past the ready-by time. The safety net and the final check still charge; the goal may be missed |
| `Finished, charger stopped by itself` | The charger drew no power for a few minutes (car full or its own charge limit). HESC put it back and waits for the next plan |
| Prices known only until tonight | Normal before the next day's prices are published (about 13:00). After the first full day the plan also uses expected prices (grey bars) and firms up when the real prices arrive; the safety net still meets the deadline |
| No grey *Expected price* bars | `sensor.hesc_price_forecast` has no quarters yet: it needs at least one full day of prices in the history (`hesc-data/price_history.json`), and only shows after the last known price (before about 13:00 the chart shows them for tomorrow) |
| `Within 3% of goal (x%, charges below y%)` | Normal: grid charging only starts more than 3% below the goal |
| `Cheap chance skipped: enough sun today (…)` | Normal: the sun is expected to cover the need later today. Lower *Cheap when below* or switch *take cheap chances* off if you prefer |
| `Minimum charge: below x%, waiting for the cheapest quarter (hh:mm), ready by hh:mm` | Normal: the optional minimum charge waits for the cheapest quarter in its window |
| Charger stays *paused* after charging | Normal with a start/stop switch: it comes back on for sun, a drop of more than 3%, a new plan or when you unplug. To charge now, switch it on yourself; HESC leaves a charge it did not start alone |
| Notification *Charger fault* | HESC tried 3 times to switch the charger back on. Check the charger (cloud connection) |
| Charger paused, then back in solar mode after grid charging | Normal with *Back to solar mode* filled in (Wallbox *Resume schedule*). HESC first waits until the pause has really taken effect (`pause_retry` in the history when it had to pause again) |
| Charger charged from the grid for a minute or two after a cheap chance or plan ended | Cloud chargers carry out commands about a minute late. HESC pauses again until the charger really stopped; after 3 attempts it returns it to solar mode anyway (`pause_failed`). Several times a day? Check the charger's cloud connection |
| A cheap chance does nothing while the price is low | Without an active plan a cheap chance only charges below *EV counts as full at* (minus the 3% margin). With a plan it charges to the plan goal |
| Weekly plan does nothing | Check **Holiday mode** under the weekly plan. With an end date it switches itself off the day after |

## Home battery and EV

Shown on Main under *Control States* while the EV is plugged in, and in `input_text.hesc_kick_status`.

| Status | Check |
|---|---|
| `Not set up: start/stop switch and back-to-solar entity needed` | Settings → step 3 → *Charge plan*: fill in the start/stop switch and *Back to solar mode* |
| `Not set up: home battery size and level sensors needed` | Settings → step 3 → *Home battery and EV* → *Settings* |
| `Waiting: home batteries not taking the sun` | Normal: the home battery is not charging, so the charger can already see the surplus |
| `Waiting: forecast now …` | The cautious forecast is below the start threshold |
| `Home batteries first for the rest of today` / `Sun left today for the home batteries (…)` | Not enough sun left for both; the home battery gets it |
| `Kickstart: charger started, waiting until the home battery control sees the EV` → `Kickstart: charger paused, back to solar mode in a moment` → `Kickstart: waiting for the charger to start on sun` | A kickstart in progress |
| `Home batteries first: EV paused, charger back to waiting for sun` | Later in the day: the rest of the sun goes to the home battery |
| `Done for today (…)` | The maximum number of kickstarts was reached, or the home battery got priority. Starts again tomorrow |
| `Charge plan has the charger` / `HPVC release running` | Normal: the kickstart waits |
| The home battery delivers some power to the EV for a moment | Expected during the short start, until the battery control sees the EV |

## Notices and notifications

The line at the top of Main shows *✓ No notices*, or the most important notice with its time. Tap it to go where you can act.

| Notice | Meaning |
|---|---|
| **P1** (red, also on your phone as time-sensitive) | The charge goal was missed or cannot be confirmed, or a real fault (for example the charger did not respond 3 times). Stays on Main for 12 hours |
| **P2** (orange) | A sensor is missing, but HESC keeps working (for example the battery level is estimated). Stays as long as the problem lasts |
| **P3** (grey, Main only) | Just so you know (for example *Apply advice automatically* changed the start threshold). Two hours |

| Symptom | Check |
|---|---|
| No notifications on the phone | Settings → step 3 → *Charge plan*: pick your phone under *Add or remove a phone* (✓ = gets notifications) and press *Send a test notification*. Only P1 and P2 go to the phone. Quiet hours are set on the phone or in Home Assistant, not in HESC |
| *EV battery level* (P2) | The battery-level sensor has no value. HESC uses a second sensor of the same car, the last level plus what was charged, or the usual level at plug-in. Check the car integration; the notice goes away by itself |
| *EV goal not confirmed* | At the ready-by time the EV was plugged in but no battery level was known at all. Check the car |
| No morning summary | Switch it on (Settings → *Charge plan* → *Morning summary every day*) and pick a phone. It is sent within 60 minutes after the chosen time, once a day |

## Costs

| Symptom | Check |
|---|---|
| No *Costs* badge on Main | Switch on **Charging costs** (Settings, *Use*). The page needs button-card (HACS) |
| *no data yet* on earlier days | HESC counts from the moment v2.0.0 runs; there is no history from before |
| A warning about grid energy without a price | Some grid charging happened while no price was known; it is counted separately and left out of the costs |
| Costs too high or too low | Check *all-in* or mark-up and VAT under Settings → *Charging costs*. Changing them recalculates the whole history |
| The CSV opens in one column | Separator and decimal mark follow your country (`;` with a decimal comma, `,` with a decimal point). Open the file with *Data → From text/CSV* and pick the separator |

