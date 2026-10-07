# HESC v1.4.0 — the sun shared between home battery and car

A home battery and a car both want the morning sun. Until now the home battery usually won, and the car waited. v1.4.0 lets them take turns. It also returns the charger to its own solar mode after grid charging, keeps a one-off plan on the date you chose, shows what a plan is expected to cost, and makes the Settings tab a lot calmer.

New to HESC? Read [Smart charging explained](https://github.com/satscan1/home-ev-solar-control/blob/main/docs/07-smart-charging-explained.md) ([Nederlands](https://github.com/satscan1/home-ev-solar-control/blob/main/docs/07-smart-charging-explained.nl.md)), or tap the ⓘ in the dashboard.

## Home battery and EV (optional)

On a sunny morning the home battery takes all the spare sun first, so a charger in solar mode sees no surplus and waits. Switch on **Home battery and EV** (Settings, block 3) and HESC helps the car get its turn:

- **Kickstart.** When the car is waiting for sun, the home battery is charging and there is clearly more sun left today than the home battery still needs, HESC gives the charger a short start. Your battery control sees the car and stops filling the home battery; HESC then puts the charger back in its own solar mode, which keeps charging on the sun that is now free.
- **Back to the home battery.** When the sun left is only just enough for the home battery, HESC puts the charger back to waiting, so the home battery is full by the evening.

HESC never controls the home battery itself. At most 3 kickstarts a day (adjustable), never while a charge plan is charging or an HPVC release is running. You fill in your home battery's level and power sensors and its size. While the car is plugged in, Main shows what it is doing under *Control States*.

## Back to solar mode after grid charging

A new optional field, **Back to solar mode** (Settings, block 3, *Charge plan*). After grid charging HESC pauses the charger and about a minute later returns it to its own solar mode, so the next sunny hour charges the car by itself. For a Wallbox this is *Resume schedule*, and HESC fills it in for you. (On a Wallbox, switching *Pause/resume* back on means *charge now from the grid*; only *Resume schedule* goes back to Eco.) Without the field the charger stays paused, as before.

## A one-off plan keeps its date

Pick *Tomorrow* today, and it means that date. The plan no longer moves on to the next day at midnight, and it stops by itself after the time you set.

## What will it cost?

A new badge at the top of Main: **Expected charge cost**, the energy the active plan takes from the grid times the average price of its quarters. Sun counts as free.

## A calmer Settings tab

- Every block checks itself. While all is well its fields stay closed; when something is wrong they open by themselves and say what is missing.
- One **setup check** sums it up: *Setup verified · all OK*, with the values of now per part.
- **Your settings** shows your thresholds, timing and plan settings at a glance.
- **Solar next 7 days**: per day the expected sun, and what is expected to be left for the car after the house and the home battery.
- PV, grid, forecast and HPVC sit behind one switch, **Change sources**.
- All cards grow with their content: no more scroll bars inside cards.

## New default thresholds

From two weeks of measurements (33 solar starts on 8 days) the defaults for new installations are now **2 000 / 1 500 W** (forecast to start / hold) and **220 / 160 W/m²** (weather station). Existing installations keep their own values; the advice in the report tells you when a change would help.

## Also

- More detail in the history: the charger mode, the start/stop switch and the EV power on every record, and a line when a plan changes.
- The goal check no longer reports *ok* when the car was not plugged in.
- The guide in the dashboard and in the docs covers all of the above.

## Upgrade from v1.3.0

1. Replace `/config/packages/hesc_config.yaml` and reload helpers, template entities and automations (or restart Home Assistant).
2. Replace the dashboard with `home assistant/hesc_dashboard.yaml`.
3. Re-import `node-red/hesc_flow.json` and deploy with **Modified flows**. New node on the Engine tab: *Home battery and EV (kickstart)*.
4. Wallbox: press **Search again** in Settings, step 1, so *Back to solar mode* is filled in. Other chargers: fill it in yourself if your charger has such a button, or leave it empty.
5. Optional: switch on *Home battery and EV* in Settings, block 3, and fill in your home battery under *Settings*.
6. Check the setup check at the top of Settings: everything should be green.

Your settings and history stay as they are. Home battery and EV stays off until you switch it on.
