# How it works

## Evaluation

The Inputs tab triggers the Engine every 30 seconds. The Engine reads about 20 entities from the Home Assistant state cache of Node-RED (`global.homeassistant.homeAssistant.states`). It does not call the API and does not copy the full state table. Day boundaries and times follow the Home Assistant time zone (attribute `tz` of `sensor.hesc_prices`).

## Standalone mode

With *No HPVC (standalone)* switched on (`input_boolean.hesc_standalone`), HESC skips the release completely: the HPVC inputs are not required and the state machine below stays in **Idle** with the reason *Standalone (no HPVC): the charger starts on solar by itself*. Following sessions, the 15-minute accuracy records, the charge plan, the advice and the report work as described on this page. Switching standalone on during a running release ends that release cleanly.

## State machine (with HPVC) 

| State | Enters when | Leaves when |
|---|---|---|
| Idle | default | all start conditions hold for the stability time → Release requested |
| Release requested — waiting for HPVC | `input_boolean.hpvc_external_release_request` switched on (or would be, in shadow mode) | HPVC confirms (`binary_sensor.hpvc_external_release_active` on) → Waiting for EV · no confirmation within 5 min → *HPVC busy*, request off · EV disconnected, sunset, inputs missing → request off |
| Release — waiting for EV | HPVC confirmed; the release is counted from here | EV charges → Charging · no start within the wait time → Release ended |
| Release — EV charging | EV above the charging threshold | EV stopped, solar below hold for longer than the allowed dip, EV disconnected / charger not in solar mode, sunset, maximum duration → Release ended |

**Release ended:** the request is switched off, HPVC resumes normal control, the cooldown starts. HESC never switches HPVC itself (unless the legacy fallback is on, see below).

Start conditions:

- the EV is connected, not charging, not full (when a battery-level sensor is set) and in solar mode;
- HPVC is limiting and offers the release interface (v1.5.1 or newer);
- the lower of forecast-now and forecast-+30 min is at least the start threshold;
- irradiance is at least its start threshold (optional);
- there is no cooldown;
- the failed attempts today are below the maximum;
- the sun is up.

## Outputs

