import { CATEGORIES } from "./productModel";

export const PRODUCT_KINDS = {
  PROJECTOR: "projector",
  PROJECTION_SCREEN: "projection_screen",
  PROJECTOR_LENS: "projector_lens",
  MOUNT: "mount",
  FURNITURE: "furniture",
  CABLE: "cable",
  ACCESSORY: "accessory",
  BUNDLE: "bundle",
  SERVICE: "service",
  OTHER: "other",
};

const LENS_STRONG = [
  /\bprojector\s*lens\b/,
  /\bthrow\s*lens\b/,
  /\blens\b/,
  /\belpl[a-z]?\d/i,
  /\bbx-cta\d/i,
  /elpll\d/i,
  /elplx\d/i,
  /elplu\d/i,
];

const FURNITURE_STRONG = [
  /schuiflade/,
  /\blade\b/,
  /\bslide\b/,
  /ust[-\s]?meubel/,
  /trolley/,
  /projector\s*lift/,
  /beamer\s*lift/,
  /\bstatief\b/,
  /projectortrolley/,
];

const MOUNT_STRONG = [
  /plafondbeugel/,
  /muurbeugel/,
  /\bbeugel\b/,
  /\bmount\b/,
  /plafondplaat/,
  /montagearm/,
  /truss\s*beugel/,
  /projectorsteun/,
];

const CABLE_STRONG = [/\bhdmi\b/, /\bkabel(s)?\b/, /\bcable(s)?\b/];

const BUNDLE_STRONG = [
  /\bpakket\b/,
  /bioscoop\s*pakket/,
  /complete\s*set/,
  /incl\.?\s*(bioscoop|doek|scherm)/,
  /\bverhuur\b/,
];

const SERVICE_STRONG = [/\bverhuur\b/, /\brental\b/, /showroom\s*model/, /huurbeamer/, /\bte huur\b/, /^huur\b/];

const ACCESSORY_STRONG = [
  /afstandsbediening/,
  /3d[-\s]?bril/,
  /beamerlamp|vervangingslamp/,
  /luchtfilter|stoffilter/,
  /mediaspeler|android box/,
  /draagtas|carry\s*bag|\btas\b|\bcase\b/,
  /gimbal/,
  /projectieverf|\bverf\b|\bpaint\b|mighty\s*brighty/,
  /edge\s*blending/,
  /buiten\s*behuizing/,
  /\bcamera\b/,
];

const SCREEN_STRONG = [
  /projectiescherm/,
  /projection\s*screens?/,
  /\bdoek\b/,
  /fixed\s*frame/,
  /vast\s*frame/,
  /floor\s*rising|vloerscherm/,
  /clr[-\s]?(doek|screen|scherm)/,
  /alr[-\s]?(doek|screen|scherm)/,
  /tensioned/,
  /statiefscherm/,
  /projectiedoek/,
];

const PROJECTOR_STRONG = [
  /\bbeamer\b/,
  /\bprojector\b/,
  /laser\s*tv/,
  /cinebeam/,
  /ansi[-\s]?lumen/,
  /\b\d{3,5}\s*(?:ansi|iso|led)?[\s-]*lumen\b/,
  /throw\s*ratio/,
  /ultra\s*short\s*throw/,
];

const SCREEN_BRANDS = [
  "elite screens",
  "celexon",
  "projecta",
  "elunevision",
  "vividstorm",
  "nothingprojector",
];
const PROJECTOR_BRANDS = [
  "optoma",
  "epson",
  "benq",
  "xgimi",
  "hisense",
  "formovie",
  "awol",
  "jmgo",
  "sony",
  "jvc",
  "panasonic",
  "viewsonic",
  "valerion",
  "dangbei",
  "samsung",
];

