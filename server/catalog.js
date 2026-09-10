const {
  LIGHTSPEED_PAGE_LIMIT,
  LIGHTSPEED_PAGE_CONCURRENCY,
  isLightspeedConfigured,
  lightspeedConfigError,
  lightspeedFetch,
  asRecord,
  str,
  num,
  resourceId,
  parseStockLevel,
  listFrom,
} = require("./lightspeedClient");
const { pickLightspeedImage, absoluteProductUrl } = require("./mediaUrl");
const { stripHtml, classifyFromText, parseSpecs, collectSourceText } = require("./productIntel");
const { enrichLiveCatalog } = require("./specifications");
const path = require("path");

const CACHE_MS = 10 * 60 * 1000;
let cache = { at: 0, payload: null };

const KNOWN_BRANDS = [
  "Elite Screens",
  "ViewSonic",
  "HiViLux",
  "iVisions",
  "Valerion",
  "Hisense",
  "Optoma",
  "Epson",
  "XGIMI",
  "Lunaro",
  "Panasonic",
  "Sony",
  "JVC",
  "BenQ",
  "Acer",
  "Formovie",
  "AWOL",
  "JMGO",
  "Samsung",
  "LG",
  "NothingProjector",
  "Projecta",
  "Celexon",
  "EluneVision",
  "Vividstorm",
];

function brandFromTitle(title) {
  const lower = (title || "").toLowerCase();
  const found = [...KNOWN_BRANDS].sort((a, b) => b.length - a.length).find((b) => lower.includes(b.toLowerCase()));
  return found || "";
}

function modelFromTitle(title, brand) {
  if (!title) return "";
  if (!brand) return title;
  const re = new RegExp(`^${brand}\\s+`, "i");
  return title.replace(re, "").trim() || title;
}

function inferSpecs(title, content, categoryTitle) {
  return parseSpecs(`${title} ${stripHtml(content)} ${categoryTitle}`).values;
}

function categoryTitleOf(raw) {
  return (
    str(asRecord(raw.category).title) ||
    str(raw.category) ||
    str(asRecord((raw.categories || [])[0]).title) ||
    ""
  );
}

