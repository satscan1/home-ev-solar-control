# HESC v1.3.0 — smart charging, almost on autopilot

After about two weeks HESC runs almost on its own. Your part: plug the car in, and keep your plan in line with when you leave. Between plugging in and leaving, HESC finds the cheapest way to get the car where you want it: the sun first, then the cheapest hours from the grid, always with a safety net. New to it? Read [Smart charging explained](../../docs/07-smart-charging-explained.md) ([Nederlands](../../docs/07-smart-charging-explained.nl.md)), or tap the ⓘ in the dashboard.

## It looks past tomorrow's prices

Tomorrow's prices arrive around 13:00. Before that, HESC now uses its **own price forecast**: the pattern of your last 14 days, adjusted for how sunny tomorrow will be. The sun index starts from the Dutch market and learns from your own history every week. Expected prices show as grey bars and only win when they are clearly cheaper than a known price. It works after one full day and is complete after 14 days.

## Cheap, but not when the sun will do it

*Take cheap chances* charges whenever the price drops below your threshold, also without a plan, and now has its own blue-green colour in the chart. New: when the solar forecast for the rest of the day already covers what the car needs (with 20% to spare), the cheap chance is skipped and the sun does the job for free.

## No more silent top-ups

- **3% margin.** Grid charging only starts when the car is more than 3% below its goal, so the charger no longer starts for a few minutes of nothing.
- **Paused afterwards.** With a start/stop switch the charger stays paused after grid charging, so the car cannot quietly charge from the grid in the evening peak. It comes back on for sun, a real drop, a new plan or when you unplug. A refused command is tried again.

## Minimum charge (optional)

Came home nearly empty and might need the car tonight? Switch on **Minimum charge**: at least 20% within 3 hours (both adjustable), in the cheapest quarters of that window.

## A guide in the dashboard

Every page has a small ⓘ next to its heading. It opens a guide, in English and Dutch, with what HESC does, the order it follows, and what to do in common situations.

## Also

- A plan that is not active shows as a grey *preview*.
- *Use* and *Settings* switches side by side for the weather station and the minimum charge.
- *PV & grid from HPVC* puts your own sensors back when you switch it off.

## Upgrade from v1.2.0

1. Replace `/config/packages/hesc_config.yaml` and reload helpers, template entities and automations (or restart Home Assistant).
2. Replace the dashboard with `home assistant/hesc_dashboard.yaml`.
3. Re-import `node-red/hesc_flow.json` and deploy with **Modified flows**. New nodes on the Engine tab: *Price forecast* and its history load/save. The price history file is created by itself.
4. Optional: switch on *Minimum charge* in Settings, block 3.

Your settings and history stay as they are. Minimum charge gets its starting values once and stays off until you switch it on. The price forecast needs one full day of prices before the first grey bars appear.
