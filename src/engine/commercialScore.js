import { brandPreferences } from "../config/brandPreferences";

export function normalizeBrandName(brand) {
  return String(brand || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function lookupBrandMap(map, brand) {
  if (!map || !brand) return 0;
  const key = normalizeBrandName(brand);
  for (const [name, points] of Object.entries(map)) {
    if (normalizeBrandName(name) === key) return Number(points) || 0;
  }
  return 0;
}

export function isUstCompatibleScreen(product) {
  return Boolean(product?.ustCompatible || product?.clr || product?.categorySignals?.ustScreen >= 0.8);
}

export function commercialBrandPoints(product, context = {}, prefs = brandPreferences) {
  const category = product?.category;
  if (category === "projector") {
    return lookupBrandMap(prefs.projectors, product.brand);
  }
  if (category === "screen") {
    const ustContext = context.projectorKind === "ust" || context.ustProjector === true;
    if (ustContext) {
      if (!isUstCompatibleScreen(product)) return 0;
      return lookupBrandMap(prefs.ustScreens, product.brand);
    }
    return lookupBrandMap(prefs.screens, product.brand);
  }
  return 0;
}

export function clampCommercialAdjustment(points, prefs = brandPreferences) {
  const max = Number(prefs.maxAdjustment) || 15;
  const n = Number(points) || 0;
  return Math.max(-max, Math.min(max, n));
}

/**
 * Commercial points only apply when the product is technically feasible.
 * Infeasible products keep commercialAdjustment at 0 so they cannot jump the queue.
 */
export function applyCommercialScore(technicalScore, product, { infeasible, context } = {}, prefs = brandPreferences) {
  const raw = infeasible ? 0 : commercialBrandPoints(product, context, prefs);
  const commercialAdjustment = clampCommercialAdjustment(raw, prefs);
  const rankingScore = technicalScore + commercialAdjustment;
  const matchScore = Math.round(Math.max(0, Math.min(99, rankingScore)));
  return { technicalScore, commercialAdjustment, matchScore, rankingScore };
}
