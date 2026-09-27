# HESC v1.0.0 — first release 

**Home EV Solar Control (HESC)** is a companion for [Home PV Control (HPVC)](https://github.com/BioPC/home-pv-control). It keeps EV charging on solar working while HPVC limits your PV output, and it can charge your EV to a goal by a set time in the cheapest hours.

**Requires Home PV Control v1.5.1 or newer.** Home Battery Control is not needed.

## Solar charging while HPVC limits PV

Solar/Eco modes on many wallboxes only start when the house exports enough power, while HPVC keeps export near zero. HESC breaks that deadlock:

```
HESC request on → HPVC checks its priorities → HPVC confirms (active)
→ charger starts on sun → end → HESC request off → HPVC resumes
```

- Starts only when the EV is plugged in and waiting in solar mode, HPVC is limiting, and the solar **power** forecast (Solcast or any W sensor, optionally confirmed by a weather station) says enough sun is coming.
- Uses HPVC's own release request/confirm interface. HPVC keeps all its priorities (safety, negative price, Night Restore, battery transitions); HESC never switches HPVC off.
- Safe by design: hysteresis, stability timer, cooldown, daily attempt limit, maximum duration, no release when the EV is already full, and a 5-minute timeout when HPVC is busy.

## Charge plan

- One-off (*100% by Tuesday 10:00*) or every week (*80% on weekdays at 07:30*).
- Picks the cheapest quarters of the known day-ahead prices, with a safety net when time runs short and optional *take cheap chances* below a price you set.
- Charger-independent: a start/stop switch **or** a "charge now" mode value. Afterwards the charger always goes back to how it was. A charge HESC did not start is never taken over.

## Insight

- Forecast vs actual per solar session and per day, and how reliable your forecast and weather station are.
- Plain-language setting advice from your own history, only after enough sessions, following the seasons. Advice only.
- On-demand HTML support report.
- Separate dashboard in the HPVC layout, with a setup checklist: only your charger is required, PV and grid are taken over from HPVC.

## Install

See the [Quick install](../../README.md#quick-install) in the README. A new install starts in **shadow mode**: HESC evaluates and logs everything but writes nothing. Check the report for your own installation, then switch shadow mode off.

## Upgrading from a pre-release (v0.x)

1. Upgrade HPVC to v1.5.1 first.
2. Replace `home assistant/hesc_config.yaml`, check the configuration and restart.
3. Re-import `node-red/hesc_flow.json` (Replace) and deploy.
4. Replace the dashboard.

Your settings and history are kept.
