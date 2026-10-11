# The dashboard explained

*What every numbered part of the HESC dashboard does.* (Nederlands: [Het dashboard uitgelegd](08-dashboard.nl.md))

The HESC dashboard has three tabs, **Main**, **Charge plan** and **Settings**, plus the **Costs** page, opened from the *Costs* badge on Main. Below, each screen has a numbered screenshot and a short explanation per number.

## Main

![Main tab with numbered parts](../screenshots/dashboard_main_numbered.jpg)

1. **Status bar:** at a glance what HESC is doing, whether the car is plugged in, whether the charger is in solar mode and whether HPVC is limiting the panels. *Expected charge cost* shows what the active plan is expected to cost from the grid, in the currency of your prices. *Costs* opens the Costs page (when switched on in Settings), *Guide* opens the explanation, also in Dutch.
2. **Notice line:** *✓ No notices*, or what needs your attention with its time: red = the charge goal is at risk (also sent to your phone), orange = a sensor is missing but HESC keeps working, grey = just so you know. Tap it to go where you can act; without a notice it opens the HESC page on GitHub.
3. **Enable HESC:** the master switch. Off means HESC no longer evaluates anything. If HESC had switched HPVC off, it restores HPVC first.
4. **Shadow mode:** HESC evaluates and logs everything, but switches nothing. Always start here.
5. **Generate report:** builds a report with everything HESC measured and decided, including advice. The *View report* button appears afterwards.
6. **Status:** what HESC is doing now, the last action, today's solar sessions and HPVC releases, and the start threshold advice from your own history next to the threshold of now. Tap the advice to go to Settings.
7. **Live Inputs:** the values HESC works with now: the solar forecast (and the cautious estimate HESC decides on), the actual PV output, the EV charging power, the EV battery level and where it came from, the weather station irradiance and the sun still to come today.
8. **Control States:** whether the car is plugged in, the charger is in solar mode, HPVC is limiting and a release is active, with a timeline below. With *Home battery and EV* switched on and the car plugged in, an extra line shows the home batteries, their charging power, the EV level and what the kickstart is doing.
9. **Solar forecast vs actual · EV:** purple is the forecast, orange the actual PV output, blue (below the zero line) what the car charged.
10. **Solar charging forecast:** the expected sun for today and tomorrow. Green means enough sun to start, orange enough to keep charging, grey too little. The number on the left is the forecast HESC uses.
11. **Expected solar charging:** when the car is expected to charge on sun today and tomorrow, and for how many hours.

## Charge plan

![Charge plan tab with numbered parts](../screenshots/charge_plan_numbered.jpg)

1. **One day, every week:** pick a day, a time and a charging goal, for example 100% on Friday at 08:00. The plan comes back every week on that day and time.
2. **Weekly plan:** tick the days and pick a time and a charging goal, for example 80% on weekdays at 07:00.
3. **Active:** switches a plan on or off. Each plan has its own switch. When both are on, the earliest one wins.
4. **Holiday mode:** the weekly plan rests while you are away; the one-day plan keeps working and solar charging carries on. When it is on, *Holiday until* appears: the day after that date it switches itself off.
5. **Take cheap chances:** also charges without a plan as soon as the price drops below the limit, unless the sun is expected to cover it that day. Without a plan it charges up to *EV counts as full at*.
6. **Cheap when below:** the price limit for a cheap chance, per kWh in the currency of your prices.
7. **Usable battery capacity:** how many kWh your car can really use. HESC uses it to work out the energy needed.
8. **Grid charging power:** how many kW your charger delivers from the grid. HESC uses it to work out the number of quarters needed.
9. **Plan status:** what HESC is doing now, for which plan and until when, the charging time, the average energy price, the battery level now, the goal, what is still needed (and how much of it the sun is expected to bring) and the status.
10. **Price chart:** the price per quarter for today and tomorrow, in the small unit of your currency (cents, öre, øre, pence). Amber is planned grid charging, blue-green a cheap chance, grey an expected price.

## Settings

![Settings tab with numbered parts](../screenshots/dashboard_settings_numbered.jpg)

1. **Step 1, your charger:** the only part you have to fill in yourself.
2. **Charger type and Search again:** pick your brand. HESC fills in the values for that brand and looks for the matching entities. *Search again* repeats the search.
3. **Charger fields:** opens the charger fields (EV connected, charging power, the charger mode and the value that means solar charging). While the check is OK they stay closed; when something is wrong they open by themselves.
4. **Advice:** the start threshold advice from your own history: the threshold of now, the advice, how many sessions it rests on and the sun share above and below it. *Apply advice automatically* (off by default) lets HESC move the threshold towards the advice in small steps.
5. **Setup check:** one line per part with a tick and the values of now. A part that is wrong unfolds and says what is missing; parts you do not use are listed on one line.
6. **Your settings:** your thresholds, EV, timing, charge plan and advice settings at a glance. Change them in step 3.
7. **Back up settings, Restore back-up, Standard values:** a back-up of all HESC settings, putting it back, or resetting only the tuning (after a back-up first). The line below shows the last back-up.
8. **Charging costs:** *Use* shows the Costs badge and page; *Settings* shows the value of a solar kWh, *all-in*, or mark-up and VAT.
9. **Step 2, sources:** where HESC gets PV, grid and the solar forecast from.
10. **No HPVC (standalone):** switch this on when you do not use HPVC. HESC then skips the release and you pick your own PV and grid sensors.
11. **PV & grid from HPVC:** takes the PV and grid sensors over from HPVC. Only use it when HPVC sees all your panels. Off puts your own sensors back.
12. **Change sources:** opens the PV and grid sensors (and whether your grid sensor counts export as positive), the solar forecast and the HPVC entities. They also open by themselves when something is wrong.
13. **Show optional fields:** extra fields for some chargers or for more detail in the report, such as the EV battery level and *EV counts as full at*.
14. **Local weather station:** *Use* switches the weather station on or off, *Settings* shows the sensor and its thresholds. Without it HESC works on the forecast alone.
15. **Step 3, advanced:** thresholds (and the optional start threshold per season), timing, advice and the charge plan settings: start/stop switch, *Back to solar mode*, price source, price sensor, prices per, currency, phones for notifications and the morning summary. The defaults work for most installations.
16. **Minimum charge:** keeps the car at least at a chosen battery level, by default 20% within 3 hours, in the cheapest quarters. Switch it on with *Use*.
17. **Home battery and EV:** with a home battery, lets the car get its share of the sun before the home battery takes it all. Switch it on with *Use* and fill in your home battery under *Settings*.

## Costs

Opened with the *Costs* badge on Main, when *Charging costs* is switched on in Settings. The example shows a sample month.

![Costs page with numbered parts](../screenshots/costs_numbered.jpg)

1. **Period:** days (a calendar of the month), weeks, months, quarters or the year.
2. **Totals:** what went into the car this month, from the sun and from the grid, the grid cost, the value of the solar kWh (the feed-in compensation you missed) and the average per kWh. The line below shows how the grid price is worked out (mark-up and VAT, or all-in).
3. **Calendar:** one tile per day. Days before HESC started counting say *no data yet*.
4. **Day tile:** ▲ more expensive or ▼ cheaper than the day before, a bar with sun (green) and grid (grey) whose length shows the kWh, the cost, and the kWh with the sun share.
5. **Legend:** what the arrows and the bar mean.
6. **Export to spreadsheet (CSV):** writes two files, per day and per month, that open in Excel. Separator and decimal mark follow your country.
7. **Last export:** when, how many days and months, and the file names.

More detail: [Settings](02-configuration.md) · [Smart charging explained](07-smart-charging-explained.md)
