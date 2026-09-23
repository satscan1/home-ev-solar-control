# HESC v0.4.1

Advice based on real surplus. The regulation is unchanged; only the Advisor and the report changed.

- **Two quantities, kept apart:** the *surplus* explains the advice ("Eco kept charging reliably from about 1,550 W expected surplus; house and battery used about 550 W"), the *start threshold* is what you set ("2,100 W"), because HESC compares it with the gross forecast.
- **No battery sensor needed:** house and battery use together = PV + grid − EV at the start of each session.
- **Fallback:** without a grid power sensor the advice uses the gross forecast and says so. Below the minimum number of usable sessions (default 8) there is no advice.
- Same conservative method as v0.4.0 (25th percentile).

Upgrade from v0.4.0: re-import `node-red/hesc_flow.json` (Replace) or paste the new *HESC Advisor* and *Build HESC report (HTML)* code, and deploy. No Home Assistant changes.
