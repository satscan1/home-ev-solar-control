# Questions and answers

Choices that are made on purpose, and limits that are known. They are written down here so they stay visible instead of hidden or forgotten.

## Costs

**How exact is the split between sun and grid on the Costs page?**
It is a calculation, not a measurement. Every 30 seconds HESC counts the grid import (at most the EV's charging power) as grid, and the rest as sun. Energy from a home battery counts as sun too, also when that battery was charged from the grid earlier. The split is meant as a useful overview of your own charging. If you need exact, billable figures (for example to settle costs with an employer), use a certified (MID) meter for the charger. That is outside HESC.

**My costs showed up on the wrong day around midnight.**
Fixed in v2.0.1. In v2.0.0 the cost counter used the time zone of Node-RED instead of the Home Assistant time zone. With the Node-RED add-on these are normally the same. With Node-RED in Docker set to UTC, charging just after midnight could land on the previous day. Days counted before the update are not corrected.

**The Costs page or the *Expected solar charging* bar does not show up.**
Both need button-card. HESC checks for it through the HACS update entity (`update.button_card_update`). If you installed button-card by hand, without HACS, that entity does not exist and both stay hidden. Install button-card through HACS, or remove that visibility check from the two cards in the dashboard.

## Charge plan

**Is the *one day, every week* plan one-off or weekly?**
Both, on purpose. Leave it on and it comes back every week on the same day and time: handy for one day that differs from your weekly pattern. Need it only once? Switch *Active* off after that day.

**HESC says *Charger refuses to start*. What now?**
Since v2.0.1 HESC stops trying after 3 planned starts in which the car took no power at all, and tells you once. Common causes: the car's own charge limit or schedule, a charging schedule in the charger's app, or the car not waking up. Fix the cause; the plan tries again as soon as the car charges, you unplug it, or you change the plan.

## Kickstart (home battery and EV)

**After a kickstart my charger still charges at full power.**
Since v2.0.1 HESC hands the charger back to solar charging in two ways: it presses the "back to solar" entity, and it also sets the solar mode value on the charger mode entity (Settings → charger). Known limit: some chargers keep showing their solar mode on the mode entity while a start command is still active. HESC then sees nothing to change and cannot undo the start that way. If you see this, pause the charger once in its own app, and please report your charger brand so the hand-back can be improved.

## Prices and chargers

**Does HESC work with my price source and my charger?**
Probably, but not everything has been tested for real. Live tested: Nord Pool in the Netherlands (quarter prices) and a Wallbox Pulsar Plus. The other price sources, currencies and half-hour or hour prices are tested with simulated data in the real source formats. Other chargers should work when they offer the entities listed in *Chargers and sources*, but start, pause and resume can behave differently per brand. Run HESC in shadow mode first, and please report your results.

**I chose another charger brand than Wallbox, but HESC does not see the solar mode.**
Fixed in v2.0.1. Check in Settings that the charger's solar mode shows the value of your brand (for example *Green* for Alfen). After the update this is filled in by itself if it still showed `eco_mode`.

## Back-up

**What does *Back up settings* save?**
Only your settings. The charging history, costs, price history and battery-level history live in separate files in `/homeassistant/hesc-data/`. Your normal Home Assistant back-up includes that folder, so keep that back-up running.

## After a restart

**Right after a Home Assistant restart some values are empty for a moment.**
HESC fills them again within a minute or two. Since v2.0.1 this also goes for the start threshold advice in Settings, which used to wait until the evening.
