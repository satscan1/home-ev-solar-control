# HESC v0.4.0

Plain-language advice from your own history.

- **Advisor:** looks back over a recent period (default 30 days) and says per setting: *this was measured, this is the advice*.
- **Minimum data:** no advice until enough sessions are collected (default 8); until then it says *collecting data*.
- **Seasons:** only the recent period counts, so the advice moves with the season; a change is shown in the report for a week.
- **Advice only:** HESC never changes a setting itself.
- Still ships in **shadow mode**. Advice on the charger wait time needs real releases (shadow mode off).

Upgrade from v0.3.0:

1. Replace `/config/packages/hesc_config.yaml`, then reload *Input text* and *Input number* (or restart). Set *Advice based on last* to 30 and *Minimum sessions before advice* to 8 once.
2. Re-import `node-red/hesc_flow.json` (Replace). The Reports tab gets the *HESC Advisor*, a daily trigger and an *Advice to HA* action. Deploy.
3. Replace the dashboard with `home assistant/hesc_dashboard.yaml`.
