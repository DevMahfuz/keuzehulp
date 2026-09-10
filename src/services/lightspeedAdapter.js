import { CATEGORIES, mergeRawSpecs } from "../engine/productModel";
import { hydrateProduct } from "../engine/hydrate";
import { collectSourceText } from "../engine/parseSpecs";
import { pickLightspeedImage, absoluteAssetUrl } from "../utils/mediaUrl";

function pickPrice(raw) {
  const variant = raw.variants?.[0];
  return (
    raw.price ??
    raw.price_incl ??
    raw.priceIncl ??
    variant?.priceIncl ??
    variant?.price_incl ??
    variant?.price ??
    null
  );
}

function pickOldPrice(raw) {
  return raw.oldPrice ?? raw.oldPriceIncl ?? raw.old_price_incl ?? raw.price_old ?? raw.old_price ?? null;
}

function stockOf(raw) {
  const variant = raw.variants?.[0];
  const level = variant?.stock?.level ?? variant?.stockLevel ?? raw.stock?.level ?? raw.stockLevel ?? raw.stock;
  if (typeof level === "number") return level;
  if (variant?.stock?.available === false) return 0;
  return raw.available === false ? 0 : 1;
}

function mapCategory(raw) {
  const c = String(raw.category || raw.type || raw.category_id || "").toLowerCase();
  if (["projector", "screen", "mount", "cable", "accessory"].includes(c)) return c;
  if (c.includes("screen") || c.includes("scherm") || c.includes("doek")) return CATEGORIES.SCREEN;
  if (c.includes("mount") || c.includes("beugel")) return CATEGORIES.MOUNT;
  if (c.includes("hdmi") || c.includes("kabel") || c.includes("cable")) return CATEGORIES.CABLE;
  if (c.includes("access")) return CATEGORIES.ACCESSORY;
  return CATEGORIES.PROJECTOR;
}

function specsFrom(raw) {
  const custom = raw.specs || raw.attributes || raw.custom || raw.data || {};
  const flattened = { ...mergeRawSpecs(raw), ...custom };
  if (Array.isArray(raw.filters)) {
    for (const f of raw.filters) {
      const key = f.name || f.title;
      const val = f.value ?? f.values?.[0];
      if (key && val != null) flattened[key] = val;
    }
  }
  return flattened;
}

function truthySpec(specs, keys) {
  for (const key of keys) {
    const v = specs[key];
    if (v === true || v === 1 || v === "1") return true;
    if (typeof v === "string" && /ja|yes|true|ust|short/i.test(v)) return true;
  }
  return false;
}

function numberSpec(specs, keys) {
  for (const key of keys) {
    const n = Number(String(specs[key] ?? "").replace(",", "."));
    if (Number.isFinite(n) && String(specs[key] ?? "") !== "") return n;
  }
  return null;
}

function isNormalized(raw) {
  return raw.dataSource === "lightspeed" || raw.dataSource === "api" || raw.normalized === true;
}

/**
 * Maps Lightspeed eCom C-Series products (or already-normalized objects) to the internal Product model.
 */