function mapProduct(raw, brandMap = new Map(), shopCategories = []) {
  const variantRaw = raw.variants ?? raw.variant;
  const variant = asRecord(Array.isArray(variantRaw) ? variantRaw[0] : variantRaw || raw);
  const title = str(raw.fulltitle) || str(raw.title) || str(variant.title) || "Product";
  const brandId = resourceId(raw.brand);
  const brand =
    (brandId && brandMap.get(String(brandId))) ||
    str(asRecord(raw.brand).title) ||
    str(asRecord(variant.brand).title) ||
    brandFromTitle(title);
  const catTitle = categoryTitleOf(raw);
  const content = str(raw.content) || str(raw.description) || "";
  const data01 = str(raw.data01);
  const data02 = str(raw.data02);
  const data03 = str(raw.data03);
  const sourceText = collectSourceText({
    title,
    brand,
    categoryTitle: catTitle,
    content,
    data01,
    data02,
    data03,
  });
  const parsed = parseSpecs(sourceText);
  const inferred = parsed.values;
  const classified = classifyFromText({ title, brand, categoryTitle: catTitle, content, data01, data02, data03 });
  const category = classified.category;
  const stock = parseStockLevel(variant.stockLevel, variant.stock, raw.stockLevel, raw.stock);
  const visible = raw.isVisible !== false && raw.visibility !== "hidden";
  const imageUrl = pickLightspeedImage(raw) || pickLightspeedImage(variant);
  const productUrl = absoluteProductUrl(str(raw.url) || "");
  const price = num(variant.priceIncl) ?? num(raw.priceIncl) ?? num(raw.price);
  const oldPrice = num(variant.oldPriceIncl) ?? num(raw.oldPriceIncl) ?? num(raw.priceOld) ?? num(raw.oldPrice);
  const productId = String(raw.id ?? resourceId(raw.id) ?? "");
  const variantId = str(variant.id) || resourceId(variant.id) || productId;
  const isScreen = category === "screen";

  return {
    id: productId,
    productId,
    variantId: String(variantId),
    sku: str(variant.sku) || str(raw.sku),
    ean: str(variant.ean) || str(raw.ean) || str(variant.sku) || str(raw.sku),
    category,
    productKind: classified.productKind || (category === "projector" ? "projector" : category === "screen" ? "projection_screen" : "other"),
    classification: classified,
    brand,
    model: modelFromTitle(title, brand),
    title,
    price,
    oldPrice,
    resolution: inferred.resolution,
    nativeResolution: inferred.resolution,
    brightnessAnsi: inferred.brightnessAnsi,
    technology: inferred.technology || null,
    lightSource: inferred.lightSource,
    throwRatioMin: inferred.throwRatioMin,
    throwRatioMax: inferred.throwRatioMax,
    ust: inferred.ust,
    shortThrow: inferred.shortThrow,
    gaming: inferred.gaming,
    inputLag: inferred.inputLag,
    refreshRate: inferred.refreshRate || null,
    smart: inferred.smart,
    office: inferred.office,
    homeCinema: inferred.homeCinema,
    livingRoom: inferred.livingRoom,
    outdoor: inferred.outdoor,
    hdr: inferred.hdr || false,
    noiseLevel: inferred.noiseLevel,
    stock,
    isVisible: visible,
    sellable: visible,
    available: visible && (stock == null || stock > 0),
    productUrl,
    imageUrl,
    dataSource: "lightspeed",
    isMock: false,
    sizeInches: isScreen ? inferred.sizeInches : null,
    aspectRatio: inferred.aspectRatio || "16:9",
    electric: inferred.electric,
    manual: inferred.manual,
    fixedFrame: inferred.fixedFrame,
    floorRising: inferred.floorRising,
    mobile: inferred.mobile,
    tensioned: inferred.tensioned,
    alr: inferred.alr,
    clr: inferred.clr,
    ustCompatible: isScreen ? Boolean(inferred.ustCompatible || inferred.clr) : false,
    gain: inferred.gain,
    mountType: category === "mount" ? (/\bust\b/.test(`${title}`.toLowerCase()) ? "ust-cabinet" : "ceiling") : null,
    sourceText,
    fieldConfidence: parsed.confidence,
    dataQuality: parsed.dataQuality,
    normalized: true,
    shopCategories,
  };
}

async function paginateResource(path, keys) {
  const firstJson = await lightspeedFetch(path, 1);
  const firstList = listFrom(firstJson, keys);
  const items = [...firstList];
  if (firstList.length < LIGHTSPEED_PAGE_LIMIT) return items;

  let page = 2;
  while (page <= 80) {
    const batchPages = Array.from({ length: LIGHTSPEED_PAGE_CONCURRENCY }, (_, i) => page + i).filter((p) => p <= 80);
    const pages = await Promise.all(
      batchPages.map(async (p) => {
        const json = await lightspeedFetch(path, p);
        const list = listFrom(json, keys);
        return { rawCount: list.length, items: list };
      })
    );
    let stop = false;
    for (const item of pages) {
      items.push(...item.items);
      if (item.rawCount === 0 || item.rawCount < LIGHTSPEED_PAGE_LIMIT) {
        stop = true;
        break;
      }
    }
    if (stop) break;
    page += LIGHTSPEED_PAGE_CONCURRENCY;
  }
  return items;
}

function applyVariant(product, variant) {
  if (!variant) return product;
  const price = num(variant.priceIncl) ?? num(variant.price);
  const oldPrice = num(variant.oldPriceIncl);
  const stock = parseStockLevel(variant.stockLevel, variant.stock);
  const imageUrl = product.imageUrl || pickLightspeedImage(variant);
  return {
    ...product,
    variantId: String(variant.id || product.variantId),
    sku: str(variant.sku) || product.sku,
    price,
    oldPrice: oldPrice && price && oldPrice > price ? oldPrice : null,
    stock,
    available: product.sellable !== false && product.isVisible !== false && (stock == null || stock > 0),
    imageUrl,
  };
}

