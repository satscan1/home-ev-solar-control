# HESC v2.0.0 — one dashboard, any country

HESC's job hasn't changed: the car has the energy you want at the time you want, charged the cheapest way. v2.0.0 tells you what that cost, works with many more price sources and countries, lets you know when something needs your attention, and fixes the cases where the charger kept charging from the grid when it shouldn't.

It is a major release because some things existing users will notice have changed. Read [Upgrade from v1.4.0](#upgrade-from-v140) first.

New to HESC? Read [Smart charging explained](https://github.com/satscan1/home-ev-solar-control/blob/main/docs/07-smart-charging-explained.md) ([Nederlands](https://github.com/satscan1/home-ev-solar-control/blob/main/docs/07-smart-charging-explained.nl.md)), or tap the ⓘ in the dashboard.

![HESC in different countries](https://github.com/satscan1/home-ev-solar-control/raw/main/screenshots/hesc_international_collage.jpg)

## What did charging cost?

A new **Costs** page, opened with the *Costs* badge on Main. Per day, week, month, quarter or year it shows how much went into the car, how much came from the sun (green) and from the grid (grey), and what the grid part cost at the price of that quarter. HESC counts this itself every 30 seconds; no InfluxDB needed.

You set your costs once (Settings → *Charging costs*): the value of a solar kWh, and either *all-in* prices or a mark-up per kWh plus VAT. HESC stores the costs without them, so changing a setting recalculates the whole history. **Export to spreadsheet (CSV)** writes per day and per month to two files that open in Excel straight away.

The *Expected charge cost* badge now uses the same rule, and only counts grid charging that will really happen.

## Your prices, your currency, your country

- **Many more price sources.** A sensor with a price list (Nord Pool, ENTSO-E, Energi Data Service, EPEX Spot, Frank Energie, Zonneplan, Octopus Agile, Amber Electric, Spain's PVPC) is recognised by itself. EnergyZero / ANWB Energie, EasyEnergy, Tibber and the official Nord Pool integration are fetched for you every 30 minutes. Per quarter, half hour or hour: HESC always plans in quarters.
- **Your currency.** EUR, SEK, DKK, NOK, GBP and AUD, taken from the price sensor (or chosen in Settings). Prices show in their small unit (ct, öre, øre, p, c), amounts are written the way your country does it (`€ 1,12`, `1,12 €`, `1,12 kr`, `£1.12`).
- **Weekends and holidays.** The price forecast now knows that weekends and public holidays are cheaper, using the Workday calendar of your country.
- **Your time zone.** Day boundaries follow Home Assistant everywhere.

The collage above was made on one installation with test price lists for six countries; we'd love to hear from users outside the Netherlands.

## Notifications that matter

- **Choose your phones from a list** (every device with the Home Assistant app) and send a test notification.
- **Priorities.** *P1* (charge goal missed or at risk, or a real fault) goes to your phone as time-sensitive and stays red on Main. *P2* (a sensor is missing, HESC keeps working) is orange. *P3* is just so you know. Quiet hours are set on your phone, as for any other app.
- **A notice line at the top of Main:** *✓ No notices*, or what needs attention. Tap it to go where you can act.
- **Morning summary** (optional): one message a day with the battery level, the next plan, the sun today and how yesterday went.

## When the battery level is missing

Car integrations sometimes stop reporting. HESC now falls back by itself: a second battery sensor of the same car (found automatically), then the last level plus what was charged since, then the usual level when you plug in. You get a notice when HESC is estimating, and a P1 when the goal cannot be confirmed at all.

## The charge plan

- **One day, every week.** The one-off plan now comes back every week on the same day and time, as an extra rule next to the weekly plan. Switch *Active* off when you only need it once.
- **Holiday mode.** The weekly plan rests, the one-day plan keeps working, solar charging carries on. Set an end date if you like: holiday mode switches itself off the day after.
- **Fixed: cheap chances filled a full car.** Without an active plan, a cheap chance used the goal of the plan that was switched off. It now uses *EV counts as full at*.
- **Fixed: grid charging went on after the plan stopped.** A cloud charger carries out a command about a minute late. HESC now checks that the pause really took effect before returning the charger to its solar mode.
- A refused start is tried again, the planned quarters move along with the clock, and the plan says *☀ charging by itself* when the car is already charging on sun.

## Solar charging

- **Home battery and EV:** after the kickstart the charger goes straight back to its solar mode, without the pause in between. In practice the home battery took the sun back during that pause.
- **Start threshold per season** (optional): higher in summer, lower in winter, set every night.
- **Advice from your own history**, now based on what really matters: from which forecast did your sessions get most of their energy from the sun? The Status card on Main shows it. Optionally HESC applies it itself, in small steps (*Apply advice automatically*, off by default).

## Also

- **Back up settings, Restore back-up and Standard values** in Settings, so trying things is safe.
- *Grid sensor: export is positive*, for meters that count the other way round.
- Main and Charge plan are more compact and use the full width on a phone; brighter chart colours.
- The guide covers everything above, and what to expect right after a Home Assistant restart.

## Before you install: one planner per charger

Turn off charging schedules in your charger's own app (or in another integration) while HESC plans your charging. Two planners on one charger get in each other's way: the charger does not start when HESC asks, or starts when it shouldn't. After an update of the charger app or firmware, check that no schedule has appeared by itself.

## Upgrade from v1.4.0

1. Make a Home Assistant backup.
2. Replace `/config/packages/hesc_config.yaml` and **restart Home Assistant** (there are many new helpers, sensors and automations).
3. Replace the dashboard with `home assistant/hesc_dashboard.yaml`. Optional but recommended: [card-mod](https://github.com/thomasloven/lovelace-card-mod) (HACS), for the price-chart title in your currency.
4. Re-import `node-red/hesc_flow.json` and deploy with **Modified flows**. Check that the new nodes use your Home Assistant server (Engine tab: *Charging costs*, *Export charging costs*, *Morning summary*, *EV battery level*, *Start threshold advice*; Reports tab: *Settings back-up / restore / reset*).
5. Settings, step 3, *Charge plan*: check **Price source** (*Price list in sensor* is what you had), your price sensor and **Currency** (*Automatic*). *Cheap when below*, the mark-up and the feed-in compensation are now *per kWh* in your own currency; their values are kept.
6. Had an active one-off plan? It now comes back every week. Switch *Active* off if you don't want that.
7. Pick the phones for notifications from the list (your old notify services keep working) and press *Send a test notification*.
8. Optional: switch on **Charging costs** (Settings, *Use*) to show the *Costs* badge and page, and fill in your mark-up and VAT, or *all-in*. HESC counts from the moment v2.0.0 runs, whether the page is shown or not; there is no history from before.
9. Optional: morning summary, start threshold per season, apply advice automatically, holiday mode.
10. Check the setup check at the top of Settings: everything should be green.

Your settings and history stay as they are. Everything new is off until you switch it on, except the notice line, the battery-level fallbacks and the cost counting in the background.
