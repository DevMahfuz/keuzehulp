import { inferThrowClass } from "../utils/screenGeometry";

export const CATEGORIES = {
  PROJECTOR: "projector",
  SCREEN: "screen",
  MOUNT: "mount",
  CABLE: "cable",
  ACCESSORY: "accessory",
};

function num(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function bool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["1", "true", "yes", "ja"].includes(value.toLowerCase());
  return Boolean(value);
}

function first(...values) {
  return values.find((v) => v != null && v !== "") ?? null;
}

function defaultProductKind(category) {
  if (category === CATEGORIES.SCREEN) return "projection_screen";
  if (category === CATEGORIES.CABLE) return "cable";
  if (category === CATEGORIES.MOUNT) return "mount";
  if (category === CATEGORIES.ACCESSORY) return "accessory";
  if (category === CATEGORIES.PROJECTOR) return "projector";
  return "other";
}

/**
 * Canonical internal product. UI and scoring never read Lightspeed JSON directly.
 */
export function createProduct(partial = {}) {
  const throwRatioMin = num(partial.throwRatioMin);
  const throwRatioMax = num(partial.throwRatioMax);
  const ust = bool(partial.ust);
  const shortThrow = bool(partial.shortThrow);

  return {
    id: String(partial.id ?? ""),
    variantId: partial.variantId != null ? String(partial.variantId) : String(partial.id ?? ""),
    productId: partial.productId != null ? String(partial.productId) : String(partial.id ?? ""),
    sku: partial.sku ?? null,
    ean: partial.ean ?? null,
    articleCode: partial.articleCode ?? null,
    category: partial.category ?? CATEGORIES.PROJECTOR,
    productKind: partial.productKind ?? defaultProductKind(partial.category ?? CATEGORIES.PROJECTOR),
    brand: partial.brand ?? "",
    model: partial.model ?? partial.title ?? "",
    title: partial.title ?? [partial.brand, partial.model].filter(Boolean).join(" "),
    price: num(partial.price),
    oldPrice: num(partial.oldPrice),
    currency: partial.currency ?? "EUR",
    resolution: partial.resolution ?? null,
    nativeResolution: partial.nativeResolution ?? partial.resolution ?? null,
    brightnessAnsi: num(partial.brightnessAnsi),
    technology: partial.technology ?? null,
    lightSource: partial.lightSource ?? null,
    throwRatioMin,
    throwRatioMax,
    minThrowDistance: num(partial.minThrowDistance),
    maxThrowDistance: num(partial.maxThrowDistance),
    ust,
    shortThrow,
    throwClass: partial.throwClass || inferThrowClass({ throwRatioMin, throwRatioMax, ust, shortThrow }),
    gaming: bool(partial.gaming),
    inputLag: num(partial.inputLag),
    refreshRate: num(partial.refreshRate),
    smart: bool(partial.smart),
    office: bool(partial.office),
    homeCinema: bool(partial.homeCinema),
    livingRoom: bool(partial.livingRoom),
    outdoor: bool(partial.outdoor),
    hdr: bool(partial.hdr),
    noiseLevel: num(partial.noiseLevel),
    stock: num(partial.stock),
    isVisible: partial.isVisible == null ? true : bool(partial.isVisible),
    sellable: partial.sellable == null ? (partial.isVisible == null ? true : bool(partial.isVisible)) : bool(partial.sellable),
    available: partial.available == null ? num(partial.stock) == null || num(partial.stock) > 0 : bool(partial.available),
    rating: num(partial.rating),
    reviewCount: num(partial.reviewCount),
    productUrl: partial.productUrl ?? "",
    imageUrl: partial.imageUrl ?? "",
    dataSource: partial.dataSource ?? "unknown",
    isMock: bool(partial.isMock),
    // screens
    sizeInches: num(partial.sizeInches),
    widthMeters: num(partial.widthMeters),
    aspectRatio: partial.aspectRatio ?? "16:9",
    screenType: partial.screenType ?? null,
    electric: bool(partial.electric),
    manual: bool(partial.manual),
    fixedFrame: bool(partial.fixedFrame),
    floorRising: bool(partial.floorRising),
    mobile: bool(partial.mobile),
    tensioned: bool(partial.tensioned),
    alr: bool(partial.alr),
    clr: bool(partial.clr),
    ustCompatible: bool(partial.ustCompatible, bool(partial.clr)),
    gain: num(partial.gain),
    mounting: partial.mounting ?? null,
    // mounts / cables
    mountType: partial.mountType ?? null,
    cableLengthMeters: num(partial.cableLengthMeters),
    specs: partial.specs ?? {},
    sourceText: partial.sourceText ?? "",
    fieldConfidence: partial.fieldConfidence ?? {},
    dataQuality: partial.dataQuality ?? "partial",
    classification: partial.classification ?? null,
    variantCount: num(partial.variantCount),
    shopCategories: Array.isArray(partial.shopCategories) ? partial.shopCategories : [],
    categorySignals: partial.categorySignals ?? {},
    categorySources: partial.categorySources ?? {},
    segments: Array.isArray(partial.segments) ? partial.segments : [],
    segmentConfidence: partial.segmentConfidence ?? "unknown",
    segmentConflicts: partial.segmentConflicts ?? [],
    provenance: partial.provenance ?? null,
    native4K: bool(partial.native4K),
    cinema4K: bool(partial.cinema4K),
    brightnessUnit: partial.brightnessUnit ?? null,
    brightnessLed: num(partial.brightnessLed),
    brightnessGeneric: num(partial.brightnessGeneric),
    minScreenInches: num(partial.minScreenInches),
    maxScreenInches: num(partial.maxScreenInches),
    weightKg: num(partial.weightKg),
    lampHours: num(partial.lampHours),
    smartBuiltIn: partial.smartBuiltIn == null ? null : bool(partial.smartBuiltIn),
    wifiBuiltIn: partial.wifiBuiltIn == null ? null : bool(partial.wifiBuiltIn),
    wifiOptional: bool(partial.wifiOptional),
    hdmi21: bool(partial.hdmi21),
    hdbaset: bool(partial.hdbaset),
    rs232: bool(partial.rs232),
    specSignals: partial.specSignals ?? {},
    specSuitableFor: partial.specSuitableFor ?? "",
    specPlus: partial.specPlus ?? "",
    specMin: partial.specMin ?? "",
    specEnriched: bool(partial.specEnriched),
    specMatchMethod: partial.specMatchMethod ?? null,
    specConflicts: partial.specConflicts ?? [],
    fieldSources: partial.fieldSources ?? {},
  };
}

export function mergeRawSpecs(raw = {}) {
  return {
    brightnessAnsi: first(raw.brightnessAnsi, raw.ansiLumen, raw.lumens, raw.brightness),
    throwRatioMin: first(raw.throwRatioMin, raw.throw_min),
    throwRatioMax: first(raw.throwRatioMax, raw.throw_max),
    resolution: first(raw.resolution, raw.nativeResolution),
    lightSource: first(raw.lightSource, raw.lamp),
    inputLag: first(raw.inputLag, raw.lag),
  };
}
