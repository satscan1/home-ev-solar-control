// HESC's own dashboard cards (since 3.0.0): no button-card, apexcharts-card, card-mod or kiosk-mode
// needed. Loaded by the integration on every page (`/hesc_v3_frontend/hesc-cards.js?v=<version>`), so
// the cards are in the card picker after a restart and a new version is loaded right after an update.
//
//   custom:hesc-solar-chart        Solar forecast vs actual · EV (last 12 h)
//   custom:hesc-solar-forecast     Solar charging forecast (today + tomorrow, per half hour)
//   custom:hesc-price-chart        Day-ahead prices per quarter, with the plan, sun and cheap chances
//   custom:hesc-expected-solar     Expected solar charging (bars per day)
//   custom:hesc-costs              Charging costs: totals or tiles per period
//   custom:hesc-option-button      One option of a select as a button (the Costs period)
//   custom:hesc-style              Any card with a little extra CSS (what card-mod did for this dashboard)
//
// Entity ids: every card takes `entities:` (HESC's own ids); missing ones fall back to HESC's default
// ids. HESC's built-in dashboard fills in the ids your installation really uses.
(() => {
const boot = () => {
  if (customElements.get("hesc-solar-chart")) return;

  const DEFAULTS = {
    setup: "sensor.hesc_v3_setup",
    forecast_diag: "sensor.hesc_v3_forecast_power_diagnostic",
    pv_diag: "sensor.hesc_v3_pv_power_diagnostic",
    ev_diag: "sensor.hesc_v3_charging_power_diagnostic",
    p_start: "number.hesc_v3_forecast_power_to_start",
    p_hold: "number.hesc_v3_forecast_power_to_hold",
    prices: "sensor.hesc_v3_prices",
    plan: "sensor.hesc_v3_charge_plan",
    price_forecast: "sensor.hesc_v3_price_forecast",
    cheap_on: "switch.hesc_v3_charge_plan_take_cheap_chances",
    cheap_price: "number.hesc_v3_charge_plan_opportunity_price",
    ev_full: "number.hesc_v3_ev_full_at_battery_level",
    ev_kwh: "number.hesc_v3_ev_usable_battery_capacity",
    plan_kw: "number.hesc_v3_charge_plan_grid_charging_power",
    costs: "sensor.hesc_v3_charging_costs",
    costs_all_in: "switch.hesc_v3_costs_price_is_all_in",
    costs_markup: "number.hesc_v3_costs_mark_up_per_kwh_energy_tax_supplier",
    costs_vat: "number.hesc_v3_costs_vat",
    feed_in: "number.hesc_v3_feed_in_compensation",
    costs_period: "select.hesc_v3_charging_costs_period",
  };

  // Texts in the user's language (Home Assistant profile). English is the key; a missing text stays English.
  const TEXTS = {
    nl: {
      "Now": "Nu", "Solar": "Zon", "Forecast": "Verwachting", "EV": "Auto", "PV actual": "Zonnestroom", "EV charging": "Auto laadt",
      "Start threshold": "Startdrempel", "Keep-charging threshold": "Doorlaaddrempel",
      "EV can start on solar": "Auto kan starten op zon", "Enough to keep charging, not to start": "Genoeg om door te laden, niet om te starten",
      "Not enough sun": "Niet genoeg zon", "Used for control (bar)": "Gebruikt voor de regeling (balk)", "Normal forecast": "Normale verwachting",
      "Price": "Prijs", "Expected price": "Verwachte prijs", "Sun: start": "Zon: starten", "Sun: keep charging": "Zon: doorladen",
      "Grid plan": "Netplan", "Cheap chance": "Goedkope kans",
      "No prices yet. Choose your price source on HESC's Settings page.": "Nog geen prijzen. Kies je prijsbron op de pagina Instellingen van HESC.",
      "can start": "kan starten", "keeps charging": "laadt door", "kW forecast": "kW verwacht",
      "h solar charging": "u laden op zon", "no solar charging expected": "geen laden op zon verwacht",
      "Expected solar charging": "Verwacht laden op zon", "Today": "Vandaag", "Tomorrow": "Morgen",
      "not charged": "niet geladen", "no data yet": "nog geen gegevens",
      "No data yet. HESC starts counting as soon as the EV charges.": "Nog geen gegevens. HESC begint te tellen zodra de auto laadt.",
      "Week": "Week", "this month": "deze maand", "last 12 weeks": "laatste 12 weken", "last 12 months": "laatste 12 maanden",
      "last 4 quarters": "laatste 4 kwartalen", "this year": "dit jaar", "Totals": "Totalen", "counting since": "geteld sinds",
      "Charged": "Geladen", "From sun": "Van de zon", "From grid": "Van het net", "Grid cost": "Kosten net",
      "Solar value (feed-in)": "Waarde zon (teruglevering)", "Average": "Gemiddeld",
      "price as given by the price source (all-in)": "prijs zoals de prijsbron hem geeft (all-in)", "mark-up": "opslag", "VAT": "btw",
      "Grid": "Net", "sun": "zon",
      "kWh from the grid without a known price (counted without energy price)": "kWh van het net zonder bekende prijs (geteld zonder energieprijs)",
      "Days": "Dagen", "Weeks": "Weken", "Months": "Maanden", "Quarters": "Kwartalen", "Year": "Jaar",
      "HESC is not ready": "HESC is nog niet klaar",
      "This dashboard comes from the HESC integration. Install HESC (HACS → HESC v3), add it under *Settings → Devices & services*, restart Home Assistant and open this page again.":
        "Dit dashboard komt uit de integratie HESC. Installeer HESC (HACS → HESC v3), voeg het toe bij *Instellingen → Apparaten & diensten*, herstart Home Assistant en open deze pagina opnieuw.",
    },
  };
  TEXTS.de = {
    "Now": "Jetzt", "Solar": "Sonne", "Forecast": "Prognose", "EV": "Auto", "PV actual": "Solarleistung", "EV charging": "Auto lädt",
    "Start threshold": "Startschwelle", "Keep-charging threshold": "Weiterladeschwelle",
    "EV can start on solar": "Auto kann mit Sonne starten", "Enough to keep charging, not to start": "Genug zum Weiterladen, nicht zum Starten",
    "Not enough sun": "Nicht genug Sonne", "Used for control (bar)": "Für die Regelung verwendet (Balken)", "Normal forecast": "Normale Prognose",
    "Price": "Preis", "Expected price": "Erwarteter Preis", "Sun: start": "Sonne: starten", "Sun: keep charging": "Sonne: weiterladen",
    "Grid plan": "Netzplan", "Cheap chance": "Günstige Gelegenheit",
    "No prices yet. Choose your price source on HESC's Settings page.": "Noch keine Preise. Wähle deine Preisquelle auf der Seite Einstellungen von HESC.",
    "can start": "kann starten", "keeps charging": "lädt weiter", "kW forecast": "kW Prognose",
    "h solar charging": "h Solarladen", "no solar charging expected": "kein Solarladen erwartet",
    "Expected solar charging": "Erwartetes Solarladen", "Today": "Heute", "Tomorrow": "Morgen",
    "not charged": "nicht geladen", "no data yet": "noch keine Daten",
    "No data yet. HESC starts counting as soon as the EV charges.": "Noch keine Daten. HESC beginnt zu zählen, sobald das Auto lädt.",
    "Week": "Woche", "this month": "dieser Monat", "last 12 weeks": "letzte 12 Wochen", "last 12 months": "letzte 12 Monate",
    "last 4 quarters": "letzte 4 Quartale", "this year": "dieses Jahr", "Totals": "Summen", "counting since": "gezählt seit",
    "Charged": "Geladen", "From sun": "Von der Sonne", "From grid": "Aus dem Netz", "Grid cost": "Kosten Netz",
    "Solar value (feed-in)": "Wert Sonne (Einspeisung)", "Average": "Durchschnitt",
    "price as given by the price source (all-in)": "Preis, wie ihn die Preisquelle liefert (Endpreis)", "mark-up": "Aufschlag", "VAT": "MwSt.",
    "Grid": "Netz", "sun": "Sonne",
    "kWh from the grid without a known price (counted without energy price)": "kWh aus dem Netz ohne bekannten Preis (ohne Strompreis gezählt)",
    "Days": "Tage", "Weeks": "Wochen", "Months": "Monate", "Quarters": "Quartale", "Year": "Jahr",
    "HESC is not ready": "HESC ist noch nicht bereit",
    "This dashboard comes from the HESC integration. Install HESC (HACS → HESC v3), add it under *Settings → Devices & services*, restart Home Assistant and open this page again.":
      "Dieses Dashboard kommt aus der Integration HESC. Installiere HESC (HACS → HESC v3), füge es unter *Einstellungen → Geräte & Dienste* hinzu, starte Home Assistant neu und öffne diese Seite erneut.",
  };
  const WEEKDAYS = { en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], nl: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"], de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] };
  const MONTH_NAMES = { en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    nl: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
    de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"] };
  let LANG = "en";
  const langOf = (hass) => String((hass && ((hass.locale && hass.locale.language) || hass.language)) || "en").split("-")[0].toLowerCase();
  const tr = (s) => (TEXTS[LANG] && TEXTS[LANG][s]) || s;
  const weekdays = () => WEEKDAYS[LANG] || WEEKDAYS.en;
  const monthNames = () => MONTH_NAMES[LANG] || MONTH_NAMES.en;
  const dayShort = (d) => weekdays()[(d.getDay() + 6) % 7];

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const hm = (d) => pad(d.getHours()) + ":" + pad(d.getMinutes());
  const fmtW = (v) => (Number.isFinite(v) ? Math.round(v).toLocaleString(LANG) + " W" : "—");
  const forecastKey = (setup) =>
    ({ estimate: "pv_estimate", estimate10: "pv_estimate10", estimate90: "pv_estimate90" })[
      String(((setup || {}).attributes || {}).hesc_forecast_attribute || "").trim()] || "pv_estimate10";

  // ---------------------------------------------------------------------------------------------
  // Base card: ha-card, an optional title with a house-style icon, re-render on relevant changes.
  class HescBase extends HTMLElement {
    setConfig(config) {
      this._config = Object.assign({}, config || {});
      this._ids = Object.assign({}, DEFAULTS, this._config.entities || {});
      this._last = null;
      if (this._hass) this._render(true);
    }
    set hass(hass) {
      this._hass = hass;
      LANG = langOf(hass);
      const key = LANG + "|" + this._watch().map((id) => (hass.states[id] || {}).last_updated || "").join("|");
      if (key !== this._last) { this._last = key; this._render(false); }
    }
    get hass() { return this._hass; }
    id(name) { return this._ids[name]; }
    st(name) { return this._hass && this._hass.states[this.id(name)]; }
    num(name, fallback) { const v = Number((this.st(name) || {}).state); return Number.isFinite(v) ? v : fallback; }
    source(attr) {
      // a source the dashboard names (HESC fills in the one chosen in its setup), else the setup sensor
      const key = { hesc_solar_today_sensor: "solar_today", hesc_solar_tomorrow_sensor: "solar_tomorrow" }[attr];
      const named = key && (this._config.entities || {})[key];
      return named || String(((this.st("setup") || {}).attributes || {})[attr] || "").trim();
    }
    _watch() { return []; }
    getCardSize() { return 3; }
    getGridOptions() { return { columns: "full", rows: "auto" }; }
    _shell(extraCss) {
      if (this._card) return;
      this.attachShadow({ mode: "open" });
      const title = this._config.title;
      const icon = this._config.icon;
      this.shadowRoot.innerHTML =
        "<style>:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;overflow:hidden}" +
        ".hdr{display:flex;flex-direction:column;gap:10px;padding:16px 16px 0}" +
        ".title{font-size:20px;font-weight:700;line-height:normal;color:var(--primary-text-color);display:flex;align-items:center;gap:8px}" +
        ".title ha-icon{--mdc-icon-size:24px}" +
        ".chips{display:flex;gap:16px;flex-wrap:wrap;justify-content:space-between}.chips:empty{display:none}" +
        ".chip{display:flex;flex-direction:column;align-items:flex-start}" +
        ".chip .v{font-size:24px;font-weight:400;line-height:1.2}.chip .u{font-size:15px;margin-left:2px;opacity:.9}" +
        ".chip .n{font-size:12px;color:var(--secondary-text-color)}" +
        ".body{position:relative}.tip{position:absolute;pointer-events:none;z-index:2;display:none}" +
        (extraCss || "") + "</style><ha-card>" +
        (title ? '<div class="hdr"><div class="title">' + (icon ? '<ha-icon icon="' + esc(icon) + '"></ha-icon>' : "") +
          '<span class="txt">' + esc(title) + '</span></div><div class="chips"></div></div>' : "") +
        '<div class="body"></div></ha-card>';
      this._card = this.shadowRoot.querySelector("ha-card");
      this._body = this.shadowRoot.querySelector(".body");
      this._chips = this.shadowRoot.querySelector(".chips");
    }
    _setChips(list) {
      if (!this._chips) return;
      this._chips.innerHTML = list.map((c) =>
        '<div class="chip"><span class="v" style="color:' + c.color + '">' + esc(String(c.value).replace(/ W$/, "")) +
        (/ W$/.test(String(c.value)) ? '<span class="u">W</span>' : "") + "</span>" +
        (c.name ? '<span class="n">' + esc(c.name) + "</span>" : "") + "</div>").join("");
    }
  }

  // ---------------------------------------------------------------------------------------------
  // A small SVG chart: time on x, areas / lines / columns, "Now" line, gridlines, tooltip.
  const monotonePath = (pts) => {
    // monotone cubic through the points (no overshoot), like a "smooth" line
    const n = pts.length;
    if (n < 2) return n ? "M" + pts[0][0] + "," + pts[0][1] : "";
    const dx = [], dy = [], m = [];
    for (let i = 0; i < n - 1; i++) { dx.push(pts[i + 1][0] - pts[i][0]); dy.push((pts[i + 1][1] - pts[i][1]) / (dx[i] || 1)); }
    m.push(dy[0]);
    for (let i = 1; i < n - 1; i++) m.push(dy[i - 1] * dy[i] <= 0 ? 0 : (dy[i - 1] + dy[i]) / 2);
    m.push(dy[n - 2]);
    for (let i = 0; i < n - 1; i++) {
      if (dy[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / dy[i], b = m[i + 1] / dy[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * dy[i]; m[i + 1] = t * b * dy[i]; }
    }
    let d = "M" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += "C" + (pts[i][0] + h).toFixed(1) + "," + (pts[i][1] + m[i] * h).toFixed(1) + " " +
        (pts[i + 1][0] - h).toFixed(1) + "," + (pts[i + 1][1] - m[i + 1] * h).toFixed(1) + " " +
        pts[i + 1][0].toFixed(1) + "," + pts[i + 1][1].toFixed(1);
    }
    return d;
  };
  const segments = (points) => {
    // split [[t, v|null], ...] into runs without nulls
    const out = []; let cur = [];
    points.forEach((p) => { if (p[1] === null || !Number.isFinite(p[1])) { if (cur.length) out.push(cur); cur = []; } else cur.push(p); });
    if (cur.length) out.push(cur);
    return out;
  };
  const niceStep = (span, target) => {
    const raw = span / Math.max(target, 1), p = Math.pow(10, Math.floor(Math.log10(raw || 1))), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  };

  function drawChart(opt) {
    // opt: {width, height, x0, x1, series, yMin, yMax, yTitle, nowLine, hourStep, rotateLabels, zeroLine, patterns}
    const W = Math.max(opt.width, 200), H = opt.height;
    const L = 46, R = 10, T = 10, B = opt.rotateLabels ? 46 : 24;
    const iw = W - L - R, ih = H - T - B;
    let lo = Infinity, hi = -Infinity;
    opt.series.forEach((s) => s.points.forEach((p) => { if (p[1] !== null && Number.isFinite(p[1])) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); } }));
    if (!Number.isFinite(lo)) { lo = 0; hi = 1; }
    if (opt.yMin !== undefined) lo = Math.min(opt.yMin, lo);
    if (opt.yMinFixed !== undefined) lo = opt.yMinFixed;
    if (hi <= lo) hi = lo + 1;
    const step = niceStep(hi - lo, 6);
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    const X = (t) => L + (t - opt.x0) / (opt.x1 - opt.x0) * iw;
    const Y = (v) => T + (hi - v) / (hi - lo) * ih;
    let g = "";
    // horizontal grid + y labels
    for (let v = lo; v <= hi + step / 2; v += step) {
      g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" stroke="var(--divider-color)" stroke-dasharray="2,2"/>';
      g += '<text x="' + (L - 6) + '" y="' + (Y(v) + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="var(--secondary-text-color)">' + Math.round(v).toLocaleString(LANG) + "</text>";
    }
    if (opt.yTitle) g += '<text transform="translate(10,' + (T + ih / 2) + ') rotate(-90)" text-anchor="middle" font-size="11" fill="var(--secondary-text-color)">' + esc(opt.yTitle) + "</text>";
    // vertical grid + x labels
    const hs = (opt.hourStep || 2) * 3600000;
    const first = new Date(opt.x0); first.setMinutes(0, 0, 0);
    for (let t = first.getTime(); t <= opt.x1; t += 3600000) {
      const d = new Date(t);
      if (t < opt.x0 || (d.getHours() % (hs / 3600000)) !== 0) continue;
      const x = X(t).toFixed(1);
      g += '<line x1="' + x + '" x2="' + x + '" y1="' + T + '" y2="' + (T + ih) + '" stroke="var(--divider-color)" stroke-dasharray="2,2"/>';
      if (!opt.rotateLabels && (X(t) > W - 16 || X(t) < 16)) continue;  // a label that would be cut off
      g += opt.rotateLabels
        ? '<text transform="translate(' + x + "," + (T + ih + 12) + ') rotate(-45)" text-anchor="end" font-size="10" fill="var(--secondary-text-color)">' + hm(d) + "</text>"
        : '<text x="' + x + '" y="' + (T + ih + 15) + '" text-anchor="middle" font-size="10" fill="var(--secondary-text-color)">' + hm(d) + "</text>";
    }
    let defs = "";
    (opt.patterns || []).forEach((p) => {
      defs += '<pattern id="' + p.id + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
        '<rect width="6" height="6" fill="' + p.color + '" fill-opacity="0.25"/><line x1="0" y1="0" x2="0" y2="6" stroke="' + p.color + '" stroke-width="3"/></pattern>';
    });
    const base = Y(Math.max(lo, Math.min(hi, 0)));
    let body = "";
    opt.series.forEach((s) => {
      if (s.type === "column") {
        const w = s.slotMs ? (X(opt.x0 + s.slotMs) - X(opt.x0)) * (s.widthPct || 0.9) : 4;
        s.points.forEach((p) => {
          if (p[1] === null || !Number.isFinite(p[1])) return;
          const x = X(p[0] + (s.slotMs || 0) / 2) - w / 2, y = Y(p[1]);
          body += '<rect x="' + x.toFixed(1) + '" y="' + Math.min(y, base).toFixed(1) + '" width="' + Math.max(w, 1).toFixed(1) + '" height="' + Math.abs(base - y).toFixed(1) +
            '" rx="2" fill="' + (p[2] || s.color) + '"/>';
        });
        return;
      }
      segments(s.points).forEach((seg) => {
        const pts = seg.map((p) => [X(p[0]), Y(p[1])]);
        const line = s.smooth === false ? "M" + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") : monotonePath(pts);
        if (s.type === "area") {
          const area = line + "L" + pts[pts.length - 1][0].toFixed(1) + "," + base.toFixed(1) + "L" + pts[0][0].toFixed(1) + "," + base.toFixed(1) + "Z";
          body += '<path d="' + area + '" fill="' + (s.fill || s.color) + '" fill-opacity="' + (s.fill ? 1 : (s.opacity === undefined ? 0.4 : s.opacity)) + '" stroke="none"/>';
        }
        if (s.stroke !== 0) {
          body += '<path d="' + line + '" fill="none" stroke="' + s.color + '" stroke-width="' + (s.stroke || 2) + '"' +
            (s.dash ? ' stroke-dasharray="' + s.dash + "," + s.dash + '"' : "") + "/>";
        }
      });
    });
    if (opt.zeroLine && lo < 0 && hi > 0) body += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + base.toFixed(1) + '" y2="' + base.toFixed(1) + '" stroke="var(--secondary-text-color)"/>';
    if (opt.nowLine) {
      const n = Date.now();
      if (n >= opt.x0 && n <= opt.x1) {
        const x = X(n).toFixed(1);
        body += '<line x1="' + x + '" x2="' + x + '" y1="' + T + '" y2="' + (T + ih) + '" stroke="#009ac7" stroke-width="1.5"/>' +
          '<rect x="' + (X(n) - 15).toFixed(1) + '" y="' + T + '" width="30" height="14" rx="2" fill="#009ac7"/>' +
          '<text x="' + x + '" y="' + (T + 10.5) + '" text-anchor="middle" font-size="10" fill="#fff">' + tr("Now") + "</text>";
      }
    }
    const svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" style="display:block;font-family:inherit">' +
      (defs ? "<defs>" + defs + "</defs>" : "") + g + body +
      '<line class="cross" x1="0" x2="0" y1="' + T + '" y2="' + (T + ih) + '" stroke="var(--secondary-text-color)" stroke-dasharray="3,3" visibility="hidden"/></svg>';
    return { svg, X, Y, L, R, T, iw, ih, toTime: (px) => opt.x0 + (px - L) / iw * (opt.x1 - opt.x0) };
  }

  const TIP_STYLE = "padding:8px 10px;font-size:10px;width:max-content;max-width:260px;box-sizing:border-box;" +
    "background:color-mix(in srgb,var(--ha-card-background,var(--card-background-color)) 85%,transparent);" +
    "border-radius:6px;border:1px solid var(--divider-color);color:var(--primary-text-color);font-weight:600;";
  const tipRow = (name, value, colour) =>
    '<div style="display:flex;align-items:center;gap:6px;margin:2px 0;">' +
    '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + colour + ';flex-shrink:0;"></span>' +
    '<span style="color:var(--secondary-text-color);min-width:88px;font-weight:700;">' + esc(name) + "</span>" +
    '<span style="font-weight:700;margin-left:auto;">' + esc(value) + "</span></div>";

  // A chart card: draws on resize and on new data; tooltip from tipAt(t).
  class HescChart extends HescBase {
    connectedCallback() {
      if (!this._ro && window.ResizeObserver) {
        this._ro = new ResizeObserver(() => this._resized());
        if (this._body) this._ro.observe(this._body);
      }
      if (!this._tick) this._tick = setInterval(() => this._draw(), 60000);
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } clearInterval(this._tick); this._tick = null; }
    _render() {
      if (!this._card) {
        this._shell();
        this._body.innerHTML = '<div class="plot"></div><div class="tip"></div>' + (this._legendHtml ? this._legendHtml() : "");
        if (window.ResizeObserver && !this._ro) { this._ro = new ResizeObserver(() => this._resized()); this._ro.observe(this._body); }
        const plot = this._body.querySelector(".plot"), tip = this._body.querySelector(".tip");
        plot.addEventListener("mousemove", (ev) => this._hover(ev, plot, tip));
        plot.addEventListener("mouseleave", () => { tip.style.display = "none"; const c = plot.querySelector(".cross"); if (c) c.setAttribute("visibility", "hidden"); });
      }
      this._update();
    }
    _hover(ev, plot, tip) {
      if (!this._geo) return;
      const rect = plot.getBoundingClientRect();
      const px = ev.clientX - rect.left;
      if (px < this._geo.L || px > this._geo.L + this._geo.iw) { tip.style.display = "none"; return; }
      const html = this._tipAt(this._geo.toTime(px));
      const cross = plot.querySelector(".cross");
      if (cross) { cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.setAttribute("visibility", "visible"); }
      if (!html) { tip.style.display = "none"; return; }
      tip.innerHTML = '<div style="' + TIP_STYLE + '">' + html + "</div>";
      tip.style.display = "block";
      const tw = tip.offsetWidth;
      tip.style.left = (px + 12 + tw > rect.width ? px - tw - 12 : px + 12) + "px";
      tip.style.top = Math.max(0, ev.clientY - rect.top - 20) + "px";
    }
    _resized() {
      const w = this._body ? this._body.clientWidth : 0;
      if (w && w !== this._width) { this._width = w; requestAnimationFrame(() => this._draw()); }
    }
    _draw() {
      if (!this._body || !this._hass) return;
      const plot = this._body.querySelector(".plot");
      const width = this._body.clientWidth || 400;
      this._width = width;
      const opt = this._chartOptions(width);
      if (!opt) {
        plot.innerHTML = this._empty ? '<div style="padding:12px 16px 16px;color:var(--secondary-text-color)">' + esc(this._empty) + "</div>" : "";
        return;
      }
      const res = drawChart(opt);
      this._geo = res;
      plot.innerHTML = res.svg;
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Solar forecast vs actual · EV (last 12 hours, 5-minute averages from the history)
  class HescSolarChart extends HescChart {
    static getStubConfig() { return { title: "Solar forecast vs actual · EV", icon: "hesc:zon" }; }
    _watch() { return [this.id("pv_diag"), this.id("forecast_diag"), this.id("ev_diag"), this.id("p_start")]; }
    _update() {
      const v = (n) => { const x = Number((this.st(n) || {}).state); return Number.isFinite(x) && x >= 0 && x <= 50000 ? x : NaN; };
      this._setChips([
        { value: fmtW(v("pv_diag")), name: tr("Solar"), color: "#F59E0B" },
        { value: fmtW(v("forecast_diag")), name: tr("Forecast"), color: "#8B5CF6" },
        { value: fmtW(v("ev_diag")), name: tr("EV"), color: "#06B6D4" },
      ]);
      const now = Date.now();
      if (!this._hist || now - this._fetched > 300000) this._fetch();
      else { this._appendLive(); this._draw(); }
    }
    async _fetch() {
      if (this._busy) return;
      this._busy = true;
      this._fetched = Date.now();
      const end = new Date(), start = new Date(end.getTime() - 12 * 3600000);
      const ids = [this.id("forecast_diag"), this.id("pv_diag"), this.id("ev_diag")];
      try {
        const h = await this._hass.callWS({ type: "history/history_during_period", start_time: start.toISOString(), end_time: end.toISOString(),
          entity_ids: ids, minimal_response: true, no_attributes: true });
        this._hist = {};
        ids.forEach((id) => {
          this._hist[id] = (h[id] || []).map((p) => [((p.lu !== undefined ? p.lu : p.lc) || 0) * 1000, Number(p.s)]);
        });
      } catch (e) { this._hist = this._hist || {}; }
      this._busy = false;
      this._appendLive();
      this._draw();
    }
    _appendLive() {
      if (!this._hist) return;
      [this.id("forecast_diag"), this.id("pv_diag"), this.id("ev_diag")].forEach((id) => {
        const s = this._hass.states[id];
        if (!s) return;
        const list = this._hist[id] || (this._hist[id] = []);
        const t = new Date(s.last_updated).getTime(), last = list[list.length - 1];
        if (!last || t > last[0]) list.push([t, Number(s.state)]);
      });
    }
    _buckets(id, x0, x1, sign) {
      // 5-minute time-weighted averages of the step line; outside 0..50000 W counts as no value
      const raw = (this._hist || {})[id] || [];
      const out = [], step = 300000, now = Date.now();
      for (let b = x0; b < x1; b += step) {
        let sum = 0, dur = 0;
        for (let i = 0; i < raw.length; i++) {
          const a = raw[i][0], e = i + 1 < raw.length ? raw[i + 1][0] : now, v = raw[i][1];
          const s = Math.max(a, b), f = Math.min(e, b + step);
          if (f <= s || !Number.isFinite(v) || v < 0 || v > 50000) continue;
          sum += v * (f - s); dur += f - s;
        }
        out.push([b + step / 2, dur > 0 ? sign * sum / dur : (b + step <= now && b >= (raw[0] || [Infinity])[0] ? 0 : null)]);
      }
      return out;
    }
    _chartOptions(width) {
      const x1 = Date.now(), x0 = x1 - 12 * 3600000;
      const series = [
        { type: "area", color: "#8B5CF6", opacity: 0.45, points: this._buckets(this.id("forecast_diag"), x0, x1, 1) },
        { type: "area", color: "#F59E0B", opacity: 0.9, points: this._buckets(this.id("pv_diag"), x0, x1, 1) },
        { type: "area", color: "#06B6D4", opacity: 0.55, points: this._buckets(this.id("ev_diag"), x0, x1, -1) },
      ];
      this._series = series;
      const thr = this.num("p_start", NaN);
      let peak = 0;
      series.forEach((s) => s.points.forEach((p) => { if (p[1] !== null) peak = Math.max(peak, Math.abs(p[1])); }));
      if (Number.isFinite(thr) && peak >= thr * 0.8) series.push({ type: "line", color: "#94A3B8", stroke: 1, dash: 6, smooth: false, points: [[x0, thr], [x1, thr]] });
      return { width, height: this._config.height || 337, x0, x1, series, yTitle: "W", zeroLine: true, hourStep: 2 };
    }
    _tipAt(t) {
      if (!this._series) return "";
      const d = new Date(t);
      const at = (s) => { let best = null; s.points.forEach((p) => { if (Math.abs(p[0] - t) <= 150000) best = p[1]; }); return best; };
      const names = ["Forecast", "PV actual", "EV charging"].map(tr), colours = ["#8B5CF6", "#F59E0B", "#06B6D4"];
      return '<div style="margin-bottom:4px">' + pad(d.getDate()) + " " + monthNames()[d.getMonth()] + " · " + hm(d) + "</div>" +
        names.map((n, i) => { const v = at(this._series[i]); return tipRow(n, v === null ? "—" : fmtW(Math.abs(v)), colours[i]); }).join("");
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Solar charging forecast: half-hour columns for today and tomorrow, coloured by the thresholds
  class HescSolarForecast extends HescChart {
    static getStubConfig() { return { title: "Solar charging forecast", icon: "hesc:zonnepaneel" }; }
    _watch() { return [this.source("hesc_solar_today_sensor"), this.source("hesc_solar_tomorrow_sensor"), this.id("p_start"), this.id("p_hold"), this.id("setup")]; }
    _update() {
      this._setChips([
        { value: fmtW(this.num("p_start", NaN)), name: tr("Start threshold"), color: "#22c55e" },
        { value: fmtW(this.num("p_hold", NaN)), name: tr("Keep-charging threshold"), color: "#ff9800" },
      ]);
      this._draw();
    }
    _points() {
      const pStart = this.num("p_start", 2000), pHold = this.num("p_hold", 1500);
      const key = forecastKey(this.st("setup"));
      const tomorrow = new Date(); tomorrow.setHours(24, 0, 0, 0);
      const now = Date.now(), out = [];
      let slot = 1800000;
      [this.source("hesc_solar_today_sensor"), this.source("hesc_solar_tomorrow_sensor")].forEach((id) => {
        const at = ((this._hass.states[id] || {}).attributes) || {};
        const half = Array.isArray(at.detailedForecast) && at.detailedForecast.length > 0;
        const rows = half ? at.detailedForecast : (at.detailedHourly || []);
        if (!half && rows.length) slot = 3600000;
        rows.forEach((r) => {
          const ts = new Date(r.period_start).getTime(), normal = Number(r.pv_estimate) * 1000, decide = Number(r[key]) * 1000;
          if (!Number.isFinite(ts) || !Number.isFinite(normal)) return;
          const band = decide >= pStart ? "go" : (decide >= pHold ? "hold" : "low");
          const isNow = now >= ts && now < ts + slot;
          const colour = isNow ? "#009ac7" : { go: "#22c55e", hold: "#ff9800", low: "#64748b" }[band];
          out.push({ x: ts, decide: Math.round(decide), normal: Math.round(normal), band, colour: ts >= tomorrow.getTime() && !isNow ? colour + "e6" : colour });
        });
      });
      this._slot = slot;
      return out;
    }
    _chartOptions(width) {
      const x0 = new Date(); x0.setHours(0, 0, 0, 0);
      const pts = this._points();
      this._pts = pts;
      return { width, height: this._config.height || 170, x0: x0.getTime(), x1: x0.getTime() + 48 * 3600000, yMinFixed: 0, yTitle: "W", nowLine: true, hourStep: 6,
        series: [{ type: "column", color: "#64748b", slotMs: this._slot, widthPct: 0.9, points: pts.map((p) => [p.x, p.decide, p.colour]) }] };
    }
    _tipAt(t) {
      const p = (this._pts || []).find((q) => t >= q.x && t < q.x + this._slot);
      if (!p) return "";
      const label = { go: ["#22c55e", tr("EV can start on solar")], hold: ["#ff9800", tr("Enough to keep charging, not to start")], low: ["#64748b", tr("Not enough sun")] }[p.band];
      return '<div style="margin-bottom:4px">' + hm(new Date(p.x)) + " – " + hm(new Date(p.x + this._slot)) + "</div>" +
        tipRow(tr("Used for control (bar)"), fmtW(p.decide), "#A78BFA") + tipRow(tr("Normal forecast"), fmtW(p.normal), "#94a3b8") + tipRow(label[1], "", label[0]);
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Day-ahead prices per quarter (cents per kWh): known prices, expected prices, sun, plan, cheap chances
  const PRICE_SERIES = [
    { key: "price", name: "Price", color: "#cbd5e1" },
    { key: "expected", name: "Expected price", color: "#7b8494" },
    { key: "sun", name: "Sun: start", color: "#22c55e" },
    { key: "hold", name: "Sun: keep charging", color: "#ff9800" },
    { key: "grid", name: "Grid plan", color: "#2563eb" },
    { key: "cheap", name: "Cheap chance", color: "#a855f7" },
  ];
  class HescPriceChart extends HescChart {
    static getStubConfig() { return { title: "Day-ahead prices per quarter (cents per kWh)", icon: "hesc:euro-klok" }; }
    _watch() {
      return [this.id("prices"), this.id("plan"), this.id("price_forecast"), this.id("cheap_on"), this.id("cheap_price"), this.id("ev_full"), this.id("ev_kwh"),
        this.id("plan_kw"), this.id("p_start"), this.id("p_hold"), this.id("setup"), this.source("hesc_ev_soc_sensor"),
        this.source("hesc_solar_today_sensor"), this.source("hesc_solar_tomorrow_sensor")];
    }
    _legendHtml() {
      return '<div style="display:flex;flex-wrap:wrap;gap:4px 12px;padding:4px 16px 0;font-size:12px;color:var(--secondary-text-color)">' +
        PRICE_SERIES.map((s) => '<span style="display:inline-flex;align-items:center;gap:4px"><span style="width:12px;height:12px;border-radius:50%;background:' + s.color + '"></span>' + esc(tr(s.name)) + "</span>").join("") + "</div>";
    }
    _render(first) {
      super._render(first);
      const legend = this._body.lastElementChild;
      if (legend && legend.previousElementSibling && !legend.classList.contains("moved")) { legend.classList.add("moved"); this._body.insertBefore(legend, this._body.firstChild); }
    }
    _update() {
      const src = (this.st("prices") || {}).attributes || {};
      // v2.0.0: the unit in the title follows the currency (cents, öre, øre, pence); 3.0.0: also "(cent per kWh)"
      const tt = this.shadowRoot.querySelector(".title .txt");
      const unit = /\((cents|cent|Cent) (per|pro) kWh\)/.exec(this._config.title || "");
      if (tt && unit) {
        const cent = unit[1];  // "cents" in English, "cent" in Dutch, "Cent" in German
        const minor = { ct: cent, "öre": "öre", "øre": "øre", p: "pence", c: cent }[src.minor] || cent;
        tt.textContent = this._config.title.replace(unit[0], "(" + minor + " " + unit[2] + " kWh)");
      }
      const n = Date.now();
      const p = [...(src.raw_today || []), ...(src.raw_tomorrow || [])].find((x) => new Date(x.start).getTime() <= n && n < new Date(x.end).getTime());
      this._setChips(p ? [{ value: (Math.round(p.value * 1000) / 10).toLocaleString(LANG, { minimumFractionDigits: 1 }), name: "", color: "#009ac7" }] : []);
      this._draw();
    }
    _data() {
      // the same rules as the control, as the previous price chart
      const S = this._hass.states;
      const r = (S[this.id("plan")] || {}).attributes ? S[this.id("plan")].attributes.plan : null;
      let plan = null;
      try { plan = typeof r === "string" ? JSON.parse(r) : r; } catch (e) { plan = null; }
      const planned = new Set(((plan && plan.active) ? (plan.planned || []) : []).map((x) => new Date(x).getTime()));
      const oppOn = (S[this.id("cheap_on")] || {}).state === "on";
      const thr = parseFloat((S[this.id("cheap_price")] || {}).state);
      const nm = (id) => parseFloat((S[id] || {}).state);
      const goal = parseFloat(plan && plan.goal);
      const soc = nm(this.source("hesc_ev_soc_sensor"));
      const target = isNaN(goal) ? (nm(this.id("ev_full")) || 80) : goal;
      const need = isNaN(soc) ? 0 : Math.max(0, target - soc) / 100 * (nm(this.id("ev_kwh")) || 60);
      const kw = nm(this.id("plan_kw")) || 11;
      const hold = nm(this.id("p_hold")) || 1200;
      const start = nm(this.id("p_start")) || 2000;
      const fk = forecastKey(S[this.id("setup")]);
      const rows = [].concat(((S[this.source("hesc_solar_today_sensor")] || {}).attributes || {}).detailedForecast || [],
        ((S[this.source("hesc_solar_tomorrow_sensor")] || {}).attributes || {}).detailedForecast || []);
      const tz = (this._hass.config && this._hass.config.time_zone) || undefined;
      const day = (t) => new Date(t).toLocaleDateString("sv-SE", { timeZone: tz });
      const sunSkip = (t) => {
        if (need <= 0) return false;
        const from = Math.max(t, Date.now()), d = day(t); let k = 0;
        for (const x of rows) {
          const a = new Date(x.period_start).getTime(), e = a + 1800000, v = (parseFloat(x[fk]) || 0) * 1000;
          if (isNaN(a) || e <= from || day(a) !== d || v < hold) continue;
          k += Math.min(Math.max(v / 1000 - 0.4, 0), kw) * 0.5 * (e - Math.max(a, from)) / 1800000;
        }
        return k >= 1.2 * need;
      };
      const sunW = (t) => { for (const x of rows) { const a = new Date(x.period_start).getTime(); if (t >= a && t < a + 1800000) return (parseFloat(x[fk]) || 0) * 1000; } return 0; };
      const src = (S[this.id("prices")] || {}).attributes || {};
      const known = [...(src.raw_today || []), ...(src.raw_tomorrow || [])];
      const last = known.length ? Math.max(...known.map((p) => new Date(p.end).getTime())) : 0;
      const fc = (((S[this.id("price_forecast")] || {}).attributes || {}).forecast || [])
        .filter((p) => new Date(p.start).getTime() >= last).map((p) => Object.assign({}, p, { fc: true }));
      const all = [...known, ...fc];
      const tm = (p) => new Date(p.start).getTime();
      const val = (p) => Math.round(p.value * 1000) / 10;
      const is = {
        grid: (p) => planned.has(tm(p)),
        // 3.1.0: where the sun can start charging, the sun wins over a cheap chance (it is cheaper, and it is
        // what HESC really does), so that quarter is shown green only
        cheap: (p) => !p.fc && oppOn && !isNaN(thr) && p.value <= thr && !sunSkip(tm(p)) && !(sunW(tm(p)) >= start),
        sun: (p) => sunW(tm(p)) >= start,
        hold: (p) => { const w = sunW(tm(p)); return w >= hold && w < start; },
      };
      const run = (f) => all.map((p, i) => [tm(p), (f(p) || (i > 0 && f(all[i - 1]))) ? val(p) : null]);
      return {
        all, val, is,
        series: {
          price: all.map((p, i) => [tm(p), (!p.fc || (i > 0 && !all[i - 1].fc)) ? val(p) : null]),
          expected: all.map((p) => [tm(p), p.fc ? val(p) : null]),
          sun: run(is.sun), hold: run(is.hold), grid: run(is.grid), cheap: run(is.cheap),
        },
      };
    }
    _chartOptions(width) {
      const x0 = new Date(); x0.setHours(0, 0, 0, 0);
      const d = this._data();
      this._d = d;
      if (!d.all.length) { this._empty = tr("No prices yet. Choose your price source on HESC's Settings page."); return null; }
      const s = d.series;
      return {
        width, height: this._config.height || 280, x0: x0.getTime(), x1: x0.getTime() + 48 * 3600000, yMin: 0, nowLine: true, hourStep: 3, rotateLabels: true,
        patterns: [{ id: "hescCheap", color: "#a855f7" }],
        series: [
          { type: "area", color: "#cbd5e1", opacity: 0.12, stroke: 2, points: s.price },
          // 3.1.0: the expected (not yet published) prices get an almost empty area, so they read differently
          { type: "area", color: "#7b8494", opacity: 0.02, stroke: 2, dash: 5, points: s.expected },
          { type: "area", color: "#22c55e", opacity: 0.6, stroke: 0, points: s.sun },
          { type: "area", color: "#ff9800", opacity: 0.6, stroke: 0, points: s.hold },
          { type: "area", color: "#2563eb", opacity: 0.85, stroke: 0, points: s.grid },
          { type: "area", color: "#a855f7", fill: "url(#hescCheap)", stroke: 0, points: s.cheap },
        ],
      };
    }
    _tipAt(t) {
      const d = this._d;
      if (!d) return "";
      const p = d.all.find((q) => { const a = new Date(q.start).getTime(); return t >= a && t < new Date(q.end).getTime(); });
      if (!p) return "";
      const a = new Date(p.start);
      const what = d.is.grid(p) ? PRICE_SERIES[4] : d.is.cheap(p) ? PRICE_SERIES[5] : d.is.sun(p) ? PRICE_SERIES[2] : d.is.hold(p) ? PRICE_SERIES[3] : null;
      return '<div style="margin-bottom:4px">' + (LANG === "en" ? a.toLocaleString("en", { weekday: "short" }) : LANG === "nl" ? dayShort(a).toLowerCase() : dayShort(a)) + " " + hm(a) + "</div>" +
        tipRow(tr(p.fc ? "Expected price" : "Price"), d.val(p).toLocaleString(LANG, { minimumFractionDigits: 1 }), p.fc ? "#7b8494" : "#cbd5e1") +
        (what ? tipRow(tr(what.name), "", what.color) : "");
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Expected solar charging: per day a bar from 04:00 to 22:00 with green (can start) and orange slots
  class HescExpectedSolar extends HescBase {
    static getStubConfig() { return {}; }
    _watch() { return [this.source("hesc_solar_today_sensor"), this.source("hesc_solar_tomorrow_sensor"), this.id("p_start"), this.id("p_hold"), this.id("setup"), "sun.sun"]; }
    _render() {
      if (!this._card) this._shell();
      const hass = this._hass;
      const pStart = this.num("p_start", 2000), pHold = this.num("p_hold", 1500);
      const key = forecastKey(this.st("setup"));
      const lat = hass.config.latitude, lon = hass.config.longitude;
      const SCALE_START = 4, SCALE_END = 22;
      const pct = (d) => { const h = d.getHours() + d.getMinutes() / 60; return Math.max(0, Math.min(100, (h - SCALE_START) / (SCALE_END - SCALE_START) * 100)); };
      const sunTimes = (dayDate) => {
        const rad = Math.PI / 180;
        const y = dayDate.getFullYear(), m = dayDate.getMonth(), dd = dayDate.getDate();
        const doy = Math.round((Date.UTC(y, m, dd) - Date.UTC(y, 0, 0)) / 864e5);
        const g = 2 * Math.PI / 365 * (doy - 1);
        const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
        const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
        const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl)) / rad;
        const base = Date.UTC(y, m, dd);
        return [new Date(base + (720 - 4 * (lon + ha) - eq) * 60000), new Date(base + (720 - 4 * (lon - ha) - eq) * 60000)];
      };
      const now = new Date();
      const dayRow = (entity, label, dayDate, isToday) => {
        const at = ((hass.states[entity] || {}).attributes) || {};
        const half = Array.isArray(at.detailedForecast) && at.detailedForecast.length > 0;
        const rows = half ? at.detailedForecast : (at.detailedHourly || []);
        const slotMin = half ? 30 : 60;
        const [rise, set] = sunTimes(dayDate);
        let phase = "", slots = "", chargeMin = 0;
        rows.forEach((r) => {
          const t = new Date(r.period_start);
          const v = Number(r[key]) * 1000;
          let cls = "";
          if (v >= pStart) { phase = "go"; cls = "go"; } else if (v >= pHold && phase) { phase = "hold"; cls = "hold"; } else { phase = ""; }
          if (!cls) return;
          const end = new Date(t.getTime() + slotMin * 60000);
          if (end <= rise || t >= set) return;
          chargeMin += slotMin;
          const past = isToday && end <= now;
          const left = pct(t), width = pct(end) - pct(t);
          slots += '<div style="position:absolute;top:0;bottom:0;left:' + left + "%;width:calc(" + width + "% - 1px);background:" + (cls === "go" ? "#22c55e" : "#ff9800") +
            ";opacity:" + (past ? 0.35 : 1) + ';border-radius:2px;" title="' + hm(t) + "–" + hm(end) + " · " + tr(cls === "go" ? "can start" : "keeps charging") +
            " (~" + (v / 1000).toFixed(1) + " " + tr("kW forecast") + ')"></div>';
        });
        const track = '<div style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(255,255,255,0.04);border-radius:3px;"></div>';
        const daylight = '<div style="position:absolute;top:0;bottom:0;left:' + pct(rise) + "%;width:" + (pct(set) - pct(rise)) + '%;background:rgba(255,255,255,0.10);border-radius:3px;"></div>';
        const nowMark = isToday && now > rise && now < set ? '<div style="position:absolute;top:-3px;bottom:-3px;left:' + pct(now) + '%;width:2px;background:#009ac7;border-radius:1px;"></div>' : "";
        const hours = (chargeMin / 60).toLocaleString(LANG === "en" ? "en-GB" : LANG, { maximumFractionDigits: 1 });
        const info = '<ha-icon icon="hesc:zonsopkomst" style="--mdc-icon-size:14px;vertical-align:-2px;margin-right:4px"></ha-icon>' + hm(rise) + " – " + hm(set) + " · " +
          (chargeMin ? hours + " " + tr("h solar charging") : tr("no solar charging expected"));
        return '<div style="display:flex;align-items:flex-start;gap:8px;margin-top:10px;">' +
          '<div style="flex:0 0 72px;font-weight:700;font-size:13px;line-height:14px;">' + label + "</div>" +
          '<div style="flex:1 1 auto;min-width:0;"><div style="position:relative;height:14px;">' + track + daylight + slots + nowMark + "</div>" +
          '<div style="font-size:11px;color:var(--secondary-text-color);margin-top:3px;">' + info + "</div></div></div>";
      };
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      let ticks = "";
      [6, 9, 12, 15, 18, 21].forEach((h) => {
        const p = (h - SCALE_START) / (SCALE_END - SCALE_START) * 100;
        ticks += '<span style="position:absolute;left:' + p + '%;transform:translateX(-50%);">' + pad(h) + ":00</span>";
      });
      this._body.innerHTML = '<div style="text-align:left;width:100%;box-sizing:border-box;padding:10px 14px;">' +
        '<div style="font-weight:700;font-size:14px;"><ha-icon icon="hesc:laadstekker" style="--mdc-icon-size:16px;vertical-align:3px;margin-right:4px"></ha-icon>' + tr("Expected solar charging") + "</div>" +
        dayRow(this.source("hesc_solar_today_sensor"), tr("Today"), now, true) +
        dayRow(this.source("hesc_solar_tomorrow_sensor"), tr("Tomorrow"), tomorrow, false) +
        '<div style="display:flex;gap:8px;margin-top:6px;"><div style="flex:0 0 72px;"></div>' +
        '<div style="flex:1 1 auto;position:relative;height:12px;font-size:10px;color:var(--secondary-text-color);">' + ticks + "</div></div></div>";
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Charging costs: `view: totals` (the sums for the chosen period) or `view: tiles` (calendar / tiles)
  class HescCosts extends HescBase {
    static getStubConfig() { return { view: "totals" }; }
    _watch() { return [this.id("costs"), this.id("costs_all_in"), this.id("costs_markup"), this.id("costs_vat"), this.id("feed_in"), this.id("costs_period"), this.id("prices")]; }
    _render() {
      if (!this._card) this._shell(".body{padding:12px 14px;line-height:normal}");
      const states = this._hass.states;
      const A = (states[this.id("costs")] || {}).attributes || {};
      const sv = (id) => Number((states[id] || {}).state) || 0;
      const allIn = (states[this.id("costs_all_in")] || {}).state === "on";
      const feed = sv(this.id("feed_in"));
      const mk = allIn ? 0 : sv(this.id("costs_markup"));
      const vat = allIn ? 0 : sv(this.id("costs_vat"));
      const since = A.since ? new Date(A.since + "T00:00:00") : null;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const conv = (r, dateStr) => ({ d: new Date(dateStr + "T12:00:00"), sun: Number(r[1]) || 0, grid: Number(r[2]) || 0,
        gridCost: ((Number(r[3]) || 0) + (Number(r[2]) || 0) * mk) * (1 + vat / 100), sunValue: (Number(r[1]) || 0) * feed, noPrice: Number(r[4]) || 0 });
      const days = (A.days || []).map((r) => conv(r, r[0]));
      const months = (A.months || []).map((r) => Object.assign(conv(r, r[0] + "-15"), { key: r[0] }));
      const sum = (list) => list.reduce((a, x) => ({ sun: a.sun + x.sun, grid: a.grid + x.grid, gridCost: a.gridCost + x.gridCost, sunValue: a.sunValue + x.sunValue,
        noPrice: a.noPrice + (x.noPrice || 0) }), { sun: 0, grid: 0, gridCost: 0, sunValue: 0, noPrice: 0 });
      const PA = (states[this.id("prices")] || {}).attributes || {};
      const SYM = PA.symbol || "€", MIN = PA.minor || "ct";
      const DEC = PA.decimal === "." ? "." : ",";
      const AFTER = PA.symbol_after === true || PA.symbol_after === "True" || PA.symbol_after === "true";
      const eur = (v) => AFTER ? (v.toFixed(2).replace(".", DEC) + " " + SYM) : (SYM + (DEC === "." ? "" : " ") + v.toFixed(2).replace(".", DEC));
      const n1 = (v) => v.toFixed(1).replace(".", DEC);
      const isoWeek = (dt) => { const t = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())); const dn = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dn);
        const y = t.getUTCFullYear(); const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7); return { y, w }; };
      const MONTHS = monthNames();
      const bar = (a, max) => { const t = a.sun + a.grid; const w = max > 0 ? Math.max(t / max * 100, t > 0 ? 6 : 0) : 0; const sp = t > 0 ? a.sun / t * 100 : 0;
        return '<div style="height:8px;border-radius:4px;background:rgba(148,163,184,.15);overflow:hidden;margin:6px 0 4px"><div style="width:' + w + '%;height:100%;display:flex">' +
          '<div style="width:' + sp + '%;background:#22c55e"></div><div style="flex:1;background:#94a3b8"></div></div></div>'; };
      const cost = (a) => a.gridCost + a.sunValue;
      const trend = (a, prev) => { if (!prev) return '<span style="color:var(--secondary-text-color)">•</span>'; const c = cost(a), p = cost(prev);
        if (p === 0 && c === 0) return '<span style="color:var(--secondary-text-color)">=</span>';
        if (c > p * 1.05) return '<span style="color:#f87171">▲</span>'; if (c < p * 0.95) return '<span style="color:#22c55e">▼</span>';
        return '<span style="color:var(--secondary-text-color)">=</span>'; };
      const tile = (label, a, max, prev, dim, emptyText) => { const t = a.sun + a.grid; const pct = t > 0 ? Math.round(a.sun / t * 100) : 0;
        return '<div style="border:1px solid var(--divider-color);border-radius:10px;padding:8px 10px;' + (dim ? "opacity:.35;" : "") + '">' +
          '<div style="display:flex;gap:6px;align-items:center;font-size:12px;color:var(--secondary-text-color)">' + trend(a, prev) + "<span>" + label + "</span></div>" +
          bar(a, max) + '<div style="font-size:16px;font-weight:600;color:var(--primary-text-color)">' + (t > 0 ? eur(cost(a)) : "–") + "</div>" +
          '<div style="font-size:11px;color:var(--secondary-text-color)">' + (t > 0 ? n1(t) + " kWh · " + pct +
            '% <ha-icon icon="hesc:zon" style="--mdc-icon-size:14px;vertical-align:-2px;margin-right:4px"></ha-icon>' : (emptyText !== undefined ? emptyText : tr("not charged"))) + "</div></div>"; };
      const ZERO = { sun: 0, grid: 0, gridCost: 0, sunValue: 0, noPrice: 0 };
      const P = (states[this.id("costs_period")] || {}).state || "Days";
      let out = "";
      if (this._config.view === "tiles") {
        if (!A.days) { this._body.innerHTML = '<div style="color:var(--secondary-text-color)">' + esc(tr("No data yet. HESC starts counting as soon as the EV charges.")) + "</div>"; return; }
        if (P === "Days") {
          const y = today.getFullYear(), m = today.getMonth();
          const first = new Date(y, m, 1); const nDays = new Date(y, m + 1, 0).getDate();
          const off = (first.getDay() + 6) % 7;
          const byDay = {}; days.forEach((x) => { if (x.d.getFullYear() === y && x.d.getMonth() === m) byDay[x.d.getDate()] = x; });
          const list = Object.values(byDay); const max = Math.max(...list.map((x) => x.sun + x.grid), 1);
          out += '<div style="font-size:14px;font-weight:600;margin-bottom:8px">' + MONTHS[m] + " " + y + "</div>";
          out += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">';
          weekdays().forEach((w) => { out += '<div style="text-align:center;font-size:11px;color:var(--secondary-text-color)">' + w + "</div>"; });
          for (let i = 0; i < off; i++) out += "<div></div>";
          for (let dd = 1; dd <= nDays; dd++) { const dt = new Date(y, m, dd); const x = byDay[dd];
            const before = since && dt < since; const future = dt > today;
            out += x ? tile(String(dd), x, max, byDay[dd - 1], false) : tile(String(dd), ZERO, max, null, true, before ? tr("no data yet") : (future ? "" : tr("not charged"))); }
          out += "</div>";
        } else {
          const map = new Map();
          const src = P === "Weeks" ? days : months;
          src.forEach((x) => { let k, label;
            if (P === "Weeks") { const w = isoWeek(x.d); k = w.y * 100 + w.w; label = tr("Week") + " " + w.w + " · " + w.y; }
            else if (P === "Months") { k = x.d.getFullYear() * 100 + x.d.getMonth(); label = MONTHS[x.d.getMonth()] + " " + x.d.getFullYear(); }
            else if (P === "Quarters") { const q = Math.floor(x.d.getMonth() / 3) + 1; k = x.d.getFullYear() * 10 + q; label = "Q" + q + " " + x.d.getFullYear(); }
            else { k = x.d.getFullYear(); label = String(k); }
            if (!map.has(k)) map.set(k, { label, items: [] }); map.get(k).items.push(x); });
          const keys = [...map.keys()].sort((a, b) => b - a);
          const take = { Weeks: 12, Months: 12, Quarters: 4, Year: 5 }[P] || 12;
          const rows = keys.slice(0, take + 1).map((k) => ({ label: map.get(k).label, a: sum(map.get(k).items) }));
          const shown = rows.slice(0, take); const max = Math.max(...shown.map((r) => r.a.sun + r.a.grid), 1);
          out += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px">';
          shown.forEach((r, i) => { out += tile(r.label, r.a, max, rows[i + 1] ? rows[i + 1].a : null, false); });
          out += "</div>";
        }
        this._body.innerHTML = out;
        return;
      }
      let a = ZERO, scope = "";
      if (P === "Days") { a = sum(days.filter((x) => x.d.getFullYear() === today.getFullYear() && x.d.getMonth() === today.getMonth())); scope = tr("this month"); }
      else if (P === "Weeks") { const from = new Date(today); from.setDate(from.getDate() - 7 * 12 + 1); a = sum(days.filter((x) => x.d >= from)); scope = tr("last 12 weeks"); }
      else if (P === "Months") { const from = new Date(today.getFullYear(), today.getMonth() - 11, 1); a = sum(months.filter((x) => x.d >= from)); scope = tr("last 12 months"); }
      else if (P === "Quarters") { const from = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 - 9, 1); a = sum(months.filter((x) => x.d >= from)); scope = tr("last 4 quarters"); }
      else { a = sum(months.filter((x) => x.d.getFullYear() === today.getFullYear())); scope = tr("this year"); }
      const tot = a.sun + a.grid; const pct = tot > 0 ? Math.round(a.sun / tot * 100) : 0;
      const avg = tot > 0 ? (a.gridCost + a.sunValue) / tot * 100 : 0;
      const box = (label, value, colour) => '<div style="flex:1;min-width:110px"><div style="font-size:11px;color:var(--secondary-text-color)">' + label +
        '</div><div style="font-size:20px;font-weight:700;color:' + colour + '">' + value + "</div></div>";
      const how = allIn ? tr("price as given by the price source (all-in)") : ("(" + tr("Price").toLowerCase() + " + " + eur(mk) + " " + tr("mark-up") + ") × " + (1 + vat / 100).toFixed(3).replace(".", DEC) + " " + tr("VAT"));
      this._body.innerHTML = '<div style="font-size:12px;color:var(--secondary-text-color);margin-bottom:6px">' + tr("Totals") + " · " + scope +
        (since ? " · " + tr("counting since") + " " + since.toLocaleDateString(LANG === "de" ? "de-DE" : "nl-NL") : "") + "</div>" +
        '<div style="display:flex;flex-wrap:wrap;gap:12px">' +
        box(tr("Charged"), n1(tot) + " kWh", "var(--primary-text-color)") + box(tr("From sun"), n1(a.sun) + " kWh · " + pct + "%", "#22c55e") +
        box(tr("From grid"), n1(a.grid) + " kWh", "#94a3b8") + box(tr("Grid cost"), eur(a.gridCost), "var(--primary-text-color)") +
        box(tr("Solar value (feed-in)"), eur(a.sunValue), "#22c55e") + box(tr("Average"), avg.toFixed(1).replace(".", DEC) + " " + MIN + "/kWh", "var(--primary-text-color)") +
        "</div>" + bar(a, tot) +
        '<div style="font-size:11px;color:var(--secondary-text-color)">' + tr("Grid") + ": " + how + " · " + tr("sun") + ": " + eur(feed) + "/kWh" +
        (a.noPrice > 0 ? ' · <ha-icon icon="hesc:waarschuwing" style="--mdc-icon-size:14px;vertical-align:-2px;margin-right:4px"></ha-icon>' + n1(a.noPrice) +
          " " + tr("kWh from the grid without a known price (counted without energy price)") : "") + "</div>";
    }
  }

  // ---------------------------------------------------------------------------------------------
  // One option of a select as a button: green when chosen, tap = choose it
  class HescOptionButton extends HescBase {
    static getStubConfig() { return { entity: DEFAULTS.costs_period, option: "Days" }; }
    _watch() { return [this._config.entity]; }
    _render() {
      if (!this._card) {
        this._shell(".body{padding:8px 4px;text-align:center;font-size:13px;font-weight:600;line-height:normal;cursor:pointer;border-radius:10px}");
        this._card.style.borderRadius = "10px";
        this._card.addEventListener("click", () => this._hass.callService("select", "select_option", { entity_id: this._config.entity, option: this._config.option }));
      }
      const on = ((this._hass.states[this._config.entity] || {}).state) === this._config.option;
      this._card.style.background = on ? "#22c55e" : "var(--card-background-color)";
      this._body.style.color = on ? "#0b1220" : "var(--primary-text-color)";
      this._body.textContent = this._config.name || tr(this._config.option);
    }
    getCardSize() { return 1; }
  }

  // ---------------------------------------------------------------------------------------------
  // Since 3.1.2: "View report". The report is only served behind the login (/api/hesc/report), so the
  // card asks Home Assistant for a short-lived signed path and opens that in a new tab.
  class HescReportButton extends HescBase {
    static getStubConfig() { return { name: "View report" }; }
    _watch() { return []; }
    _render() {
      if (!this._card) {
        // looks like the tile it replaces: icon in a green circle, name next to it
        this._shell(".body{padding:10px 12px;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;line-height:normal;cursor:pointer;color:var(--primary-text-color)}" +
          ".ic{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(34,197,94,.2);color:#22c55e;flex:none}" +
          ".ic ha-icon{--mdc-icon-size:24px}");
        this._card.addEventListener("click", () => this._open());
      }
      // 3.1.3: the icon goes in as an attribute, never as markup (a quote in it can't break out)
      this._body.innerHTML = '<div class="ic"><ha-icon></ha-icon></div><span></span>';
      this._body.querySelector("ha-icon").setAttribute("icon", String(this._config.icon || "hesc:document"));
      this._body.querySelector("span").textContent = this._config.name || tr("View report");
    }
    async _open() {
      // open the tab right away (a tab opened after an await is often blocked), then point it at the report
      const tab = window.open("", "_blank");
      try {
        const r = await this._hass.callWS({ type: "auth/sign_path", path: "/api/hesc/report", expires: 60 });
        if (tab) tab.location.href = r.path; else window.location.href = r.path;
      } catch (e) {
        if (tab) tab.close();
      }
    }
    getCardSize() { return 1; }
    getGridOptions() { return { columns: 6, rows: "auto" }; }
  }

  // ---------------------------------------------------------------------------------------------
  // A card with extra CSS. `style` is CSS for the card itself, or {".": css, "<element>$": css} where
  // "<element>$" is the inside of that element (e.g. "ha-markdown$" for the text of a markdown card).
  class HescStyle extends HTMLElement {
    setConfig(config) {
      if (!config || !config.card) throw new Error("hesc-style needs a card");
      this._config = config;
      this._make();
    }
    async _make() {
      const helpers = await window.loadCardHelpers();
      const el = helpers.createCardElement(this._config.card);
      if (this._hass) el.hass = this._hass;
      this._el = el;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = "<style>:host{display:block;height:100%}</style>";
      this.shadowRoot.appendChild(el);
      el.style.height = "100%";
      this._apply();
      if (!this._mo) {
        this._mo = new MutationObserver(() => this._apply());
      }
      setTimeout(() => this._apply(), 50);
      setTimeout(() => this._apply(), 500);
    }
    set hass(hass) { this._hass = hass; if (this._el) { this._el.hass = hass; this._apply(); } }
    _inject(root, css, tag) {
      if (!root || !css) return;
      if (root.querySelector('style[data-hesc="' + tag + '"]')) return;
      const s = document.createElement("style");
      s.setAttribute("data-hesc", tag);
      s.textContent = css;
      root.appendChild(s);
      try { this._mo.observe(root, { childList: true }); } catch (e) { /* ignore */ }
    }
    _apply() {
      const el = this._el;
      if (!el || !el.shadowRoot) { if (el && !this._retry) { this._retry = true; requestAnimationFrame(() => { this._retry = false; this._apply(); }); } return; }
      const style = this._config.style;
      const parts = typeof style === "string" ? { ".": style } : (style || {});
      Object.keys(parts).forEach((k, i) => {
        if (k === ".") { this._inject(el.shadowRoot, parts[k], "r" + i); return; }
        const sel = k.replace(/\$$/, "").trim();
        const target = el.shadowRoot.querySelector(sel);
        if (target && target.shadowRoot) this._inject(target.shadowRoot, parts[k], "s" + i);
        else if (!this._retry) { this._retry = true; setTimeout(() => { this._retry = false; this._apply(); }, 200); }
      });
    }
    getCardSize() { return this._el && this._el.getCardSize ? this._el.getCardSize() : 1; }
    getGridOptions() { return this._el && this._el.getGridOptions ? this._el.getGridOptions() : undefined; }
  }

  // ---------------------------------------------------------------------------------------------
  // One-click dashboard: Settings → Dashboards → Add dashboard → "HESC" (HA 2026.5+), or in the raw
  // configuration editor of an empty dashboard (any version):
  //   strategy:
  //     type: custom:hesc
  // The dashboard is HESC's own (the same as in the sidebar), with HESC's entity ids filled in and the
  // page links pointing at this dashboard's own address.
  class HescDashboardStrategy extends HTMLElement {
    static async generate(config, hass) {
      const url = location.pathname.split("/")[1] || "";
      LANG = langOf(hass);
      const language = (config && config.language) || LANG;  // `language: nl` in the strategy config chooses one
      try {
        return await hass.callWS({ type: "hesc/dashboard", url_path: url, language });
      } catch (e) {
        return { title: "HESC", views: [{ title: "HESC", cards: [{ type: "markdown", content:
          "## " + tr("HESC is not ready") + "\n" + tr("This dashboard comes from the HESC integration. Install HESC (HACS → HESC v3), add it under " +
          "*Settings → Devices & services*, restart Home Assistant and open this page again.") + "\n\n<small>" + esc(e && e.message ? e.message : e) + "</small>" }] }] };
      }
    }
  }

  customElements.define("ll-strategy-dashboard-hesc", HescDashboardStrategy);
  window.customStrategies = window.customStrategies || [];
  window.customStrategies.push({ type: "hesc", strategyType: "dashboard", name: "HESC · Home EV Solar Control",
    description: "HESC's dashboard as your own copy: solar charging, charge plan, settings and costs.",
    documentationURL: "https://github.com/satscan1/hesc-home-ev-solar-control" });

  customElements.define("hesc-solar-chart", HescSolarChart);
  customElements.define("hesc-solar-forecast", HescSolarForecast);
  customElements.define("hesc-price-chart", HescPriceChart);
  customElements.define("hesc-expected-solar", HescExpectedSolar);
  customElements.define("hesc-costs", HescCosts);
  customElements.define("hesc-option-button", HescOptionButton);
  customElements.define("hesc-style", HescStyle);
  customElements.define("hesc-report-button", HescReportButton);

  // A dashboard opened while this file was still loading shows an (invisible) error card for each HESC
  // card; Home Assistant replaces it once the card exists, but that signal is lost when the error card
  // was not on the page yet at that moment. Ask those cards to rebuild a few times after loading.
  const rescue = (root) => {
    root.querySelectorAll("hui-error-card").forEach((el) => {
      let cfg = "";
      try { cfg = JSON.stringify(el._config || el.config || {}); } catch (e) { /* ignore */ }
      if (/\bhesc-[a-z-]+/.test(cfg)) el.dispatchEvent(new Event("ll-rebuild", { bubbles: true, composed: true }));
    });
    root.querySelectorAll("*").forEach((el) => { if (el.shadowRoot) rescue(el.shadowRoot); });
  };
  [300, 1000, 2500, 5000, 10000].forEach((ms) => setTimeout(() => rescue(document), ms));

  window.customCards = window.customCards || [];
  [
    ["hesc-solar-chart", "HESC · Solar forecast vs actual · EV", "The last 12 hours: solar forecast, solar power and EV charging."],
    ["hesc-solar-forecast", "HESC · Solar charging forecast", "Today and tomorrow per half hour, coloured by HESC's start and keep-charging thresholds."],
    ["hesc-price-chart", "HESC · Day-ahead prices", "Prices per quarter with the charge plan, the sun and cheap chances."],
    ["hesc-expected-solar", "HESC · Expected solar charging", "When the car can charge on sun today and tomorrow."],
    ["hesc-costs", "HESC · Charging costs", "Totals or tiles per day, week, month, quarter or year (view: totals or tiles)."],
    ["hesc-option-button", "HESC · Option button", "One option of a select as a button."],
    ["hesc-report-button", "HESC · View report", "Opens HESC's support report (behind the login)."],
  ].forEach(([type, name, description]) => window.customCards.push({ type, name, description, preview: false, documentationURL: "https://github.com/satscan1/hesc-home-ev-solar-control" }));
};
  // Home Assistant's frontend swaps the browser's custom element registry for its own while it starts
  // (scoped registries). Cards defined before that would be lost, so wait until the frontend is there.
  const ready = () => !!window.customElements.get("home-assistant");
  if (ready()) { boot(); return; }
  let tries = 0;
  const wait = setInterval(() => {
    if (ready() || ++tries > 400) { clearInterval(wait); boot(); }  // at most 20 s
  }, 50);
})();
