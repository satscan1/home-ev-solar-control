# HESC v2.0.1 — small fixes, fewer surprises

A maintenance release on top of v2.0.0. No new features: a few things that went wrong are now right, and HESC tells you when the charger refuses to start instead of trying all morning.

Upgrading from v2.0.0 takes a few minutes; your settings and history are kept. See [Upgrade from v2.0.0](#upgrade-from-v200).

## Fixed

- **Kickstart leaves the charger at full power.** After a kickstart (*Home battery and EV*) HESC hands the charger back to solar charging. It only pressed the "back to solar" entity. On some chargers (seen on a Wallbox) that does not undo the start command, so the EV kept charging at full power from the grid until it was full. HESC now also sets your charger's solar mode value on the charger mode entity (Settings → charger) when it hands back, and keeps asking while it watches the charger. Without a charger mode entity nothing changes. A known limit is described in [Questions and answers](https://github.com/satscan1/home-ev-solar-control/blob/main/docs/09-questions-and-answers.md#kickstart-home-battery-and-ev).
- **Charger refuses to start (charge plan).** When the charger did not take any power after a planned start, HESC waited and tried again every 30 minutes, all morning, without a word. Now HESC counts the starts in which the car took **no power at all**. After **3 in a row** it stops trying for this plan and sends **one** notification (P1): *Charger refuses to start — check the car and the charger.* In the last hour before the ready-by time (the *final check* window, 60 minutes by default) HESC still makes **one more try**, whatever the reason for the start; if that fails too, it stops for this plan. The count goes back to zero as soon as the car charges, the cable is unplugged or the plan changes. A car that charged and then stopped by itself (full, charge limit) does not count.
- **Solar mode of chargers other than Wallbox.** A new installation filled in the Wallbox value (`eco_mode`) as the charger's solar mode. Picking another brand afterwards (for example Alfen or Peblar) did not replace it, so HESC did not recognise that charger's solar mode. Now the value of the chosen brand is filled in at the first choice. **Existing installations** with another brand that still show `eco_mode` are repaired by themselves at the first Home Assistant start after the update. A value you typed yourself is never overwritten; Wallbox users see no change.
- **Start threshold advice after a restart.** After a Home Assistant restart the advice block in Settings showed *Working it out…* until the evening. The advice is now worked out again right after the restart.
- **Costs on the right day.** The cost counter used the time zone of Node-RED instead of the Home Assistant time zone. With Node-RED in Docker set to UTC, charging just after midnight could land on the previous day.
- **Warning in the log at start-up.** One template sensor (*HESC solar still to come today*) was defined twice in the package, which gave a "unique ID already exists" warning at every start. The duplicate is removed; the sensor itself is unchanged.

## Changed

- The status of *Home battery and EV (kickstart)* is written to Home Assistant at once when the situation changes, but when only the numbers in the text change, at most every 15 minutes. Fewer writes to your database; the status dot in Node-RED stays live.

## New in the docs

- **[Questions and answers](https://github.com/satscan1/home-ev-solar-control/blob/main/docs/09-questions-and-answers.md)**: choices made on purpose and known limits, written down so they stay visible. For example how exact the sun/grid split on the Costs page is, why the one-day plan comes back every week, and what *Back up settings* does and does not save.

## Upgrade from v2.0.0

1. Make a Home Assistant backup.
2. Replace `/config/packages/hesc_config.yaml` and **restart Home Assistant**.
3. Re-import `node-red/hesc_flow.json` and deploy with **Modified flows**.
4. Replace the dashboard with `home assistant/hesc_dashboard.yaml` (only the version label on Main changed; skip this if you edited the dashboard yourself).
5. Not using a Wallbox? Check in Settings that the charger's solar mode shows your brand's value (it should have been filled in by itself after the restart).
6. Check the setup check at the top of Settings: everything should be green.

Your settings, charging history and costs are kept.

## Download

The zip attached to this release (`hesc-v2.0.1.zip`) holds the complete package: the Home Assistant package, the Node-RED flow, the dashboard, the docs, the screenshots and the release notes. It is the same as the repository at v2.0.1.
