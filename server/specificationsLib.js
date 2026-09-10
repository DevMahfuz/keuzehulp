/**
 * Projector specification CSV parsers, matching and enrichment.
 * Server catalog uses the CommonJS twin in server/specifications.js.
 */

const SPEC_SOURCE = "specification_csv";

const THROW_CLASS_THRESHOLDS = {
  /** Max throw ratio still counted as UST (0.50:1 is short throw, not UST). */
  ustMax: 0.4,
  /** Max throw ratio still counted as short throw. */
  shortMax: 1.0,
};

const MARKETING_STRIP =
  /\b(4k|uhd|full\s*hd|fhd|hd|projector|beamer|lumen|ansi|iso|led|laser|lamp|smart|hdr|native|pro-uhd|cinema|wit|zwart|white|black|grey|gray|retourdeal|outlet|refurbished)\b/gi;

function blank(value) {
  const s = String(value ?? "").trim();
  if (!s || s === "-" || s === "–" || s === "⛔" || /^n\.?a\.?$/i.test(s) || s.toLowerCase() === "geen") return true;
  return false;
}

function parseCsv(text) {
  const rows = [];
  const errors = [];
  const src = String(text || "").replace(/^\uFEFF/, "");
  let i = 0;
  const len = src.length;
  const readRow = () => {
    const cells = [];
    let cell = "";
    let quoted = false;
    while (i < len) {
      const ch = src[i];
      if (quoted) {
        if (ch === '"') {
          if (src[i + 1] === '"') {
            cell += '"';
            i += 2;
            continue;
          }
          quoted = false;
          i += 1;
          continue;
        }
        cell += ch;
        i += 1;
        continue;
      }
      if (ch === '"') {
        quoted = true;
        i += 1;
        continue;
      }
      if (ch === ";") {
        cells.push(cell.trim());
        cell = "";
        i += 1;
        continue;
      }
      if (ch === "\n") {
        i += 1;
        cells.push(cell.trim());
        return cells;
      }
      if (ch === "\r") {
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
    }
    cells.push(cell.trim());
    return cells;
  };
  const header = readRow();
  if (!header.length || header[0] !== "Internal_ID") {
    errors.push("unexpected_header");
    return { header, rows, errors };
  }
  while (i < len) {
    const lineStart = i;
    const cells = readRow();
    if (cells.every((c) => !c)) continue;
    if (cells.length === 1 && !cells[0]) continue;
    const rec = {};
    header.forEach((key, idx) => {
      rec[key] = cells[idx] ?? "";
    });
    if (!rec.Internal_ID && !rec.Short_title) {
      errors.push({ line: lineStart, reason: "empty_row" });
      continue;
    }
    rows.push(rec);
  }
  return { header, rows, errors };
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function modelMatchKey(brand, title) {
  const raw = `${brand || ""} ${title || ""}`.toLowerCase();
  const stripped = raw.replace(MARKETING_STRIP, " ");
  return stripped
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(raw) {
  if (blank(raw)) return null;
  const n = Number(String(raw).replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseThrowRatio(raw) {
  if (blank(raw)) return { min: null, max: null };
  let t = String(raw)
    .replace(/^["']|["']$/g, "")
    .replace(/,/g, ".")
    .replace(/:1/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  const range = t.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  const single = t.match(/(\d+\.?\d*)/);
  if (single) {
    const n = Number(single[1]);
    return { min: n, max: n };
  }
  return { min: null, max: null };
}

function parseBrightness(raw) {
  if (blank(raw)) return { value: null, unit: null, ansi: null, led: null, generic: null };
  const t = String(raw).toLowerCase();
  const n = parseNumber(t);
  if (n == null) return { value: null, unit: null, ansi: null, led: null, generic: null };
  if (/ansi/.test(t)) return { value: n, unit: "ansi", ansi: n, led: null, generic: null };
  if (/\bled\b/.test(t)) return { value: n, unit: "led", ansi: null, led: n, generic: null };
  return { value: n, unit: "generic", ansi: null, led: null, generic: n };
}

function parseResolution(raw) {
  if (blank(raw)) {
    return { label: null, native4K: false, cinema4K: false, width: null, height: null, className: null };
  }
  const t = String(raw).replace(/\s+/g, " ").trim();
  const native = /native\s*4k/i.test(t);
  const size = t.match(/(\d{3,4})\s*[x×]\s*(\d{3,4})/i);
  const width = size ? Number(size[1]) : null;
  const height = size ? Number(size[2]) : null;
  const cinema4K = width === 4096 || /cinema\s*4k/i.test(t);
  let className = null;
  let label = t;
  if (width === 4096 || (native && /4k/i.test(t) && width === 3840)) {
    className = cinema4K ? "4K_CINEMA" : "4K_UHD";
    label = native ? (cinema4K ? "Native 4K" : "Native 4K UHD") : "4K UHD";
  } else if (width === 3840 || /4k|uhd|2160/i.test(t)) {
    className = "4K_UHD";
    label = native ? "Native 4K UHD" : "4K UHD";
  } else if ((width === 1920 && height === 1200) || /wuxga/i.test(t)) {
    className = "WUXGA";
    label = "WUXGA";
  } else if (width === 1920 || /full\s*hd|1080/i.test(t)) {
    className = "FHD";
    label = "Full HD";
  } else if (width === 1280 || /wxga/i.test(t)) {
    className = "WXGA";
    label = "WXGA";
  }
  return { label, native4K: native || cinema4K || width === 4096, cinema4K, width, height, className };
}

function parseInputLag(raw) {
  if (blank(raw)) return null;
  const n = Number(String(raw).toLowerCase().replace(",", ".").replace(/ms/g, "").trim());
  if (!Number.isFinite(n) || n <= 0 || n > 80) return null;
  return n;
}

function parseNoise(raw) {
  if (blank(raw)) return null;
  const m = String(raw).match(/(\d{2}(?:[.,]\d)?)\s*db/i);
  if (!m) return parseNumber(raw);
  return Number(m[1].replace(",", "."));
}

function parseInches(raw) {
  if (blank(raw)) return null;
  const m = String(raw).match(/(\d{2,3})/);
  return m ? Number(m[1]) : null;
}

function parseWeightKg(raw) {
  if (blank(raw)) return null;
  const n = parseNumber(String(raw).replace(/kg/i, ""));
  return n;
}

function parseTriState(raw) {
  if (blank(raw)) return { builtIn: false, optional: false, unknown: true };
  const t = String(raw).toLowerCase();
  if (t === "ja" || t === "yes" || t === "true") return { builtIn: true, optional: false, unknown: false };
  if (/dongle|stick|optioneel|middels/.test(t)) return { builtIn: false, optional: true, unknown: false };
  if (t === "nee" || t === "no" || t.includes("⛔")) return { builtIn: false, optional: false, unknown: false };
  return { builtIn: false, optional: false, unknown: true };
}

function parseConnectivity(raw) {
  const t = String(raw || "").toLowerCase();
  return {
    hdmiCount: (() => {
      const m = t.match(/(\d)\s*x\s*hdmi|hdmi[^\d]{0,6}x\s*(\d)/);
      if (m) return Number(m[1] || m[2]);
      return /hdmi/.test(t) ? 1 : null;
    })(),
    hdmi20: /hdmi\s*2\.0/.test(t),
    hdmi21: /hdmi\s*2\.1|48\s*gbps/.test(t),
    usbC: /usb[\s-]*c/.test(t),
    audioOut: /audio[^\n]{0,12}(out|uit)/.test(t) || /3,5\s*mm/.test(t),
    spdif: /s\/?pdif/.test(t),
    rs232: /rs[\s-]*232/.test(t),
    lan: /\blan\b|rj-?45|network/.test(t),
    hdbaset: /hdbaset/.test(t),
    trigger12v: /12\s*-?\s*v\s*trigger|trigger/.test(t),
  };
}

function parseSuitableFor(raw) {
  const t = String(raw || "").toLowerCase();
  return {
    homeCinema: /home cinema|thuisbioscoop/.test(t),
    premiumHomeCinema: /high end home cinema|premium/.test(t),
    gaming: /gamen|gaming/.test(t),
    business: /kantoor|presentatie|zakelijk/.test(t),
    education: /school|onderwijs/.test(t),
    portable: /onderweg|portable|draagbaar/.test(t),
    smart: /smart tv|smart/.test(t),
    largeVenue: /grote zalen?/.test(t),
    brightRoom: /lichte ruimte/.test(t),
    raw: String(raw || "").trim(),
  };
}

function plusMinHints(plus, min) {
  const p = String(plus || "").toLowerCase();
  const m = String(min || "").toLowerCase();
  return {
    shortThrow: /short throw/.test(p),
    ust: /dicht op de muur|ultra short/.test(p),
    homeCinemaQuality: /zwartwaarde|imax|contrast/.test(p),
    brightRoom: /overdag goed/.test(p),
    portable: /klein en compact|compact/.test(p),
    noNative4k: /geen native 4k/.test(m),
    poorDaylight: /overdag minder/.test(m),
    noSmart: /geen ingebouwde smart/.test(m),
    heavy: /zwaar/.test(m),
    externalAudio: /extern geluid/.test(m),
    plus: String(plus || "").trim(),
    min: String(min || "").trim(),
  };
}

function inferThrowClassFromRatio({ throwRatioMin, throwRatioMax, ust, shortThrow, title }) {
  const max = throwRatioMax ?? throwRatioMin;
  const min = throwRatioMin ?? throwRatioMax;
  const namedUst = /\bust\b|ultra\s*short/i.test(String(title || ""));
  if (max != null && max <= THROW_CLASS_THRESHOLDS.ustMax) return "ust";
  if (ust && (max == null || max <= THROW_CLASS_THRESHOLDS.ustMax)) return "ust";
  if (namedUst && max == null) return "ust";
  if (max != null && max <= THROW_CLASS_THRESHOLDS.shortMax) return "short";
  if (shortThrow) return "short";
  if (min != null && min <= THROW_CLASS_THRESHOLDS.shortMax && max != null && max <= 1.4) return "short";
  return "standard";
}

function parseSpecRow(raw) {
  const throwRatio = parseThrowRatio(raw.NL_Projectieverhouding_Throw_Ratio);
  const brightness = parseBrightness(raw.NL_Helderheid);
  const resolution = parseResolution(raw.NL_Resolutie);
  const suitable = parseSuitableFor(raw.NL_Geschikt_voor);
  const hints = plusMinHints(raw.NL_plus, raw.NL_min);
  const wifi = parseTriState(raw.NL_WIFI);
  const smart = parseTriState(raw.NL_Smart_functies);
  const connectivity = parseConnectivity(raw.NL_Connectiviteit);
  const title = raw.Short_title || "";
  const ustNamed = /\bust\b|ultra\s*short/i.test(title) || hints.ust;
  const throwClass = inferThrowClassFromRatio({
    throwRatioMin: throwRatio.min,
    throwRatioMax: throwRatio.max,
    ust: ustNamed,
    shortThrow: hints.shortThrow,
    title,
  });
  return {
    internalId: String(raw.Internal_ID || "").trim(),
    shortTitle: title,
    articleCode: String(raw.Article_code || "").trim(),
    ean: String(raw.EAN || "").trim(),
    sku: String(raw.SKU || "").trim(),
    suitable,
    resolution,
    brightness,
    contrast: blank(raw.NL_Contrast) ? "" : String(raw.NL_Contrast).trim(),
    throwRatioMin: throwRatio.min,
    throwRatioMax: throwRatio.max,
    technology: blank(raw.NL_Projectietechnologie) ? null : String(raw.NL_Projectietechnologie).trim(),
    lampHours: parseNumber(raw.NL_Branduren_gemiddeld),
    smartBuiltIn: smart.builtIn,
    wifiBuiltIn: wifi.builtIn,
    wifiOptional: wifi.optional,
    aspectRatio: blank(raw.NL_Beeldverhouding_Aspect_Ratio) ? null : String(raw.NL_Beeldverhouding_Aspect_Ratio).trim(),
    connectivity,
    inputLag: parseInputLag(raw.NL_Input_Lag),
    noiseLevel: parseNoise(raw.NL_Geluidsniveau),
    minScreenInches: parseInches(raw.NL_Minimale_Schermgrootte_Diagonaal),
    maxScreenInches: parseInches(raw.NL_Maximale_Schermgrootte_Diagonaal),
    weightKg: parseWeightKg(raw.NL_Gewicht),
    hints,
    throwClass,
    ust: throwClass === "ust",
    shortThrow: throwClass === "short",
    raw,
  };
}

function idSet(value) {
  return normalizeKey(value);
}

function matchSpecsToProducts(specRows, products) {
  const report = {
    csvRows: specRows.length,
    matched: 0,
    unmatched: [],
    ambiguous: [],
    byMethod: { internalId: 0, ean: 0, sku: 0, articleCode: 0, modelName: 0 },
  };
  const projectors = products.filter((p) => p.productKind === "projector");
  const byId = new Map();
  const byEan = new Map();
  const bySku = new Map();
  const byModel = new Map();
  for (const p of projectors) {
    byId.set(String(p.id), p);
    byId.set(String(p.productId || ""), p);
    const eans = [p.ean, p.sku, p.articleCode].map(idSet).filter(Boolean);
    for (const e of eans) {
      if (!byEan.has(e)) byEan.set(e, []);
      byEan.get(e).push(p);
    }
    const sku = idSet(p.sku);
    if (sku) {
      if (!bySku.has(sku)) bySku.set(sku, []);
      bySku.get(sku).push(p);
    }
    const model = modelMatchKey(p.brand, p.model || p.title);
    if (model) {
      if (!byModel.has(model)) byModel.set(model, []);
      byModel.get(model).push(p);
    }
  }

  const unique = (list) => [...new Map(list.map((p) => [p.id, p])).values()];

  const assignments = [];
  for (const spec of specRows) {
    let method = null;
    let hits = [];
    if (spec.internalId && byId.has(spec.internalId)) {
      hits = [byId.get(spec.internalId)];
      method = "internalId";
    }
    if (!hits.length && spec.ean) {
      hits = unique(byEan.get(idSet(spec.ean)) || []);
      if (hits.length === 1) method = "ean";
    }
    if (!hits.length && spec.sku) {
      hits = unique(bySku.get(idSet(spec.sku)) || byEan.get(idSet(spec.sku)) || []);
      if (hits.length === 1) method = "sku";
    }
    if (!hits.length && spec.articleCode) {
      hits = unique(byEan.get(idSet(spec.articleCode)) || bySku.get(idSet(spec.articleCode)) || []);
      if (hits.length === 1) method = "articleCode";
    }
    if (!hits.length) {
      const key = modelMatchKey("", spec.shortTitle);
      hits = unique(byModel.get(key) || []);
      if (hits.length === 1) method = "modelName";
      else if (hits.length > 1) {
        report.ambiguous.push({ title: spec.shortTitle, ids: hits.map((h) => h.id) });
        hits = [];
        method = null;
      }
    }
    if (hits.length === 1 && method) {
      report.matched += 1;
      report.byMethod[method] += 1;
      assignments.push({ product: hits[0], spec, method });
    } else if (!hits.length) {
      report.unmatched.push({ internalId: spec.internalId, title: spec.shortTitle });
    } else {
      report.ambiguous.push({ title: spec.shortTitle, ids: hits.map((h) => h.id) });
    }
  }
  return { assignments, report };
}

function preferNumeric(current, next, relTol = 0.12) {
  if (next == null) return { value: current, conflict: false };
  if (current == null) return { value: next, conflict: false };
  const conflict = Math.abs(current - next) / Math.max(current, next, 1) > relTol;
  return { value: next, conflict };
}

function applySpecToProduct(product, spec, method) {
  const conflicts = [];
  const fieldSources = { ...(product.fieldSources || {}) };
  const fieldConfidence = { ...(product.fieldConfidence || {}) };
  const next = { ...product };

  const setNum = (key, incoming, sourceKey) => {
    if (incoming == null) return;
    const prev = next[key];
    const { value, conflict } = preferNumeric(prev, incoming);
    if (conflict) conflicts.push(`${key}: live/parsed ${prev} vs csv ${incoming}`);
    next[key] = value;
    fieldSources[sourceKey || key] = SPEC_SOURCE;
    fieldConfidence[sourceKey || key] = "confirmed";
  };

  if (spec.brightness.ansi != null) setNum("brightnessAnsi", spec.brightness.ansi, "brightnessAnsi");
  else if (spec.brightness.generic != null && next.brightnessAnsi == null) {
    next.brightnessAnsi = spec.brightness.generic;
    fieldSources.brightnessAnsi = SPEC_SOURCE;
    fieldConfidence.brightnessAnsi = "inferred";
  } else if (spec.brightness.led != null && spec.brightness.ansi == null) {
    next.brightnessLed = spec.brightness.led;
    if (next.brightnessAnsi === spec.brightness.led) {
      next.brightnessAnsi = null;
      fieldConfidence.brightnessAnsi = "unknown";
    }
  }
  next.brightnessUnit = spec.brightness.unit || next.brightnessUnit;
  next.brightnessLed = spec.brightness.led;
  next.brightnessGeneric = spec.brightness.generic;

  if (spec.resolution.label) {
    if (next.resolution && next.resolution !== spec.resolution.label && /full hd/i.test(spec.resolution.label) && /4k/i.test(String(next.title))) {
      conflicts.push(`resolution: title 4K vs csv ${spec.resolution.label}`);
    }
    next.resolution = spec.resolution.label;
    next.nativeResolution = spec.resolution.native4K ? spec.resolution.label : next.nativeResolution;
    next.native4K = spec.resolution.native4K;
    next.cinema4K = spec.resolution.cinema4K;
    fieldSources.resolution = SPEC_SOURCE;
    fieldConfidence.resolution = "confirmed";
  }

  if (spec.throwRatioMin != null) {
    if (next.throwRatioMin != null && Math.abs(next.throwRatioMin - spec.throwRatioMin) > 0.15) {
      conflicts.push(`throwRatioMin: ${next.throwRatioMin} vs csv ${spec.throwRatioMin}`);
    }
    next.throwRatioMin = spec.throwRatioMin;
    next.throwRatioMax = spec.throwRatioMax;
    fieldSources.throwRatio = SPEC_SOURCE;
    fieldConfidence.throwRatio = "confirmed";
  }

  next.ust = spec.ust;
  next.shortThrow = spec.shortThrow;
  next.throwClass = spec.throwClass;
  fieldConfidence.ust = spec.throwRatioMax != null || spec.ust ? "confirmed" : fieldConfidence.ust;
  fieldSources.ust = SPEC_SOURCE;

  if (spec.inputLag != null) setNum("inputLag", spec.inputLag);
  if (spec.noiseLevel != null) setNum("noiseLevel", spec.noiseLevel);
  if (spec.technology) {
    next.technology = spec.technology;
    fieldSources.technology = SPEC_SOURCE;
    fieldConfidence.technology = "confirmed";
  }
  if (/laser/i.test(spec.technology || "") || /laser/i.test(spec.raw.NL_Helderheid || "")) {
    next.lightSource = next.lightSource || "Laser";
  }
  if (spec.aspectRatio) next.aspectRatio = spec.aspectRatio;
  next.minScreenInches = spec.minScreenInches;
  next.maxScreenInches = spec.maxScreenInches;
  next.weightKg = spec.weightKg;
  next.lampHours = spec.lampHours;
  next.smartBuiltIn = spec.smartBuiltIn;
  next.wifiBuiltIn = spec.wifiBuiltIn;
  next.wifiOptional = spec.wifiOptional;
  if (spec.smartBuiltIn) next.smart = true;
  else if (spec.smartBuiltIn === false && next.smart && fieldConfidence.smart !== "confirmed") {
    /* keep inferred smart from content unless csv says no */
  }
  if (spec.smartBuiltIn === false) {
    next.smart = false;
    fieldSources.smart = SPEC_SOURCE;
    fieldConfidence.smart = "confirmed";
  }
  next.hdmi21 = spec.connectivity.hdmi21;
  next.hdbaset = spec.connectivity.hdbaset;
  next.rs232 = spec.connectivity.rs232;
  next.specSuitableFor = spec.suitable.raw;
  next.specPlus = spec.hints.plus;
  next.specMin = spec.hints.min;
  next.specSignals = {
    homeCinema: spec.suitable.homeCinema || spec.suitable.premiumHomeCinema,
    premiumHomeCinema: spec.suitable.premiumHomeCinema,
    gaming: spec.suitable.gaming,
    business: spec.suitable.business,
    education: spec.suitable.education,
    portable: spec.suitable.portable,
    smart: spec.suitable.smart,
    largeVenue: spec.suitable.largeVenue,
    brightRoom: spec.suitable.brightRoom,
  };
  if (spec.suitable.homeCinema) next.homeCinema = true;
  if (spec.suitable.gaming) next.gaming = true;
  if (spec.suitable.business) next.office = true;
  if (spec.suitable.smart) next.livingRoom = true;
  next.specEnriched = true;
  next.specMatchMethod = method;
  next.fieldSources = fieldSources;
  next.fieldConfidence = fieldConfidence;
  next.specConflicts = conflicts;
  return next;
}

function coverageSnapshot(products) {
  const projectors = products.filter((p) => p.productKind === "projector");
  const count = (fn) => projectors.filter(fn).length;
  return {
    total: projectors.length,
    brightness: count((p) => p.brightnessAnsi != null),
    brightnessLedOnly: count((p) => p.brightnessAnsi == null && p.brightnessLed != null),
    resolution: count((p) => Boolean(p.resolution)),
    throwRatio: count((p) => p.throwRatioMin != null),
    ustOrShort: count((p) => p.ust || p.shortThrow || p.throwClass === "ust" || p.throwClass === "short"),
    inputLag: count((p) => p.inputLag != null),
    noise: count((p) => p.noiseLevel != null),
    technology: count((p) => Boolean(p.technology)),
    aspectRatio: count((p) => Boolean(p.aspectRatio)),
    connectivity: count((p) => p.hdmi21 || p.hdbaset || p.rs232),
    smart: count((p) => p.smart === true || p.smartBuiltIn === true || p.smartBuiltIn === false),
    screenSize: count((p) => p.minScreenInches != null || p.maxScreenInches != null),
    specEnriched: count((p) => p.specEnriched),
    reliableTech: count(
      (p) => p.brightnessAnsi != null && Boolean(p.resolution) && (p.throwRatioMin != null || p.ust)
    ),
  };
}

function enrichProductList(products, specRows) {
  const parsed = specRows.map(parseSpecRow);
  const { assignments, report } = matchSpecsToProducts(parsed, products);
  const byId = new Map(assignments.map((a) => [a.product.id, a]));
  const enriched = products.map((p) => {
    const hit = byId.get(p.id);
    if (!hit) return p;
    return applySpecToProduct(p, hit.spec, hit.method);
  });
  report.liveProjectors = products.filter((p) => p.productKind === "projector").length;
  report.liveEnriched = enriched.filter((p) => p.productKind === "projector" && p.specEnriched).length;
  report.liveWithoutSpec = report.liveProjectors - report.liveEnriched;
  report.liveWithoutSpecTitles = enriched
    .filter((p) => p.productKind === "projector" && !p.specEnriched)
    .map((p) => ({ id: p.id, title: p.title }));
  return { products: enriched, report, parsedCount: parsed.length };
}

module.exports = { SPEC_SOURCE, THROW_CLASS_THRESHOLDS, blank, parseCsv, normalizeKey, modelMatchKey, parseNumber, parseThrowRatio, parseBrightness, parseResolution, parseInputLag, parseNoise, parseInches, parseWeightKg, parseTriState, parseConnectivity, parseSuitableFor, plusMinHints, inferThrowClassFromRatio, parseSpecRow, matchSpecsToProducts, applySpecToProduct, coverageSnapshot, enrichProductList };
