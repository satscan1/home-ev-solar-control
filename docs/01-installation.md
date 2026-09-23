# Installation

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
3. Deploy with **Modified flows**, so HBC and HPVC keep running.
4. After about 45 seconds, `input_text.hesc_state` shows `[shadow] Idle` with a reason.

Files are written to the Home Assistant configuration mount of the Node-RED add-on (`/homeassistant`):

- history: `/homeassistant/hesc-data/history.jsonl`
- report: `/homeassistant/www/hesc/report.html` → `/local/hesc/report.html`

## 3. Dashboard

Add `home assistant/hesc_dashboard.yaml` as a new dashboard (Settings → Dashboards → Add → New dashboard from scratch → ⋮ → Raw configuration editor → paste).

## 4. Configure

Open the **Settings** view and enter your entities. See [02 Settings](02-configuration.md) and the example in `examples/`.

## 5. Evaluate before going live

Keep shadow mode on for at least a week of charging days. Press **Generate report** and check:

- whether the would-be releases happen at sensible moments;
- how actual PV compares with the forecast during Eco charging.

Adjust the thresholds, then switch shadow mode off.
