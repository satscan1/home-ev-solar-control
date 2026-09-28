# HESC v1.2.0 — a charge plan you can rely on

You set a goal and a time, for example "80% by Tuesday 07:30", and HESC charges your EV in the cheapest quarters before then. In daily use we found a few things that could leave you with a surprise in the morning. This release fixes them, and makes the plan smarter about the sun.

## The plan counts on the sun

Why pay for grid power when the sun will do part of the job? The plan now looks at the solar forecast, half hour by half hour, until your ready-by time. It uses the cautious forecast and the same rule as the green *Expected solar charging* bar, and keeps about 0.4 kW for the house. Only what the sun cannot deliver is planned from the grid. The charge plan card shows how much is expected from the sun.

## No more surprises

- **Final check.** One hour before the ready-by time HESC checks the battery. Still below the goal? Then it charges to the goal, whatever the price.
- **A message if it still did not work.** If the EV is not at its goal at the ready-by time, you get a notification in Home Assistant and on your phone. Choose the notify service in Settings → Advanced.
- **Fixed: one hiccup no longer cancels the plan.** When the charger did not draw power once, HESC used to treat the plan as finished until the ready-by time. Now it waits at most 30 minutes and carries on.
- **Fixed: a restart no longer stops charging.** While Home Assistant restarts or reloads, HESC keeps following the last valid plan for up to 10 minutes.

## A clearer Charge plan tab

- The price chart follows the price sensor you chose in Settings, so it also works if you do not use Nord Pool.
- Planned grid charging is shown in **amber**, with a legend.
- No prices? Then you see *Prices not available* instead of an endless "Loading…".
- No more contradicting texts on the charge plan card.

## Smarter advice

The Advisor now also learns from solar sessions that stopped early, only uses sessions from the way you work now (standalone or with HPVC), and waits until it has seen at least 7 different days.

## Easier setup

- Choosing *Wallbox* as charger type also fills in the start/stop switch for the charge plan.
- In standalone, the setup checklist no longer mentions HPVC.
- New installs start with *EV counts as full at* 80%. Existing installs keep their own value.

## Upgrade from v1.1.0

1. Replace `/config/packages/hesc_config.yaml` and reload helpers, template entities and automations (or restart Home Assistant).
2. Replace the dashboard with `home assistant/hesc_dashboard.yaml`.
3. Re-import `node-red/hesc_flow.json` (or replace the *Evaluate HESC*, *Charge plan*, *HESC Advisor* and *Build HESC report* nodes) and deploy with **Modified flows**.
4. Optional: fill in a notify service in Settings → Advanced → Charging from the grid.

Your settings and history stay as they are. The new settings get their starting values once.