function indexDefaultVariants(rawVariants) {
  const byProduct = new Map();
  for (const raw of rawVariants) {
    const productId = resourceId(raw.product);
    if (!productId) continue;
    const current = byProduct.get(productId) || [];
    current.push(raw);
    byProduct.set(productId, current);
  }
  const chosen = new Map();
  for (const [id, list] of byProduct) {
    list.sort((a, b) => {
      const defaultDiff = Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault));
      if (defaultDiff) return defaultDiff;
      const stockDiff = (parseStockLevel(b.stockLevel, b.stock) || 0) - (parseStockLevel(a.stockLevel, a.stock) || 0);
      if (stockDiff) return stockDiff;
      return (num(a.priceIncl) || 999999) - (num(b.priceIncl) || 999999);
    });
    chosen.set(id, list[0]);
  }
  return chosen;
}

async function fetchShopCategoriesByProduct() {
  const cats = await paginateResource("categories", ["categories", "category"]);
  const titles = new Map();
  const parents = new Map();
  for (const cat of cats) {
    const id = String(cat.id ?? resourceId(cat.id) ?? "");
    if (!id) continue;
    titles.set(id, str(cat.title) || "");
    parents.set(id, resourceId(cat.parent));
  }
  const GENERIC_CATEGORY = /^(beamers?|merken|categorie|specificaties|populair|projectieschermen|formaat scherm|accessoires|keuzehulp|4k|hd|led|laser|3d)$/i;
  const SCREEN_TYPE_CATEGORY = /elektrische|handmatige|fixed frame|statief|floor up|mobiele scherm|vloerscherm/;
  const lineage = (id) => {
    const out = [];
    let cur = id;
    const seen = new Set();
    let depth = 0;
    while (cur && !seen.has(String(cur))) {
      seen.add(String(cur));
      const title = titles.get(String(cur));
      if (title) {
        const n = title.toLowerCase();
        const keep = depth === 0 || (!GENERIC_CATEGORY.test(n) && !SCREEN_TYPE_CATEGORY.test(n));
        if (keep) out.push(title);
      }
      cur = parents.get(String(cur));
      depth += 1;
    }
    return out;
  };
  const links = await paginateResource("categories/products", ["categoriesProducts", "categoryProducts"]);
  const byProduct = new Map();
  for (const link of links) {
    const productId = resourceId(link.product);
    const categoryId = resourceId(link.category);
    if (!productId || !categoryId) continue;
    const current = byProduct.get(productId) || [];
    for (const name of lineage(categoryId)) {
      if (!current.includes(name)) current.push(name);
    }
    byProduct.set(productId, current);
  }
  return byProduct;
}

async function fetchAllProducts() {
  const [rawProducts, rawVariants, rawBrands, catByProduct] = await Promise.all([
    paginateResource("products", ["products", "product"]),
    paginateResource("variants", ["variants", "variant"]),
    paginateResource("brands", ["brands", "brand"]).catch(() => []),
    fetchShopCategoriesByProduct().catch(() => new Map()),
  ]);
  const brandMap = new Map();
  for (const brand of rawBrands) {
    const id = resourceId(brand.id) || str(brand.id);
    const title = str(brand.title) || str(brand.name);
    if (id && title) brandMap.set(String(id), title);
  }
  const variantsByProduct = indexDefaultVariants(rawVariants);
  const variantCounts = new Map();
  for (const raw of rawVariants) {
    const productId = resourceId(raw.product);
    if (!productId) continue;
    variantCounts.set(productId, (variantCounts.get(productId) || 0) + 1);
  }
  const mapped = rawProducts
    .map((raw) => mapProduct(raw, brandMap, catByProduct.get(String(raw.id)) || catByProduct.get(resourceId(raw.id)) || []))
    .filter((p) => p.id);
  return mapped.filter((p) => p.sellable !== false).map((p) => {
    const merged = applyVariant(p, variantsByProduct.get(p.productId));
    return { ...merged, variantCount: variantCounts.get(p.productId) || 1 };
  });
}

function dedupeProducts(products) {
  const map = new Map();
  for (const product of products) {
    if (!map.has(product.productId)) map.set(product.productId, product);
  }
  return [...map.values()];
}

