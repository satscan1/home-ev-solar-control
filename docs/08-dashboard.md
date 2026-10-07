# The dashboard explained

*What every numbered part of the HESC dashboard does.* (Nederlands: [Het dashboard uitgelegd](08-dashboard.nl.md))

The HESC dashboard has three tabs: **Main**, **Charge plan** and **Settings**. Below, each screen has a numbered screenshot and a short explanation per number.

## Main

![Main tab with numbered parts](../screenshots/dashboard_main_numbered.jpg)

1. **Status bar:** at a glance what HESC is doing, whether the car is plugged in, whether the charger is in solar mode and whether HPVC is limiting the panels. *Guide* opens the explanation, also in Dutch.
2. **Enable HESC:** the master switch. Off means HESC no longer evaluates anything. If HESC had switched HPVC off, it restores HPVC first.
3. **Shadow mode:** HESC evaluates and logs everything, but switches nothing. Always start here.
4. **Generate report:** builds a report with everything HESC measured and decided, including advice. The *View report* button appears afterwards.
5. **Status:** what HESC is doing now, today's solar sessions and HPVC releases, how much the car charged today and how much of that came from the sun, and how well the solar forecast matched. After enough sessions it also shows whether advice is available.
6. **Live Inputs:** the current values HESC works with: the solar forecast (normal and cautious), the actual PV output, the EV charging power and the weather station irradiance.
7. **Control States:** whether the car is plugged in, the charger is in solar mode, HPVC is limiting and a release is active, with a timeline of today below.
8. **Solar forecast vs actual · EV:** purple is the forecast, orange the actual PV output, blue (below the zero line) what the car charged.
9. **Solar charging forecast:** the expected sun for today and tomorrow. Green means enough sun to start, orange enough to keep charging, grey too little.
10. **Expected solar charging:** when the car is expected to charge on sun today and tomorrow, and for how many hours.

## Charge plan

![Charge plan tab with numbered parts](../screenshots/charge_plan_numbered.jpg)

1. **One-off plan:** pick a day, a time and a charging goal, for example 100% tomorrow at 10:00.
2. **Weekly plan:** tick the days and pick a time and a charging goal, for example 80% on weekdays at 07:00.
3. **Active:** switches a plan on or off. Each plan has its own switch. When both are on, the earliest one wins.
4. **Plan status:** what HESC is doing now, for which plan, the charging time, the average energy price, the battery level now, the goal, what is still needed and the status.
5. **Price chart:** the price per quarter for today and tomorrow. Orange is planned grid charging, teal a cheap chance, grey an expected price.
6. **Take cheap chances:** also charges without a plan as soon as the price drops below the limit, unless the sun is expected to cover it that day.
7. **Cheap when below:** the price limit for a cheap chance, in €/kWh.
8. **Usable battery capacity:** how many kWh your car can really use. HESC uses it to work out the energy needed.
9. **Grid charging power:** how many kW your charger delivers from the grid. HESC uses it to work out the number of quarters needed.

## Settings

![Settings tab with numbered parts](../screenshots/dashboard_settings_numbered.jpg)

1. **Step 1, your charger:** the only part you have to fill in yourself.
2. **Charger type and Search again:** pick your brand. HESC fills in the values for that brand and looks for the matching entities. *Search again* repeats the search.
3. **The fields:** EV connected, charging power, the charger mode entity and the value that means solar charging. Check that they are right.
4. **Checklist:** a tick and the live value for every field, so you see straight away whether it works.
5. **No HPVC (standalone):** switch this on when you do not use HPVC. HESC then skips the release and you pick your own PV and grid sensors.
6. **PV & grid from HPVC:** takes the PV and grid sensors over from HPVC. Only use it when HPVC sees all your panels. Off puts your own sensors back.
7. **Change forecast & HPVC:** switch this on to change the solar forecast and HPVC entities yourself.
8. **Show optional fields:** extra fields for some chargers or for more detail in the report, such as the EV battery level.
9. **Local weather station:** *Use* switches the weather station on or off, *Settings* shows the sensor and its thresholds. Without it HESC works on the forecast alone.
10. **Step 3, advanced:** thresholds, timing, advice and the charge plan settings. The defaults work for most installations; the report tells you when a change would help.
11. **Minimum charge:** keeps the car at least at a chosen battery level, by default 20% within 3 hours, in the cheapest quarters. Switch it on with *Use*.

More detail: [Settings](02-configuration.md) · [Smart charging explained](07-smart-charging-explained.md)