- **Status:** `hesc_state`, `hesc_reason`, `hesc_last_action` and `hesc_insight_1..3`, written only on change.
- **Release request:** `input_boolean.hpvc_external_release_request` on/off, never in shadow mode. A request found on while HESC is idle (for example after a restart) is switched off.
- **Charger (charge plan only):** the start/stop switch or the mode entity you selected, never in shadow mode.
- **Ownership:** `input_boolean.hesc_plan_owns_charging` (charge plan) and, legacy only, `input_boolean.hesc_owns_hpvc_off`.
- **History:** one JSON line per event, session or 15-minute interval in `hesc-data/history.jsonl` (about 50 lines per sunny day).
- **Notices:** `sensor.hesc_notice` (the line at the top of Main) and, for P1 and P2, notifications to the chosen phones. See [Notifications](#notifications).

## History records

| type | Contents |
|---|---|
| `event` | release / restore decisions with a snapshot of the inputs |
| `release` | a full release: duration, forecast Wh, PV Wh, actual/forecast %, EV Wh, EV solar kWh, EV started, reason |
| `eco_charge` | every daytime charging session in solar mode, with the same forecast vs actual fields, plus `forced_start` (see below) |
| `accuracy` | every 15 minutes in daylight: median and cautious forecast (W), actual PV (W), irradiance (W/m², if set) and the share of time HPVC was limiting |

### Manual and scheduled starts

Many chargers keep reporting their solar mode (for example Wallbox *Eco*) when you press start yourself or when a schedule starts charging. To keep the advice and the accuracy figures clean, HESC checks every solar session at its start: if the forecast (the estimate chosen in Settings) **and** the actual PV are both below the hold threshold, the session was started by hand or by a schedule. It is still logged (`forced_start: true`) and shown in the report as *Manual/scheduled (not counted)*, but it is left out of the advice, the accuracy figures and the daily solar totals. This only uses forecast and PV, so it works the same for every charger.

### Handshake with HPVC

HPVC v1.5.1 treats the request as a question, not a command. It waits behind its own safety and restore handling, negative-price protection, Night Restore and HBC transition states, respects its normal cooldown and write confirmation, sets the configured inverters to full and only then turns *active* on. So:

- HESC never assumes PV is free right after switching the request on;
- every HESC timer that is about the charger starts **after** *active*;
- the only timer before *active* is the 5-minute limit after which HESC gives up for now (*HPVC busy*).

### Legacy fallback

`input_boolean.hesc_release_legacy` (off by default) brings back the old method: switch HPVC off, set its Number-entity inverters to full and keep them there, with HESC's own HPVC status gate and all-in price guard. Keep it off with HPVC v1.5.1 or newer.

## Charge plan

The plan itself is a Home Assistant template (`sensor.hesc_charge_plan`, attribute `plan`): active plan (the *one day, every week* plan or the weekly plan, the earliest wins; the one-day plan gets a fixed deadline when you choose its day and time, and after that deadline it moves on one week to the same day and time; with *Holiday mode* on the weekly plan is skipped), goal, deadline, energy needed (battery level × usable capacity), the part expected from the sun (`solar_kwh`), the rest from the grid (`grid_kwh`), the number of quarters that takes at the grid charging power, and the cheapest known quarters before the deadline (`planned`), taken from `sensor.hesc_prices` (see [Prices](#prices)). Quarters that have passed drop out; when the planned quarters no longer fit before the deadline the plan card warns *not enough time left for the goal*. It is recalculated every minute and whenever a plan setting changes.

**Sun in the plan.** For every half hour between now and the deadline the plan reads the cautious solar forecast (`pv_estimate10`, kW) from the two solar forecast sensors (today and tomorrow). A half hour counts with the same rule as the *Expected solar charging* bar: at or above the start threshold the charger can start, after that at or above the hold threshold it keeps charging. Such a half hour adds (forecast − 0.4 kW for the house) × 0.5 h, at most the grid charging power. Example: 2.0 kW forecast gives (2.0 − 0.4) × 0.5 = 0.8 kWh. What the sun cannot deliver is planned from the grid.

The *Charge plan* node in the Engine tab runs every 30 seconds and decides:

| Reason on the dashboard | Charger |
|---|---|
| Planned quarter | started from the grid |
| Safety net: only just enough time left | started (remaining time ≤ charging time + 15 min) |
| Final check: below goal, charging to goal | started in the last *final check* minutes before the deadline (default 60) while the EV is below its goal, whatever the price |
| Cheap chance (x ct ≤ y ct) | started, only when *take cheap chances* is on (shown in the small unit of your currency) |
| Cheap chance skipped: enough sun today (~x kWh for y kWh) | not started: the cautious solar forecast for the rest of today covers the need with 20% to spare |
| Within 3% of goal (x%, charges below y%) | not started: the EV is less than 3% below its goal |
| Minimum charge: below x%, waiting for the cheapest quarter … / charging | the optional minimum charge (see below) |
| Waiting for the next planned quarter / No active plan | not started; if HESC started it, back to how it was |
| Goal reached (x%) | charger paused (start/stop switch) or previous mode |
| Finished, charger stopped by itself | the charger drew no power for the *charger stopped* time after the *wait for charger* time; back to how it was, and left alone for 30 minutes (then the plan continues; the final check ignores this pause) |
| EV already charging, left alone | a charge HESC did not start (for example on sun) is never taken over |

How it starts follows from what is filled in: a start/stop switch is switched on; otherwise the mode is set to the "charge now" value. A start that the charger refuses (switch not on, EV not charging) is sent again after 5 minutes, at most 3 times (`grid_start_retry`), but not when the EV is within 1% of its goal.

**Which goal.** With an active plan: the plan goal. Without one (cheap chance, top-up): *EV counts as full at*. A cheap chance therefore never charges a car that already counts as full.

**3% margin.** Grid charging (planned quarter, safety net, final check, cheap chance) only starts when the EV is more than 3% below the goal; once charging, it continues to the goal. This stops the charger from starting for a few minutes of nothing.

**Afterwards: back to solar mode.** With a start/stop switch and `input_text.hesc_charger_resume_entity` (*Back to solar mode*, e.g. Wallbox *Resume schedule*) filled in, HESC pauses the charger after grid charging and presses *Back to solar mode* about a minute later, so the charger waits in its own solar mode again (`charger_to_solar` in the history). Before pressing it HESC checks that the pause took effect: cloud chargers carry out a command about a minute late, and a start sent just before can still arrive after the pause. While the EV still charges or the switch is still on, HESC pauses again and waits a minute, at most 3 times (`pause_retry`); after that it returns the charger to solar mode anyway (`pause_failed`). A plain *resume* is not used for this: on a Wallbox it starts full charging from the grid.

**Afterwards: paused.** With only a start/stop switch that was on before HESC started, the charger stays paused after grid charging, so the EV cannot top itself up from the grid. HESC switches it on again when there is enough sun to start solar charging (cautious forecast now at or above the start threshold, sun up), when the EV drops more than 3% below the goal (plan goal, otherwise *EV counts as full at*) and no planned charge is still coming, when a plan starts, or when the EV is unplugged. A refused pause is retried after 30 minutes, a refused resume after 5 minutes, each at most 3 times (`pause_retry`, `pause_failed`, `resume_retry`, `resume_failed` in the history). With a mode value the mode that was active before is selected again (or the first solar value).

**Cheap chances and the sun.** Before taking a cheap chance HESC adds up the cautious solar forecast for the rest of that calendar day (half hours at or above the hold threshold, minus 0.4 kW for the house, at most the grid charging power). If that covers what the EV still needs (to the plan goal, otherwise *EV counts as full at*) with 20% to spare, the cheap chance is skipped. The price chart leaves those quarters out too.

**Minimum charge** (optional, `input_boolean.hesc_min_charge_enabled`). EV connected below the minimum level → a window of the set number of hours starts. HESC works out the quarters needed ((minimum − battery) × capacity ÷ grid charging power) and charges in the cheapest quarters of the window; at the end of the window the safety net starts, and without known prices it charges straight away. It stops at the minimum level and works independently of the charge plan. After a restart, `input_boolean.hesc_plan_owns_charging` tells HESC that it had started the charger, so it is put back.

Every start and stop is written to the history (`type: charge_plan`), with the charger mode, the start/stop switch and the EV power on every record; a change of plan is written as `plan_changed`.

**Goal unknown.** When the EV is not plugged in at the deadline, the goal check writes `goal_unknown` instead of a result.

**Goal check.** At the deadline HESC compares the battery level with the goal. More than 3% below the goal: a P1 notification *EV goal missed* (inside Home Assistant and to the chosen phones) and a `goal_missed` line in the history (otherwise `goal_check`). Plugged in but no battery level at all: a P1 *EV goal not confirmed*.

**Grid charging is not a solar session.** While the plan has the charger (`input_boolean.hesc_plan_owns_charging`), no solar session starts; a running one is closed with *grid charging by plan*. The report and the Advisor never count grid charging as solar.

**Restarts.** While `sensor.hesc_charge_plan` is briefly missing (Home Assistant restart, template reload), the node keeps using the last valid plan for up to 10 minutes, so a running charge is not stopped.

## Home battery and EV

The *Home battery and EV (kickstart)* node in the Engine tab (optional, `input_boolean.hesc_kick_enabled`) runs on the same 30-second input as the charge plan and writes its status to `input_text.hesc_kick_status`. It never controls the home battery; it only starts the charger and reads the home battery level (`input_text.hesc_home_battery_soc_sensors`) and power (`input_text.hesc_home_battery_power_sensors`, positive = charging; several sensors comma separated are added up).

**Kickstart** when all of these hold:

- the EV is plugged in, waiting in solar mode, not charging and not full;
- the home batteries have been charging above 500 W for 5 minutes;
- the cautious forecast now is at or above the start threshold;
- the sun left today minus 1.2 × what the home batteries still need to be full is at least *minimum sun left for the EV* (default 2 kWh);
- no charge plan has the charger, no HPVC release is running, the sun is up, fewer than *kickstarts per day* (default 3) today and at least 30 minutes since the last one.

The sequence: switch the charger on (start/stop switch) → as soon as the EV charges, straight back to *Back to solar mode*, without a pause (in practice the home battery took the sun back during a pause). Only a start that does not take (no charging after 2 minutes) is paused, and tried once more. The charger's own solar mode then keeps charging on the sun that the battery control leaves free (with Home Battery Control: HBC sees the EV through the sensor it uses for its EV load lock, `input_text.house_battery_strategy_ev_sensor_entity_id`).

**Back to the home battery** when the EV has been charging on sun for 10 minutes or more and the sun left today is at most 1.2 × what the home batteries still need: pause → about 1 minute → *Back to solar mode*, and no new kickstart that day. Not while an active plan still needs the charge.

Every step is written to the history as `type: home_battery_ev`; the report and the Advisor leave those records out of the solar sessions.

## Price forecast

The Engine tab also holds the **Price forecast** (every 15 minutes, and 40 s after a deploy for loading the history).

- **Own history.** Every complete day in `sensor.hesc_prices` is stored as 24 hourly averages, together with that day's solar forecast (kWh), in `hesc-data/price_history.json` (last 90 days).
- **Profile.** Working days and weekend days separately: the hourly pattern of the last 14 working days, or of the last 8 weekend days for a Saturday, Sunday or public holiday (fewer when there is less history; from 1 full day on). Public holidays come from the calendar of the Workday integration, found through the integration itself whatever its name. Back-tested over 30 days the average error per day dropped from 4.8 to 4.3 ct.
- **Solar index.** How each hour relates to the day average, per *solar class* (the day's solar forecast as a fraction of a sunny day: the 90th percentile of the last 30 days). The index starts from a default for the Dutch market (293 days of market prices) and is refined every week with your own history; the default counts as 30 days of evidence. The forecast adds half of the index difference between tomorrow's solar class and that of the profile days.
- **Output.** 96 quarters after the last known price, published as `sensor.hesc_price_forecast` (attribute `forecast`, plus `basis_days`, `index_days`, `penalty`).

The charge plan template uses these quarters after the last known price, with a 2 ct/kWh penalty, so it only waits for an expected price when that is clearly cheaper than a known one. In another currency the default index and the penalty are scaled with a rough exchange rate (`fx_vs_eur`); your own history corrects that. They show as grey *Expected price* bars in the price chart. The safety net and the final check still make sure the deadline is met.

## Advisor

The Reports tab also holds the **HESC Advisor**. It runs daily at 21:30, 90 seconds after a deploy, and before every report. It reads the history of the last *N* days and writes one short line to `input_text.hesc_advice`. The report gets the full advice. The Advisor never changes settings.

| Advice | Based on | Minimum |
|---|---|---|
| Start / hold threshold | All solar sessions (short ones too) from the way you work now: standalone or with HPVC. A threshold is good when at least 60% of the sessions it lets start keep charging for 20 min or more. When fewer than half do at the current threshold, the advice is the lowest higher threshold that reaches 60% (with at least 3 sessions), plus the trade-off: short sessions avoided and good sessions lost. Hold = 80% of start | minimum sessions, on at least 7 different days |
| Wait for the charger | start delay after real releases (9 of 10 within the advice, plus 2 min) | half the minimum |
| Releases without charging | share of real releases that led to charging (< 50% → raise start threshold) | half the minimum |
| Forecast quality | actual PV vs forecast in daylight intervals without curtailment | 3 × minimum hours |
| Weather station | irradiance at the start of lasting solar sessions; hold = 75% of start | minimum sessions |

### Start threshold advice (sun share)

The node *Start threshold advice (+ auto apply)* on the Engine tab publishes `sensor.hesc_advice_threshold`, shown in the Status card on Main and the advice card on Settings.

- **Sessions:** solar sessions of the last 30 days without manual starts; pauses of up to 5 minutes count as one session. With fewer than 15 sessions in 30 days (winter) it looks back up to 60 days.
- **Advice:** the lowest start forecast from which the next 8 sessions together got at least 70% of their energy from the sun (weighted by kWh), rounded to 50 W, between 1 000 and 3 500 W. Hold = 75% of start. With fewer than 15 sessions with sun data the earlier rule is used (the forecast at the start of sessions that kept charging for 20 minutes or more, lower quartile).
- **Apply advice automatically** (`input_boolean.hesc_advice_auto`, off by default): at most one step per 7 days and 200 W per step, only with at least 100 W difference and at least 8 good sessions on 5 different days. Every change is written as `advice_applied` and shown as a P3 notice. It cannot run together with the start threshold per season (automation *HESC - Auto advice and seasonal threshold exclude each other*).

### Start threshold per season

Optional (`input_boolean.hesc_seasonal_threshold`, off by default). The automation *HESC - Seasonal start threshold* runs at 00:05, at Home Assistant start and when switched on, and sets the start threshold for the month: June–July 2 500 W, April–May and August–September 2 000 W, March and October 1 500 W, November–February 1 200 W; hold 75%.

## Report

The Reports tab reads the history, builds a self-contained HTML page and writes it to `www/hesc/report.html`. It runs on demand and never inside the evaluation cycle.

## Prices

All price users (charge plan, price chart, price forecast, costs) read one sensor, `sensor.hesc_prices`, built by a price adapter in the package:

- **Source** (`input_select.hesc_price_source`): *Price list in sensor* reads the attributes of `input_text.hesc_price_sensor` (`raw_today`/`raw_tomorrow`, `prices_today`/`prices_tomorrow`, `prices`, `data`, `forecast`, `rates`, `forecasts`, or Spain's PVPC `price_00h` … `price_next_day_23h`), whatever the field names of start, end and price. *EnergyZero / ANWB Energie*, *EasyEnergy*, *Tibber* and *Nord Pool (official)* only answer an action: `sensor.hesc_price_fetch` calls it every 30 minutes for today and tomorrow.
- **Quarters:** hourly and half-hourly prices become equal quarters; prices per MWh are divided by 1 000. *Per hour* (`input_select.hesc_price_resolution`) gives every quarter the average of its hour.
- **Currency** (`input_select.hesc_currency`): *Automatic* reads the `currency` attribute or the unit of the price sensor. Attributes `currency`, `symbol`, `minor` (ct, öre, øre, p, c), `symbol_after`, `decimal` and `fx_vs_eur`. The way amounts are written follows the Home Assistant time zone (see [Energy prices](05-chargers-and-sources.md#energy-prices)).

## Charging costs

The node *Charging costs (sun / grid)* on the Engine tab runs on the 30-second tick while the EV charges:

- **Grid part** = the EV's charging power, but never more than what comes from the grid at that moment; **sun part** = the rest (this includes energy from a home battery). Unknown grid power counts as grid.
- The grid part is priced at the price of that quarter from `sensor.hesc_prices`; without a known price it is counted separately (*grid kWh without price*).
- Gaps of more than 2 minutes (restarts) are skipped, never estimated.
- Day totals are kept in `hesc-data/charging_costs.json` (about 3 years) and published every 5 minutes and at midnight as `sensor.hesc_charging_costs` (the last 100 days, all months, today).
- Mark-up, VAT and the value of a solar kWh are applied on the Costs page and in the export, not stored. Changing them recalculates the whole history.
- *Export charging costs (CSV)* writes `hesc-data/charging_costs_days.csv` and `charging_costs_months.csv` with a total line and the settings used; `;` with a decimal comma or `,` with a decimal point, following the country.

## EV battery level

`sensor.hesc_ev_soc` is the battery level all parts use. When the sensor from Settings has no value, the node *EV battery level (fallbacks)* tries, in this order:

1. a second battery-level sensor of the same car that HESC finds by itself (no extra field). While charging it only counts when it changed in the last 2 hours;
2. the last level seen during this plug-in, plus 90% of the kWh charged since (charging losses), at most 100%;
3. the usual level at plug-in over the last 14 days (25th percentile, at least 5 plug-ins).

Levels at plug-in are kept in `hesc-data/ev_soc_plugins.json` (60 days). Only a real change from unplugged to plugged in counts as a plug-in. The session (last level, kWh charged, notices sent) survives a Node-RED restart for up to 6 hours. An estimated or unknown level gives a P2 notice, and one phone notification per plug-in.

## Notifications

| Priority | When | Where |
|---|---|---|
| P1 | charge goal missed or not confirmable, or a real fault (for example the charger did not respond 3 times) | phone (time-sensitive) and Main, red, 12 hours |
| P2 | a sensor is missing but HESC keeps working (for example an estimated battery level) | phone and Main, orange, as long as it lasts |
| P3 | harmless (for example *Apply advice automatically* changed the threshold) | Main only, grey, 2 hours |

P1 and P3 show the time of the event, P2 the time since when the problem exists. The phones come from `sensor.hesc_notification_phones` (every device with the Home Assistant app) and are chosen with `input_select.hesc_notify_pick`; the result is kept in `input_text.hesc_notify_services`. HESC has no quiet hours of its own: set them on the phone or in Home Assistant.

**Morning summary** (optional, `input_boolean.hesc_morning_summary`): once a day, within 60 minutes after the chosen time, a message to the chosen phones with the battery level and whether the EV is plugged in, the next plan, sun today, yesterday (kWh, % sun, costs), whether yesterday's goal was reached (only when there was one) and, with holiday mode on, until when.

## Holiday mode

`input_boolean.hesc_vacation` takes the weekly plan out of `sensor.hesc_charge_plan`; the one-day plan, cheap chances, minimum charge and solar charging carry on. The automation *HESC - Holiday mode ends* (00:01 and at start) switches it off on the day after `input_datetime.hesc_vacation_until`, but only when that date is later than the day holiday mode was switched on (a date of today or earlier counts as no end date).

## Settings back-up

The node *Settings back-up / restore / reset* on the Reports tab writes all HESC settings (numbers, texts, choices, switches, the plan date; not the status helpers or show/hide switches) to `hesc-data/settings_backup.json` plus a dated copy, puts them back (skipping what no longer exists or is already the same), or resets the tuning to the HESC defaults after a back-up first.