async function getCatalogPayload() {
  if (!isLightspeedConfigured()) {
    const err = lightspeedConfigError();
    const error = new Error(err || "Lightspeed is niet geconfigureerd");
    error.status = 503;
    throw error;
  }
  if (cache.payload && Date.now() - cache.at < CACHE_MS) {
    const ageMs = Date.now() - cache.at;
    return {
      ...cache.payload,
      meta: {
        ...cache.payload.meta,
        cache: { hit: true, ttlMs: CACHE_MS, ageMs, stockMaxAgeMinutes: CACHE_MS / 60000 },
        timing: { ...(cache.payload.meta?.timing || {}), servedFromCache: true },
      },
    };
  }
  const t0 = Date.now();
  const products = dedupeProducts(await fetchAllProducts());
  const fetchMs = Date.now() - t0;
  const t1 = Date.now();
  const enriched = enrichLiveCatalog(products);
  const enrichMs = Date.now() - t1;
  const liveProducts = enriched.products;
  const counts = { projector: 0, screen: 0, accessory: 0, unknown: 0, kinds: {} };
  const missing = { brightnessAnsi: 0, throwRatio: 0, resolution: 0, ust: 0, image: 0 };
  let projectorReliable = 0;
  let projectorSparse = 0;
  let enrichedProjector = 0;
  for (const product of liveProducts) {
    const kind = product.productKind || "other";
    counts.kinds[kind] = (counts.kinds[kind] || 0) + 1;
    if (kind === "projector") counts.projector += 1;
    else if (product.category === "screen" || kind === "projection_screen") counts.screen += 1;
    else if (kind === "other" && product.category === "unknown") counts.unknown += 1;
    else counts.accessory += 1;
    if (kind === "projector") {
      if (product.specEnriched) enrichedProjector += 1;
      const conf = product.fieldConfidence || {};
      if (!product.brightnessAnsi) missing.brightnessAnsi += 1;
      if (conf.throwRatio === "unknown" || (!product.throwRatioMin && !product.ust)) missing.throwRatio += 1;
      if (!product.resolution) missing.resolution += 1;
      if (conf.ust === "unknown") missing.ust += 1;
      const reliable = Boolean(product.brightnessAnsi && (product.throwRatioMin || product.ust) && product.resolution);
      if (reliable) projectorReliable += 1;
      else projectorSparse += 1;
    }
    if (!product.imageUrl) missing.image += 1;
  }
  const payload = {
    source: "lightspeed",
    fetchedAt: new Date().toISOString(),
    products: liveProducts,
    meta: {
      counts,
      missing,
      liveProjector: counts.projector,
      enrichedProjector,
      projectorReliable,
      projectorSparse,
      total: liveProducts.length,
      cache: { hit: false, ttlMs: CACHE_MS, ageMs: 0, stockMaxAgeMinutes: CACHE_MS / 60000 },
      timing: { fetchMs, enrichMs, totalMs: Date.now() - t0, servedFromCache: false },
      specifications: {
        file: path.relative(path.join(__dirname, ".."), enriched.matchReport.file).replace(/\\/g, "/"),
        csvRows: enriched.matchReport.csvRowsRead || enriched.matchReport.csvRows,
        parseErrors: enriched.matchReport.parseErrors,
        match: {
          matched: enriched.matchReport.matched,
          unmatched: (enriched.matchReport.unmatched || []).length,
          ambiguous: (enriched.matchReport.ambiguous || []).length,
          byMethod: enriched.matchReport.byMethod,
          liveProjectors: enriched.matchReport.liveProjectors,
          liveEnriched: enriched.matchReport.liveEnriched,
          liveWithoutSpec: enriched.matchReport.liveWithoutSpec,
        },
        unmatchedTitles: (enriched.matchReport.unmatched || []).slice(0, 40),
        liveWithoutSpecTitles: (enriched.matchReport.liveWithoutSpecTitles || []).slice(0, 80),
        coverageBefore: enriched.before,
        coverageAfter: enriched.after,
      },
    },
  };
  cache = { at: Date.now(), payload };
  return payload;
}

async function handleCatalogRequest(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  try {
    const payload = await getCatalogPayload();
    res.statusCode = 200;
    res.end(JSON.stringify(payload));
  } catch (error) {
    res.statusCode = error.status || 502;
    res.end(
      JSON.stringify({
        source: "error",
        error: "catalog_unavailable",
        message: "Het assortiment is nu niet bereikbaar. Probeer het zo opnieuw.",
        products: [],
      })
    );
  }
}

module.exports = { handleCatalogRequest, getCatalogPayload, mapProduct, inferSpecs };
