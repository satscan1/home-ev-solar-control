# Installation

HESC runs **with or without** [Home PV Control (HPVC)](https://github.com/BioPC/home-pv-control).

- **With HPVC:** install or upgrade HPVC to **v1.5.1 or newer** first. HESC uses its external PV release interface. Node-RED is already there, so you can skip step 0.
- **Without HPVC (standalone):** start at step 0 if you do not have Node-RED yet. After installation you switch on *No HPVC (standalone)* in Settings (a new install without HPVC does this by itself).

## 0. What you need first

- **HACS**, for the dashboard cards in step 3.
- **A solar power forecast** in watts. The easiest is the [Solcast PV Forecast](https://github.com/BJReplay/ha-solcast-solar) integration (via HACS), which gives `power_now` and `power_in_30_minutes`.
- **Your charger** in Home Assistant, with a connected sensor, a charging power sensor and a mode entity. See [05 Chargers and sources](05-chargers-and-sources.md).
- **Node-RED.** If you already use HPVC or Home Battery Control, you have it. Otherwise:
  1. Home Assistant → **Settings → Add-ons → Add-on store** → install **Node-RED** (Home Assistant Community Add-ons).
  2. On the add-on's **Configuration** tab, fill in `credential_secret` (any long random text; the add-on does not start without it). If you do not use SSL certificates, set `ssl` to off.
  3. Start the add-on and switch on **Show in sidebar**.
  4. The add-on already contains the Home Assistant nodes (`node-red-contrib-home-assistant-websocket`) and connects to Home Assistant by itself. Nothing else to install.

  Home Assistant Container (no add-ons): run Node-RED yourself, install `node-red-contrib-home-assistant-websocket` from the palette, connect it with a long-lived access token, and mount your Home Assistant configuration folder as `/homeassistant` (HESC writes its history and report there).


## 1. Home Assistant package

1. Make sure packages are enabled in `configuration.yaml`:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```
2. Copy `home assistant/hesc_config.yaml` to `/config/packages/hesc_config.yaml`.
3. Run a configuration check, then restart Home Assistant.
4. On first start the automation **HESC - Apply defaults on first install** fills in the defaults once. HESC starts **enabled** and in **shadow mode**.

## 2. Node-RED flow

1. Node-RED → Menu → Import → select `node-red/hesc_flow.json`.
2. Open every *Home Assistant* action node and the *Generate report requested* trigger, and select your Home Assistant server. The flow ships with a placeholder server id.
   - New Node-RED without a server yet: in the first node choose **Add new server…**, give it a name, tick **Using the Home Assistant add-on**, click **Add**, then pick that same server in the other nodes.
3. Deploy with **Modified flows**, so other flows (for example HBC and HPVC) keep running.
4. After about 45 seconds, `input_text.hesc_state` shows `[shadow] Idle` with a reason.

Files are written to the Home Assistant configuration mount of the Node-RED add-on (`/homeassistant`):

- history: `/homeassistant/hesc-data/history.jsonl`
- report: `/homeassistant/www/hesc/report.html` → `/local/hesc/report.html`

## 3. Dashboard

Add `home assistant/hesc_dashboard.yaml` as a new dashboard (Settings → Dashboards → Add → New dashboard from scratch → ⋮ → Raw configuration editor → paste).

### Frontend cards

Install these through HACS (Frontend) before adding the dashboard:

| Card | Needed for | Required |
|---|---|---|
| [apexcharts-card](https://github.com/RomRider/apexcharts-card) | *Solar forecast vs actual · EV* and *Solar charging forecast* charts | Yes |
| [button-card](https://github.com/custom-cards/button-card) | *Expected solar charging* bar (sunrise → sunset, a green block per 30 minutes where charging is expected) | Optional |

The *Expected solar charging* bar is only shown when button-card is installed. The dashboard checks this with the HACS update entity `update.button_card_update`. Without button-card the bar simply stays hidden; the rest of the dashboard works as normal. If you installed button-card manually (not through HACS), that entity does not exist: remove the `visibility` block from the card to show it.

### Solcast: half-hourly forecast

The forecast chart and the charging bar use 30-minute blocks. Turn this on in the Solcast integration: **Settings → Devices & services → Solcast PV Forecast → Configure → Attribute breakdown → add `attr_brk_halfhourly`**. Without it, both fall back to the hourly forecast (`attr_brk_hourly`).

## 4. Configure

Open the **Settings** view and enter your entities. See [02 Settings](02-configuration.md) and the example in `examples/`.

## 5. Evaluate before going live

Keep shadow mode on for at least a week of charging days. The charge plan also respects shadow mode: it shows what it would do, but does not start the charger. Press **Generate report** and check:

- whether the would-be releases happen at sensible moments;
- how actual PV compares with the forecast during solar/Eco charging.

Adjust the thresholds, then switch shadow mode off.