function blob(product) {
  return [
    product.title,
    product.model,
    product.brand,
    product.categoryTitle,
    product.sourceText,
    product.description,
    product.data01,
    product.data02,
    product.data03,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hits(text, patterns) {
  return patterns.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
}

export function categoryFromKind(kind) {
  if (kind === PRODUCT_KINDS.PROJECTOR) return CATEGORIES.PROJECTOR;
  if (kind === PRODUCT_KINDS.PROJECTION_SCREEN) return CATEGORIES.SCREEN;
  if (kind === PRODUCT_KINDS.CABLE) return CATEGORIES.CABLE;
  if (kind === PRODUCT_KINDS.MOUNT || kind === PRODUCT_KINDS.FURNITURE || kind === PRODUCT_KINDS.PROJECTOR_LENS) {
    return CATEGORIES.MOUNT;
  }
  if (
    kind === PRODUCT_KINDS.ACCESSORY ||
    kind === PRODUCT_KINDS.BUNDLE ||
    kind === PRODUCT_KINDS.SERVICE
  ) {
    return CATEGORIES.ACCESSORY;
  }
  return "unknown";
}

function hasProjectorEvidence(product, title, text) {
  if (product.specEnriched) return true;
  const lumen = /\b\d{3,5}\s*(?:ansi|iso|led)?[\s-]*lumen\b/.test(`${title} ${text}`);
  const named = /\bbeamer\b|\bprojector\b|laser\s*tv|cinebeam/.test(title);
  const modelCode = /\b(eh-|eb-|vpl-|dla-|uhd\d|ls\d{3,4}|tw\d{4}|xw\d{4}|lu\d{3}|px\d|c2\s|np5|w51)\b/i.test(
    `${title} ${product.model || ""}`
  );
  const brand = PROJECTOR_BRANDS.some((b) => String(product.brand || "").toLowerCase().includes(b));
  return (lumen && (named || modelCode || brand)) || (named && lumen) || (brand && lumen && modelCode);
}

export function classifyProduct(product) {
  const text = blob(product);
  const title = String(product.title || product.model || "").toLowerCase();
  const brand = String(product.brand || "").toLowerCase();
  const signals = [];

  const lensN = hits(title, LENS_STRONG) * 3 + hits(text, LENS_STRONG);
  const furnitureN = hits(title, FURNITURE_STRONG) * 3 + hits(text, FURNITURE_STRONG);
  const mountN = hits(title, MOUNT_STRONG) * 3 + hits(text, MOUNT_STRONG);
  const cableN = hits(title, CABLE_STRONG) * 3 + hits(text, CABLE_STRONG);
  const bundleN = hits(title, BUNDLE_STRONG) * 3 + hits(text, BUNDLE_STRONG);
  const serviceN = hits(title, SERVICE_STRONG) * 2 + hits(text, SERVICE_STRONG);
  const accessoryN = hits(title, ACCESSORY_STRONG) * 3 + hits(text, ACCESSORY_STRONG);
  let screenN = hits(text, SCREEN_STRONG) * 4;
  let projectorN = hits(text, PROJECTOR_STRONG) * 4;

  if (SCREEN_BRANDS.some((b) => brand.includes(b) || text.includes(b))) {
    screenN += 8;
    signals.push("screen_brand");
  }
  if (PROJECTOR_BRANDS.some((b) => brand.includes(b))) {
    projectorN += /lumen|beamer|projector|throw/.test(title) ? 3 : 1;
    signals.push("projector_brand");
  }
  if (/\bhivilux\b/.test(brand) || /\bhivilux\b/.test(text)) {
    if (/scherm|doek|clr|alr|screen/.test(text)) screenN += 5;
  }
  if (/\b\d{2,3}\s*inch\b/.test(text) && (screenN >= 4 || /scherm|doek|screen/.test(text))) screenN += 3;
  if (/projectiescherm|projectiedoek/.test(title)) {
    screenN += 12;
    projectorN = Math.max(0, projectorN - 8);
    signals.push("screen_title");
  }

  const negativeTitle =
    lensN >= 3 || furnitureN >= 3 || mountN >= 3 || cableN >= 3 || bundleN >= 3 || accessoryN >= 3 || serviceN >= 3;
  const evidence = hasProjectorEvidence(product, title, text);

  let productKind = PRODUCT_KINDS.OTHER;
  if (screenN >= 8 && screenN >= projectorN) productKind = PRODUCT_KINDS.PROJECTION_SCREEN;
  else if (lensN >= 3) productKind = PRODUCT_KINDS.PROJECTOR_LENS;
  else if (furnitureN >= 3) productKind = PRODUCT_KINDS.FURNITURE;
  else if (bundleN >= 3) productKind = PRODUCT_KINDS.BUNDLE;
  else if (serviceN >= 2) productKind = PRODUCT_KINDS.SERVICE;
  else if (cableN >= 3 && !evidence) productKind = PRODUCT_KINDS.CABLE;
  else if (mountN >= 3 && !evidence) productKind = PRODUCT_KINDS.MOUNT;
  else if (accessoryN >= 3 && !evidence) productKind = PRODUCT_KINDS.ACCESSORY;
  else if (evidence && !negativeTitle) productKind = PRODUCT_KINDS.PROJECTOR;
  else if (evidence && negativeTitle) {
    productKind =
      lensN >= 3
        ? PRODUCT_KINDS.PROJECTOR_LENS
        : furnitureN >= 3
          ? PRODUCT_KINDS.FURNITURE
          : bundleN >= 3
            ? PRODUCT_KINDS.BUNDLE
            : PRODUCT_KINDS.ACCESSORY;
    signals.push("accessory_overrides_lumen");
  } else if (product.specEnriched) {
    productKind = PRODUCT_KINDS.PROJECTOR;
  } else if (projectorN >= 8 && !negativeTitle) {
    productKind = PRODUCT_KINDS.PROJECTOR;
  } else if (screenN >= 3) productKind = PRODUCT_KINDS.PROJECTION_SCREEN;
  else if (mountN >= 2) productKind = PRODUCT_KINDS.MOUNT;
  else if (accessoryN >= 2) productKind = PRODUCT_KINDS.ACCESSORY;

  if (productKind === PRODUCT_KINDS.PROJECTOR && !evidence && !product.specEnriched) {
    productKind = PRODUCT_KINDS.OTHER;
    signals.push("insufficient_projector_evidence");
  }

  const category = categoryFromKind(productKind);
  const confidence = productKind === PRODUCT_KINDS.PROJECTOR && evidence ? "confirmed" : productKind !== PRODUCT_KINDS.OTHER ? "inferred" : "unknown";

  return {
    category,
    productKind,
    confidence,
    scores: {
      projector: projectorN,
      screen: screenN,
      lens: lensN,
      furniture: furnitureN,
      mount: mountN,
      cable: cableN,
      bundle: bundleN,
      accessory: accessoryN,
    },
    signals,
  };
}

export function isProjector(product) {
  return (product.productKind || classifyProduct(product).productKind) === PRODUCT_KINDS.PROJECTOR;
}

export function isScreen(product) {
  const kind = product.productKind || classifyProduct(product).productKind;
  return kind === PRODUCT_KINDS.PROJECTION_SCREEN || product.category === CATEGORIES.SCREEN;
}

export function isRecommendableProjector(product) {
  const kind = product.productKind || classifyProduct(product).productKind;
  return kind === PRODUCT_KINDS.PROJECTOR;
}

export function classificationCounts(products) {
  const counts = {
    projector: 0,
    screen: 0,
    accessory: 0,
    unknown: 0,
    kinds: {
      projector: 0,
      projection_screen: 0,
      projector_lens: 0,
      mount: 0,
      furniture: 0,
      cable: 0,
      accessory: 0,
      bundle: 0,
      service: 0,
      other: 0,
    },
  };
  for (const product of products) {
    const kind = product.productKind || classifyProduct(product).productKind;
    const category = product.category || categoryFromKind(kind);
    counts.kinds[kind] = (counts.kinds[kind] || 0) + 1;
    if (kind === PRODUCT_KINDS.PROJECTOR) counts.projector += 1;
    else if (kind === PRODUCT_KINDS.PROJECTION_SCREEN || category === CATEGORIES.SCREEN) counts.screen += 1;
    else if (category === "unknown" || kind === PRODUCT_KINDS.OTHER) counts.unknown += 1;
    else counts.accessory += 1;
  }
  return counts;
}
