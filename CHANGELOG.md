# Changelog

## 3.1.3 · 03-11-2026

One small fix from the review for the HACS default list. HESC charges exactly as in 3.1.2.

- *View report*: the icon of the card is now always read as an icon name, never as part of the
  page. An icon with a quote in it can no longer change the dashboard.

## 3.1.2 · 02-11-2026

Two security fixes from the review for the HACS default list. HESC charges exactly as in 3.1.1.

**Support report**
- The report (charging history, entity states and settings) is now only opened through Home
  Assistant, with your login. Before, anyone who could reach your Home Assistant could open it
  without logging in. The old report files are removed when HESC starts.
- *View report* on HESC's dashboard opens it for you, in a new tab.
- Made your own copy of the dashboard before 3.1.2? Its *View report* button no longer finds the
  report. Replace that card with the card *HESC · View report* (search for HESC in the card
  picker), or make a new copy of the dashboard.

**Notifications**
- *Notification services* only accepts notify services. A plain name like *mobile_app_iphone*
  still works. Anything else in that field is ignored, so it can no longer make HESC call other
  services.

## 3.1.1 · 25-10-2026

- The expected cost in the charge plan card shows the right amount at once. Before, it could
  show the previous amount (for example *€ 0,00*) for one update after a restart or a plan change.
- German: shorter column titles in the charge plan card (*ERW. KOSTEN*, *GÜNSTIG*), so the card
  no longer wraps.
- Manual: new pictures of the charge plan page, now in English, Dutch and German, and the plan
  card and price chart described as they are since 3.1.0.

## 3.1.0 · 25-10-2026

**Charge plan card**
- No active plan: the card only says *No charging plan active*. The old ready-by time, charging
  time, price and the word *preview* are gone, so a quick look no longer suggests the car is
  being charged.
- Active plan: the expected cost now stands next to the energy price. With cheap chances on,
  the cheap-chance price limit is shown next to it in purple (the same colour as in the chart).
  HESC shows no amount for cheap chances: a negative market price does not mean you get paid.
- A plan that is switched off (or paused by holiday mode) before its ready-by time leaves nothing
  behind: no goal check and no *EV goal missed* notification at that time any more, and the
  morning summary says *No charge plan* instead of the old time with *(off)*.

**Price chart**
- Where the sun can start charging, the sun wins over a cheap chance: those quarters are green
  only (the sun is cheaper, and it is what HESC really does).
- Expected prices (not yet published) have an almost empty area, so they read differently from
  the real prices at a glance.

**Languages**
- The HESC dashboard in the sidebar follows the language each user chose in the profile (before:
  the language of Home Assistant, which is still used when a user has not chosen one). All titles
  follow, also the price chart title.
- The texts HESC makes itself (state, reason, last action, charge plan, home battery and EV,
  charging current, notices) are shown in Dutch and German on the dashboard in that language.
  Notifications, the morning summary and the phone and watch summary come in the language of
  Home Assistant. Inside, HESC keeps working with the English texts, so your own automations
  that read them keep working.
- Still in English: the values in drop-down lists (for example *Today*, *Tomorrow*). Translating
  those would change the values your own automations use; that waits for a later version.

**README**
- A row of badges under the logo (release, HACS, stars, Ko-fi) and a *Support this project*
  section with the Ko-fi button.

## 3.0.0 · 22-10-2026

The first release of HESC as a Home Assistant integration. It can do everything HESC v2 can,
without Node-RED and without a YAML package. HESC v2 stays available; see
[Upgrading from v2](docs/02-upgrade-from-v2.md).

**New compared with v2**
- One integration with a setup screen. HESC finds your charger, car and meter by itself, also
  when Home Assistant uses entity names in another language.
- Battery-level finder: if no battery-level sensor is found, the setup screen tells you where to
  get one for your car.
- Works with Solcast, Open-Meteo or Forecast.Solar, or without any solar forecast.
- Charging current control on chargers that allow it, so more of a grid charge comes from the sun.
- Start level per charger: the start threshold advice never goes below what your charger needs to
  start on sun.
- Phase advice when your meter shows power per phase.
- Start threshold advice only learns from solar sessions that started while HPVC limited your
  panels: only then does the threshold decide anything. No threshold advice without HPVC.
- Kickstart: start, let the home battery control see the car, pause, back to charging on sun.
- Take over settings and history from v2 with one button.
- The dashboard comes with HESC: *HESC* in the sidebar, nothing to paste, updated with every
  HESC update. HESC fills in its own entity names and your chosen Solcast and HPVC sensors, so
  renaming them keeps the dashboard working. Already pasted a dashboard at `/hesc-v3` (testers)?
  HESC leaves it alone and explains under *Settings → Repairs* how to switch.
- Plug & play: HESC brings its own dashboard cards (charts, *Expected solar charging*, Costs,
  Kiosk). No apexcharts-card, button-card, card-mod or kiosk-mode needed any more; the cards are
  in the card picker (search for *HESC*).
- Your own copy of the dashboard with one click: *Settings → Dashboards → Add dashboard →
  Community dashboards → HESC*, or two lines in the raw configuration editor.
- Kiosk page: the Home Assistant menu and top bar are hidden by HESC itself.
- In Dutch and German: the setup screen, the names of HESC's entities, the dashboard, HESC's cards
  and the guide page (*Uitleg*, *Anleitung*) follow the language of Home Assistant (the one-click
  dashboard and the cards: your own profile language). Entity ids stay the same in every language,
  so the guide and other automations keep working. The support report follows the language of Home
  Assistant too. Still in English: the messages HESC writes itself (state, reason, advice, phone
  notifications) and the values in drop-down lists.
- Switch *Use HPVC* (off by default): on when you work with HPVC.
- A paused charger counts as 0 W, also when it still reports its last power (Wallbox).
- Kickstart hands back to charging on sun 15 s after the charger's pause shows in Home Assistant,
  and a sensor *Kickstart hand-back in progress* tells your home battery control to hold the home
  battery meanwhile.
- Kickstart waits up to 6 minutes for a cloud charger to show that it started (was 4).
- On your phone and watch: actions *Set charge plan* and *Charge plan off* (for Siri, Shortcuts
  and the Apple Watch) and a one-line *Summary for phone and watch* sensor for a widget.
- *Charge now to* a goal (select and action): grid charging at once, back to solar at the goal.
- *Skip one day* of the weekly plan (a day off) without changing the plan (date and action).
- Lock-screen widgets on the iPhone follow at once: HESC sends a silent refresh to the phones in its
  phone list when the summary changes, at most once every 20 minutes.
- One-tap buttons for phones and watches (also Android quick-settings tiles and Wear OS): charge
  now to the plan goal, stop charge now, skip the next day of the weekly plan, undo, charge plan off.
- Link your home battery control to HESC: use *EV charging power* (0 W as soon as the charger is
  paused) and *Kickstart hand-back in progress* (see How it works). With a home battery the
  charger can stay paused in its solar mode; HESC starts it with a kickstart.
- Charge plan goals in steps of 5 % (v2: 10 %).
- Dashboard: house-style icons and logo, a *Live* card, a kiosk page for a wall
  tablet, and on/off switches for the sources.
- User manual in English, Dutch and German, with screenshots.
