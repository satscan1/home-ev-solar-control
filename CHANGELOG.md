# Changelog

## v2.0.0 — 2026-10-11

**One dashboard, any country: prices, costs and notifications grown up.**

A major release: many new parts, and a few changes existing users will notice (the one-off plan now comes back every week, money fields are *per kWh* in your own currency, Main and Charge plan have a new layout). Read [Upgrade from v1.4.0](releases/v2.0.0/release.md#upgrade-from-v140) before you install.

Prices
- New price adapter: `sensor.hesc_prices` turns every supported price source into one list of quarters (`raw_today` / `raw_tomorrow`). The charge plan, the price chart, the price forecast and the cost counter all read it.
- New settings `input_select.hesc_price_source` (*Price list in sensor*, *EnergyZero / ANWB Energie*, *EasyEnergy*, *Tibber*, *Nord Pool (official)*) and `input_select.hesc_price_resolution` (*Automatic*, *Per quarter*, *Per hour*). A price list in a sensor is recognised by its field names: Nord Pool (HACS), ENTSO-E, Energi Data Service, EPEX Spot, Frank Energie, Zonneplan, Octopus (half-hourly), Amber Electric (half-hourly, `forecasts` / `per_kwh`) and Spain's PVPC (`price_00h` … `price_next_day_23h`). Sources that only answer an action are fetched every 30 minutes by `sensor.hesc_price_fetch`. Hourly and half-hourly prices become equal quarters; prices per MWh are converted to kWh.
- Currencies EUR, SEK, DKK, NOK, GBP and AUD. New `input_select.hesc_currency`: *Automatic* (default) takes the currency from the price sensor (`currency` attribute or unit, e.g. `SEK/kWh`, `£`, `$`). `sensor.hesc_prices` gives `currency`, `symbol`, `minor` (ct, öre, øre, p, c), `symbol_after`, `decimal` and `fx_vs_eur`.
- Amounts are written the way the country does it, taken from the Home Assistant time zone: decimal comma in most of Europe, decimal point in the UK, Ireland, Malta, Switzerland and outside Europe; the euro after the amount in e.g. Germany, Spain, France and Italy (`1,12 €`), before it in the Netherlands, Belgium, Austria and Ireland (`€ 1,12`); kronor after the amount (`1,12 kr`); no space after the sign with a decimal point (`£1.12`). No new setting.
- The three money fields (mark-up, feed-in compensation, *Cheap when below*) are now *per kWh* in your own currency, with a wider range.
- HESC uses the Home Assistant time zone for day boundaries everywhere (was fixed to Europe/Amsterdam).

Price forecast
- Weekend days and working days are forecast separately (last 8 weekend days / 14 working days); public holidays count as weekend days, read from the Workday integration's calendar (found through the integration itself, whatever its name). Back-tested over 30 days: average error per day 4.8 → 4.3 ct.
- The built-in default for the Dutch market and the 2 ct waiting margin are scaled to your currency; your own history corrects them.

Charging costs (new, optional)
- New node *Charging costs (sun / grid)* on the Engine tab. Every 30 seconds it splits the EV's charging power into grid (at most what comes from the grid) and sun (the rest, which includes energy from a home battery), and prices the grid part at the price of that quarter. Grid energy without a known price is counted separately; when grid power is unknown everything counts as grid. Gaps longer than 2 minutes (restarts) are skipped, never estimated. Day totals in `hesc-data/charging_costs.json` (about 3 years), published every 5 minutes as `sensor.hesc_charging_costs` (last 100 days, all months, today).
- New **Costs** page (opened with the *Costs* badge on Main, switch `input_boolean.hesc_costs_enabled`): a calendar per day, and tiles per week, month, quarter and year; green = sun, grey = grid, ▲▼ = more expensive / cheaper than the period before. Settings: value of a solar kWh (`input_number.hesc_feed_in_price`), *Price from the price source is already all-in* (`input_boolean.hesc_costs_all_in`), or mark-up per kWh (`input_number.hesc_costs_markup`) and VAT (`input_number.hesc_costs_vat`). The costs are stored without mark-up and VAT, so changing them recalculates the whole history.
- **Export to spreadsheet (CSV)** (`input_button.hesc_costs_export`): writes `hesc-data/charging_costs_days.csv` and `charging_costs_months.csv` (overwritten every time). Separator and decimal mark follow the country (`;` with a decimal comma, `,` with a decimal point), so Excel opens it in columns.
- `sensor.hesc_expected_charge_cost` uses the same rule as the Costs page and only counts grid charging that will really happen (0 while the plan leaves a charging EV alone). New attribute `display` with the amount in your currency.

Charge plan
- The one-off plan now **comes back every week** on the same day and time: *Charging plan · one day, every week*. This reverses the v1.4.0 choice. Switch *Active* off when you only need it once.
- New **Holiday mode** (`input_boolean.hesc_vacation`, optional end date `input_datetime.hesc_vacation_until`): the weekly plan does nothing, the one-day plan stays active, solar charging carries on. The day after the end date it switches itself off (automation *HESC - Holiday mode ends*).
- Fixed: a cheap chance without an active plan charged towards the goal of the inactive plan (for example 100%) and could fill a car that already counted as full. The goal is now the plan goal when a plan is active, otherwise *EV counts as full at*, also for the top-up and the solar check.
- Fixed: after grid charging, *Back to solar mode* could be pressed while the charger was still charging (cloud chargers carry out a command about a minute late, and a start sent just before can still arrive), so the grid charge went on. HESC now checks that the pause took effect; while the EV still charges or the switch is still on it pauses again and waits a minute (at most 3 times, `pause_retry`), then returns to solar mode (`pause_failed` when it was still charging).
- A refused grid start is retried after 5 minutes, at most 3 times (`grid_start_retry`), never when the EV is (nearly) at its goal.
- Planned quarters move along with the clock; new warning *not enough time left for the goal*.
- Plan status *☀ charging by itself* when the EV already charges on sun: the plan watches and does not take over.
- *Last action* survives a restart.
- Grid charging by the plan no longer counts as a solar session; a running solar session is closed with *grid charging by plan*.

Notifications
- Pick the phones from a list: `sensor.hesc_notification_phones` finds every device with the Home Assistant app; `input_select.hesc_notify_pick` adds or removes one (✓ = gets notifications); `input_button.hesc_notify_test` sends a test. `input_text.hesc_notify_services` is filled by the list (existing installations keep working).
- Notifications with a priority, short and to the point: **P1** charge goal missed or not confirmable, or a real fault (time-sensitive on the phone, red on Main for 12 hours); **P2** a sensor is missing but HESC keeps working (orange, as long as the problem lasts); **P3** harmless (grey, Main only, 2 hours). P1 and P3 show the time of the event.
- New notice line at the top of Main (`sensor.hesc_notice`): *✓ No notices* or the notice with its time. Tap it to go where you can act (Charge plan or Settings); without a notice it opens the HESC repository.
- New **morning summary** (`input_boolean.hesc_morning_summary`, time `input_select.hesc_morning_summary_time`, 06:00–10:00, off by default): one message a day with the battery level and whether the EV is plugged in, the next plan, sun today, yesterday (kWh, % sun, costs) and whether yesterday's goal was reached. Sent within 60 minutes after the chosen time, once a day.

EV battery level
- Fallbacks when the battery-level sensor from Settings has no value, in this order: a second battery sensor of the same car that HESC finds by itself (no extra field; while charging it only counts when it changed in the last 2 hours), the last level seen during this plug-in plus 90% of what was charged since, and the usual level at plug-in over the last 14 days (25th percentile, at least 5 plug-ins). Result in `sensor.hesc_ev_soc`, used by the engine, the charge plan, the kickstart and the plan sensor. Plug-in levels are kept in `hesc-data/ev_soc_plugins.json` (60 days); the session survives a Node-RED restart (up to 6 hours). Only a real change from unplugged to plugged in counts as a plug-in.
- A P2 notice (and one phone notification per plug-in) when the level is estimated or unknown; a P1 *EV goal not confirmed* at the ready-by time when the EV is plugged in but no level is known at all.
- Live Inputs shows the level and where it came from.

Solar charging
- Home battery and EV: after the kickstart the charger goes straight back to its solar mode as soon as the EV charges, without the pause. Only a start that does not take (no charging after 2 minutes) still gets the pause.
- Optional start threshold per season (`input_boolean.hesc_seasonal_threshold`, off by default): every night at 00:05 June–July 2 500 W, April–May and August–September 2 000 W, March and October 1 500 W, November–February 1 200 W; hold 75%.
- Start threshold advice from your own history, based on **sun share**: the lowest start forecast from which the next 8 sessions together got at least 70% of their energy from the sun (weighted by kWh), rounded to 50 W, between 1 000 and 3 500 W; hold 75%. Fewer than 15 sessions with sun data: the earlier rule (sessions that kept charging). Looks back 30 days, up to 60 in winter when there are fewer than 15 sessions. `sensor.hesc_advice_threshold`, shown in the Status card on Main and on Settings.
- Optional **Apply advice automatically** (`input_boolean.hesc_advice_auto`, off by default): at most one step per 7 days and 200 W per step, only with at least 100 W difference and 8 good sessions on 5 days. It cannot run together with the seasonal threshold. Every change is written to the history (`advice_applied`) and shown as a P3 notice.
- *Solar still to come today* (kWh) in Live Inputs.

Settings
- **Back up settings / Restore back-up / Standard values** (Settings). A back-up writes all HESC settings to `hesc-data/settings_backup.json` plus a dated copy. *Standard values* first makes a back-up, then resets only the tuning (thresholds, timing, advice, final check); sensors, switches, goals and costs stay.
- New *Grid sensor: export is positive* (`input_boolean.hesc_grid_export_positive`) for meters that count the other way round; used by the engine, the cost counter and the report.
- *Solar next 7 days* removed from Settings.
- Setup check: the charge plan line shows the price now in your currency.

Dashboard
- Main: compact Live Inputs and Status tables; the Status card shows the start threshold advice; *EV today* and *Sun vs forecast* moved to Costs and the report; *Home battery and EV* line reads *home batteries x% · charging y W · EV z%*; one solar forecast number, *Forecast HESC uses* (the cautious estimate HESC decides on).
- Charge plan: three narrow sections (one day every week, weekly plan with holiday mode, plan settings) above the plan and the price chart, full width on a phone too. The price-chart title follows your currency (cents, öre, øre, pence; needs card-mod).
- Brighter colours in all charts.
- Built-in guide (English and Dutch) and [Smart charging explained](docs/07-smart-charging-explained.md): one day every week, which goal a cheap chance uses, costs, notices, holiday mode and what to expect right after a Home Assistant restart.

Removed / not included
- The internal performance meter used during development is not part of the release.

Upgrade from v1.4.0: replace `hesc_config.yaml` and the dashboard, re-import the flow, restart Home Assistant. Check the price source, the currency and the money fields in Settings. See the [release notes](releases/v2.0.0/release.md).

## v1.4.0 — 2026-10-07

**The sun shared between home battery and car.**

Home battery and EV (optional)
- New node *Home battery and EV (kickstart)* on the Engine tab. With a home battery, HESC gives the charger a short start when the EV waits in solar mode, the home batteries have been charging above 500 W for 5 minutes, the cautious forecast now is at or above the start threshold, and the sun left today minus 1.2 × what the home batteries still need is at least *minimum sun left for the EV* (default 2 kWh). Sequence: start → pause as soon as the battery control sees the EV (HBC's own EV sensor when set, otherwise EV power) → ~40 s → *Back to solar mode*. A start that does not take is tried once more.
- Back to the home battery: when the EV has charged on sun for 10 minutes or more and the sun left today is at most 1.2 × what the home batteries still need, HESC pauses the charger, returns it to solar mode, and makes no new kickstart that day.
- At most *kickstarts per day* (default 3), at least 30 minutes apart; nothing while a charge plan has the charger, during an HPVC release or after sunset. HESC never controls the home battery.
- New helpers `input_boolean.hesc_kick_enabled`, `hesc_show_kick_settings`, `input_text.hesc_home_battery_soc_sensors`, `hesc_home_battery_power_sensors`, `hesc_kick_status`, `input_number.hesc_home_battery_kwh`, `hesc_kick_max_per_day`, `hesc_kick_min_ev_kwh`. History type `home_battery_ev` (left out of the solar sessions in the report and the Advisor). Status line on Main under *Control States* while the EV is plugged in.

Charge plan
- New optional *Back to solar mode* (`input_text.hesc_charger_resume_entity`): after grid charging HESC pauses the charger and presses it about a minute later, so the charger returns to its own solar mode. Wallbox: *Resume schedule*, filled in by the charger search. Without it the charger stays paused as before.
- One-off plan: the deadline is fixed when you choose the day and time; *Tomorrow* no longer rolls on at midnight, and the plan stops after its deadline.
- Goal check writes `goal_unknown` instead of `ok` when the EV is not plugged in.
- History: charger mode, start/stop switch and EV power on every record; `plan_changed` when a plan changes.
- New `sensor.hesc_expected_charge_cost` (EUR): grid kWh of the active plan × the average planned price, sun counted as free. Shown as the *Expected charge cost* badge on Main.

Settings
- Checks per block: `binary_sensor.hesc_check_charger`, `…_sources`, `…_weather_station`, `…_charge_plan`, `…_home_battery_and_ev` (on = OK, attribute `missing`). Fields stay closed while a check is OK and open by themselves when it fails; *Charger fields* (`input_boolean.hesc_show_charger_fields`) opens the charger fields.
- One compact setup check (*Setup verified · all OK*), a read-only *Your settings* card and a *Solar next 7 days* chart (expected sun, and what is left for the EV after the house and the home battery).
- PV/grid, forecast and HPVC behind one switch, *Change sources*.
- New default thresholds for new installations: forecast 2 000 / 1 500 W, weather station 220 / 160 W/m² (from 33 solar starts on 8 days). Existing installations keep their values.

Dashboard
- All cards grow with their content (no fixed heights, no scroll bars inside cards).
- The guide (dashboard and docs/07, English and Dutch) covers home battery and EV, back to solar mode, the fixed date of a one-off plan, the expected charge cost and the setup check.

Upgrade from v1.3.0: replace `hesc_config.yaml` and the dashboard, re-import the flow, reload helpers, template entities and automations (or restart Home Assistant). Wallbox: press *Search again* to fill in *Back to solar mode*. See the [release notes](releases/v1.4.0/release.md).

## v1.3.0 — 2026-10-03

**Smart charging, almost on autopilot.**

Price forecast
- New *Price forecast* on the Engine tab. HESC keeps its own price history (`hesc-data/price_history.json`) and predicts the 24 hours after the last known price: the hourly pattern of the last 14 full days plus half of a solar index (sunny days are cheap at midday and expensive in the evening). The index starts from a default for the Dutch market and is refined every week with your own history. Published as `sensor.hesc_price_forecast`.
- The charge plan uses these expected quarters after the last known price, with a 2 ct/kWh penalty, so known prices win unless an expected one is clearly cheaper. New plan attributes `planned_forecast` and `forecast_until`.
- Price chart: grey *Expected price* bars.

Charging strategy
- Cheap chances are skipped when the cautious solar forecast for the rest of that day covers what the EV still needs with 20% to spare (status *Cheap chance skipped: enough sun today*). The price chart leaves those quarters out too.
- Cheap chances also charge without an active plan (as intended), and have their own colour in the price chart (blue-green); inside an active plan they stay amber.
- 3% margin: grid charging only starts when the EV is more than 3% below its goal; once charging, it continues to the goal. The goal check uses the same margin.
- With a start/stop switch the charger now stays **paused** after grid charging, so the car cannot top itself up from the grid. It comes back on for solar charging, a drop of more than 3% when no planned charge is coming (top-up), a new plan or unplugging. A refused pause is retried after 30 minutes and a refused resume after 5 minutes, each at most 3 times.
- New optional **minimum charge** (Settings, block 3, *Use* + *Settings*): plugged in below a level (default 20%), the EV reaches it within a set time (default 3 h) in the cheapest quarters of that window. Off by default; new helpers `input_boolean.hesc_min_charge_enabled`, `input_number.hesc_min_charge_soc`, `input_number.hesc_min_charge_hours`.
- Status *No active plan* instead of *Goal reached* when there is no plan.

Dashboard
- Built-in guide in English and Dutch: two hidden pages, opened with the ⓘ next to the headings and the *Guide* badge on Main (hold it for Dutch). Same text as the new [Smart charging explained](docs/07-smart-charging-explained.md) ([Nederlands](docs/07-smart-charging-explained.nl.md)).
- Charge plan card: a plan that is not active is shown as a grey *preview*.
- Local weather station and minimum charge: *Use* and *Settings* switches side by side.
- Control States and their timelines in one card.
- A small *star this project* line at the top of Main.

Settings
- *PV & grid from HPVC* no longer overwrites your own PV and grid sensors for good: switching it on remembers them, switching it off puts them back (`input_text.hesc_own_pv_power_sensor` / `hesc_own_grid_power_sensor`).

Upgrade from v1.2.0: replace `hesc_config.yaml` and the dashboard, re-import the flow, restart Home Assistant or reload helpers, template entities and automations. See the [release notes](releases/v1.3.0/release.md).

## v1.2.0 — 2026-09-28

**A charge plan you can rely on.**

Charge plan
- The plan now counts on expected sun. Per half hour before the ready-by time it looks at the cautious solar forecast (same rule as the *Expected solar charging* bar: the start threshold starts, the hold threshold keeps charging) and subtracts about 0.4 kW for the house. Only the rest is planned from the grid. Two new settings: *Solar forecast today* and *Solar forecast tomorrow* (`input_text.hesc_solar_today_sensor` / `hesc_solar_tomorrow_sensor`, Solcast *forecast today / tomorrow* by default).
- Final check before the ready-by time (`input_number.hesc_plan_final_check_min`, default 60 min, 0 = off): if the EV is still below its goal, HESC charges to the goal, whatever the price.
- Notification when the goal is not reached at the ready-by time: a notification inside Home Assistant, plus the notify services you choose (`input_text.hesc_notify_services`, e.g. `notify.mobile_app_phone`). The history gets a `goal_check` / `goal_missed` line.
- Fixed: when the charger did not draw power once, HESC treated the plan as finished until the ready-by time and only unplugging the EV undid that. It now pauses for at most 30 minutes, then continues with the plan.
- Fixed: a Home Assistant restart or a template reload could briefly stop a running plan. HESC now keeps the last valid plan for up to 10 minutes.
- The charge plan card no longer shows a leftover *Finished* from an earlier plan above a new plan, and shows "–" instead of "0,0 ct/kWh" while nothing is planned yet. It also shows how much of the energy is expected from the sun.

Price chart (Charge plan tab)
- The chart now follows the day-ahead price sensor chosen in Settings. You no longer have to change a sensor name in the dashboard.
- Planned grid charging quarters are shown in amber, with a legend: grey = price per quarter, amber = planned grid charging.
- When the price sensor has no prices, the chart makes way for a clear *Prices not available* message instead of an endless "Loading…" (`binary_sensor.hesc_prices_available`).

Advisor
- The start threshold advice now looks at all solar sessions, the short ones too, and shows the trade-off (short sessions avoided versus good ones lost).
- It only uses sessions from the way you work now (standalone or with HPVC); new sessions record standalone mode.
- It waits for sessions on at least 7 different days before advising.

Setup
- Choosing the charger type *Wallbox* now also fills in the start/stop switch for the charge plan (the pause/resume switch), when exactly one is found on the charger.
- In standalone, the setup checklist on Main shows *Sources* and no longer mentions HPVC.
- New installs start with: *EV counts as full at* 80% (was 100%; 100% is only advised for LFP batteries), grid charging power 11 kW, usable battery capacity 60 kWh, *Cheap when below* 0.05 €/kWh. Existing installs keep their own values.
- The new v1.2.0 settings get their starting values once, also when upgrading (`input_boolean.hesc_defaults_v120_applied`); settings you already filled in are not overwritten.

Upgrade from v1.1.0: replace `hesc_config.yaml` and the dashboard, re-import the flow (or replace the *Evaluate HESC*, *Charge plan*, *HESC Advisor* and *Build HESC report* nodes), restart Home Assistant or reload helpers, template entities and automations.

## v1.1.0 — 2026-09-27 

**HPVC is now optional.**

Standalone mode
- New switch *No HPVC (standalone)* (`input_boolean.hesc_standalone`). On: HESC runs without Home PV Control. The HPVC fields are hidden and no longer required, the release step is skipped, and you pick your own PV and grid sensors. Following solar charging, forecast vs actual, the report, the advice and the charge plan keep working.
- A new install without HPVC switches standalone on by itself. Existing installs keep it off, so nothing changes for HPVC users.
- Switching standalone on during a running release ends that release cleanly.
- Settings, step 2 adapts: *Sources* in standalone, *Taken over automatically* with HPVC. The edit switch is called *Change forecast* in standalone and *Change forecast & HPVC* with HPVC.

Other
- Grid charging power for the charge plan now steps in 0.5 kW instead of 0.1 kW.
- New document: [A day in practice](docs/06-a-day-in-practice.md), a real day with a home battery, HPVC and HESC.
- Installation guide: steps for a fresh install without HPVC (Node-RED add-on, server node, what you need first).

Upgrade from v1.0.0: replace `hesc_config.yaml` and the dashboard, re-import the flow (or replace the *Evaluate HESC* node), restart Home Assistant or reload helpers, template entities and automations.

## v1.0.0 — 2026-09-26

First public release. The earlier pre-releases (v0.1–v0.6) were test versions on one installation; their notes are no longer part of this repository.

**Requires Home PV Control v1.5.1 or newer.**

Solar charging while HPVC limits PV
- Release through HPVC's external request/confirm interface (`input_boolean.hpvc_external_release_request` / `binary_sensor.hpvc_external_release_active`). HPVC keeps all its own priorities.
- Solar power forecast as primary source (Solcast `estimate10` or any W sensor); local irradiance sensor optional.
- Hysteresis (start/hold), stability timer, wait for charger, allowed solar dip, maximum duration, cooldown, daily attempt limit.
- No confirmation from HPVC within 5 minutes → request withdrawn (*HPVC busy*). A request left on after a restart is withdrawn automatically.
- No release when the EV is already full (optional battery-level sensor).
- Shadow mode: full evaluation without writes (default for a new install).
- Legacy fallback (switch HPVC off, inverters to full) present but **off**: `input_boolean.hesc_release_legacy`.

Charge plan
- One-off and weekly plans; cheapest known day-ahead quarters before the deadline; safety net; optional *take cheap chances*.
- Grid charging through a start/stop switch or a "charge now" mode value; the charger always goes back to how it was.
- Restart safety (`input_boolean.hesc_plan_owns_charging`), status (`input_text.hesc_plan_status`).

Chargers and sources
- Charger type table for Wallbox, Alfen, Peblar, Zappi, go-e, Wattpilot, SMA, evcc, Ohme, Easee, plus *Other (manual)*.
- Binary or status connected sensor, W or kW power, one or more solar-mode values, optional extra solar switch.
- PV and grid taken over from HPVC by default.

Insight
- Forecast vs actual per solar session and per day; source reliability every 15 minutes.
- Plain-language advice from your own history (minimum sessions, recent period, follows the seasons).
- On-demand HTML support report; file-based history, no InfluxDB needed.

Dashboard
- Main (status, master control, live inputs, control states, forecast vs actual, solar charging forecast), Charge plan, and Settings in three steps with a setup checklist.

Shipped defaults
- Forecast power to start / hold 1 500 / 1 200 W; irradiance to start / hold 150 / 120 W/m² (from 8 real solar starts on the test installation).