export function fromLightspeed(raw, { dataSource = "api" } = {}) {
  if (!raw || typeof raw !== "object") return null;
  if (isNormalized(raw) && raw.id) {
    return hydrateProduct({
      ...raw,
      imageUrl: absoluteAssetUrl(raw.imageUrl) || pickLightspeedImage(raw),
      productUrl: absoluteAssetUrl(raw.productUrl || raw.url),
      dataSource: raw.dataSource || dataSource,
      isMock: Boolean(raw.isMock),
      sourceText: raw.sourceText || collectSourceText(raw),
      shopCategories: raw.shopCategories || raw.categories || [],
    });
  }

  const specs = specsFrom(raw);
  const variant = raw.variants?.[0];
  return hydrateProduct({
    id: raw.id ?? raw.vid ?? variant?.id,
    productId: raw.productId ?? raw.id,
    variantId: variant?.id ?? raw.variantId ?? raw.variant_id ?? raw.vid ?? raw.id,
    sku: raw.sku ?? variant?.sku,
    category: mapCategory({ ...raw, ...specs }),
    brand: raw.brand?.title || raw.brand?.name || raw.brand || specs.brand || "",
    model: raw.model || specs.model || "",
    title: raw.fulltitle || raw.title || raw.name,
    price: pickPrice(raw),
    oldPrice: pickOldPrice(raw),
    resolution: specs.resolution || specs.Resolutie,
    nativeResolution: specs.nativeResolution,
    brightnessAnsi: numberSpec(specs, ["brightnessAnsi", "ansiLumen", "ANSI lumen", "lumens", "Lichtopbrengst"]),
    technology: specs.technology || specs.Technologie,
    lightSource: specs.lightSource || specs.Lichtbron,
    throwRatioMin: numberSpec(specs, ["throwRatioMin", "throw_min", "Throw min"]),
    throwRatioMax: numberSpec(specs, ["throwRatioMax", "throw_max", "Throw max"]),
    minThrowDistance: numberSpec(specs, ["minThrowDistance"]),
    maxThrowDistance: numberSpec(specs, ["maxThrowDistance"]),
    ust: truthySpec(specs, ["ust", "UST", "ultraShortThrow"]),
    shortThrow: truthySpec(specs, ["shortThrow", "short_throw"]),
    gaming: truthySpec(specs, ["gaming"]),
    inputLag: numberSpec(specs, ["inputLag", "Input lag"]),
    refreshRate: numberSpec(specs, ["refreshRate"]),
    smart: truthySpec(specs, ["smart"]),
    office: truthySpec(specs, ["office"]),
    homeCinema: truthySpec(specs, ["homeCinema", "home_cinema"]),
    livingRoom: truthySpec(specs, ["livingRoom"]),
    outdoor: truthySpec(specs, ["outdoor"]),
    hdr: truthySpec(specs, ["hdr", "HDR"]),
    noiseLevel: numberSpec(specs, ["noiseLevel", "noise"]),
    stock: stockOf(raw),
    available: stockOf(raw) > 0,
    rating: Number(raw.rating ?? specs.rating) || null,
    reviewCount: Number(raw.reviews ?? raw.reviewCount) || null,
    productUrl: absoluteAssetUrl(raw.url || raw.productUrl || raw.link || ""),
    imageUrl: pickLightspeedImage(raw),
    dataSource,
    isMock: false,
    sizeInches: numberSpec(specs, ["sizeInches", "size", "inch"]),
    widthMeters: numberSpec(specs, ["widthMeters", "width"]),
    aspectRatio: specs.aspectRatio || "16:9",
    screenType: specs.screenType,
    electric: truthySpec(specs, ["electric"]),
    manual: truthySpec(specs, ["manual"]),
    fixedFrame: truthySpec(specs, ["fixedFrame", "fixed"]),
    floorRising: truthySpec(specs, ["floorRising"]),
    mobile: truthySpec(specs, ["mobile"]),
    tensioned: truthySpec(specs, ["tensioned"]),
    alr: truthySpec(specs, ["alr"]),
    clr: truthySpec(specs, ["clr"]),
    ustCompatible: truthySpec(specs, ["ustCompatible", "clr"]),
    gain: numberSpec(specs, ["gain"]),
    mounting: specs.mounting,
    mountType: specs.mountType,
    cableLengthMeters: numberSpec(specs, ["cableLengthMeters"]),
    specs,
    shopCategories: raw.shopCategories || raw.categories || [],
    sourceText: collectSourceText({
      ...raw,
      fulltitle: raw.fulltitle,
      title: raw.title,
      description: raw.description,
      content: raw.content,
      data01: raw.data01,
      data02: raw.data02,
      data03: raw.data03,
    }),
  });
}

export function fromLightspeedList(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.products || payload?.data || payload?.items || [];
  return list.map((item) => fromLightspeed(item, { dataSource: payload?.source || "api" })).filter(Boolean);
}
