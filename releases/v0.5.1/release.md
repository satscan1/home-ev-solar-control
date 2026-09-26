# HESC v0.5.1

HPVC status gate for HPVC v1.5.0 (answer to the concern in [home-pv-control#6](https://github.com/BioPC/home-pv-control/issues/6) that switching HPVC off during negative prices, Night Restore or safety states is not safe).

- Release only in a normal HPVC state: not at negative price, Night Restore, HBC Charge Priority (battery first), faults or auto-resume, and only while the all-in price is above zero. Otherwise the reason is *HPVC busy (…)*.
- HPVC v1.5.0 leaves its last limits in place when switched off, so HESC set the HPVC inverters (Number entity slots) to full itself and kept them there during the release; at a price at or below zero HPVC was switched back on immediately.

Superseded by v0.6.0, which uses HPVC's own release interface. The v0.5.1 behaviour remains as a fallback (`input_boolean.hesc_release_legacy`, off).
