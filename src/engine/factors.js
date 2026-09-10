import { STOCK_RANKING, stockStatus } from "../config/stockRanking";

export function budgetCeiling(budgetKey) {
  const map = {
    200: 200,
    500: 500,
    1000: 1000,
    1500: 1500,
    2500: 2500,
    "2500plus": 8000,
    "1000plus": 4000,
    flex: null,
  };
  return map[budgetKey] ?? null;
}

export function evaluateBudget(price, budgetKey, { relax } = {}) {
  if (budgetKey === "flex" || budgetKey == null) {
    return { score: 80, overBudget: false, softOver: false, cap: null };
  }
  const cap = budgetCeiling(budgetKey);
  if (cap == null || price == null) return { score: 60, overBudget: false, cap };
  if (relax) {
    const strict = evaluateBudget(price, budgetKey);
    return {
      ...strict,
      score: 78,
      relax: true,
      overBy: price > cap ? price - cap : 0,
    };
  }

  if (budgetKey === "2500plus" || budgetKey === "1000plus") {
    if (price >= (budgetKey === "2500plus" ? 1800 : 700)) return { score: 90, overBudget: false, cap };
    return { score: 70, overBudget: false, cap };
  }

  if (price <= cap) {
    const utilization = price / cap;
    return { score: 70 + utilization * 25, overBudget: false, cap };
  }
  if (price <= cap * 1.15) {
    return { score: 55, overBudget: false, softOver: true, cap, overBy: price - cap };
  }
  if (price <= cap * 1.3) {
    return { score: 28, overBudget: true, softOver: true, cap, overBy: price - cap };
  }
  return { score: 8, overBudget: true, cap, overBy: price - cap };
}

export function isFourK(resolution) {
  if (!resolution) return false;
  const r = String(resolution).toLowerCase();
  return r.includes("4k") || r.includes("uhd") || r.includes("2160");
}

export function isFullHd(resolution) {
  if (!resolution) return false;
  const r = String(resolution).toLowerCase();
  return r.includes("1080") || r.includes("full hd") || r.includes("fhd");
}

export function isNative4K(product) {
  return Boolean(product?.native4K || product?.cinema4K);
}

export function evaluateUsage(product, answers) {
  const u = answers.usage;
  const spec = product.specSignals || {};
  let score = 55;
  if (u === "movies") {
    score = 40;
    if (product.homeCinema || product.categorySignals?.homeCinema >= 0.8 || spec.homeCinema) score += 30;
    if (spec.premiumHomeCinema) score += 8;
    if (isNative4K(product)) score += 24;
    else if (isFourK(product.resolution)) score += 16;
    else if (isFullHd(product.resolution)) score += 8;
    if (product.hdr) score += 6;
    if (spec.largeVenue || spec.business) score -= 18;
    if (product.office && !product.homeCinema && (product.categorySignals?.homeCinema || 0) < 0.8 && !spec.homeCinema) score -= 15;
  } else if (u === "tv") {
    score = 40;
    if (product.livingRoom || product.smart || product.categorySignals?.livingRoom >= 0.8 || spec.smart) score += 25;
    if (product.smart && product.wifiOptional && !product.wifiBuiltIn && !product.smartBuiltIn) score += 6;
    else if (product.smart || product.smartBuiltIn) score += 15;
    if (isFourK(product.resolution)) score += 12;
    if (product.brightnessAnsi != null && product.brightnessAnsi >= 2200) score += 8;
  } else if (u === "gaming") {
    score = 35;
    if (product.gaming || spec.gaming) score += 35;
    else if (product.categorySignals?.gaming >= 0.8) score += 14;
    if (product.inputLag != null && product.inputLag <= 5) score += 24;
    else if (product.inputLag != null && product.inputLag <= 10) score += 20;
    else if (product.inputLag != null && product.inputLag <= 20) score += 14;
    else if (product.inputLag != null && product.inputLag <= 35) score += 8;
    if (product.refreshRate >= 120 || product.hdmi21) score += 10;
  } else if (u === "sport") {
    score = 45;
    if (product.brightnessAnsi != null && product.brightnessAnsi >= 3000) score += 25;
    if (product.refreshRate >= 120 || product.gaming) score += 15;
    if (product.livingRoom) score += 8;
  } else if (u === "office") {
    score = 40;
    if (product.office || product.categorySignals?.business >= 0.8 || product.categorySignals?.education >= 0.8 || spec.business || spec.education) score += 35;
    if (product.brightnessAnsi != null && product.brightnessAnsi >= 3000) score += 15;
    if (product.lampHours != null && product.lampHours >= 10000) score += 6;
    if (product.homeCinema && !product.office && product.categorySignals?.business < 0.5 && !spec.business) score -= 10;
  } else if (u === "outdoor") {
    score = 30;
    if (product.outdoor) score += 30;
    if (product.brightnessAnsi != null && product.brightnessAnsi >= 3500) score += 25;
    if (product.brightnessAnsi != null && product.brightnessAnsi < 1500) score -= 20;
  } else if (u === "mixed") {
    score = 50;
    if (product.livingRoom || product.homeCinema) score += 15;
    if (product.smart) score += 10;
    if (isFourK(product.resolution) || isFullHd(product.resolution)) score += 10;
    if (product.brightnessAnsi != null && product.brightnessAnsi >= 2500) score += 8;
  }
  return { score: clamp(score) };
}

export function evaluateGaming(product, answers) {
  const relevant = answers.usage === "gaming" || answers.priority === "gaming";
  if (!relevant) return { score: 70, relevant: false };

  const level = answers.gamingLevel || (answers.usage === "gaming" ? "console" : "casual");
  let score = 30;
  const catGaming = product.categorySignals?.gaming >= 0.8;
  if (product.gaming) score += 25;
  else if (catGaming) score += 12;
  const spec = product.specSignals || {};
  const lag = product.inputLag;
  if (lag != null) {
    if (lag <= 5) score += 34;
    else if (lag <= 10) score += 28;
    else if (lag <= 20) score += 20;
    else if (lag <= 35) score += 10;
    else score -= 12;
  } else if (product.gaming) {
    score += 8;
  }
  if (product.refreshRate >= 120 || product.hdmi21) score += 12;
  if (spec.gaming) score += 8;
  if (catGaming && lag == null && !(product.refreshRate >= 120) && !product.hdmi21) {
    score = Math.min(score, 58);
  }

  if (level === "competitive" && (lag == null || lag > 20) && !product.gaming && !catGaming && !spec.gaming) {
    return { score: Math.min(score, 25), relevant: true, weak: true };
  }
  return { score: clamp(score), relevant: true };
}

export function evaluatePriority(product, answers, budgetEval) {
  const p = answers.priority;
  if (!p) return { score: 70 };
  if (p === "picture") {
    let s = 32;
    if (isNative4K(product)) s += 40;
    else if (isFourK(product.resolution)) s += 16;
    if (product.specSignals?.premiumHomeCinema) s += 16;
    if (product.homeCinema || product.categorySignals?.homeCinema >= 0.8 || product.specSignals?.homeCinema) s += 14;
    if (product.hdr) s += 6;
    if (product.noiseLevel != null && product.noiseLevel <= 24) s += 8;
    if (/d-ila|sxrd|lcos/i.test(`${product.technology || ""} ${product.title || ""}`)) s += 10;
    if (/zwartwaarde|imax/.test(String(product.specPlus || "").toLowerCase())) s += 6;
    if (product.smartBuiltIn) s += 2;
    if (product.brightnessAnsi != null && product.brightnessAnsi >= 5000 && (product.specSignals?.largeVenue || product.specSignals?.business || product.categorySignals?.business >= 0.8)) {
      s -= 18;
    }
    return { score: clamp(s), imageQualityPriority: true };
  }
  if (p === "brightness") {
    if (product.brightnessAnsi == null) return { score: 50, unknown: true };
    return { score: clamp(product.brightnessAnsi / 45) };
  }
  if (p === "gaming") {
    return evaluateGaming(product, answers);
  }
  if (p === "ease") {
    let s = 40;
    if (product.smartBuiltIn || (product.smart && !product.wifiOptional)) s += 35;
    else if (product.wifiOptional) s += 12;
    if (product.livingRoom) s += 15;
    if (product.categorySignals?.goodSound >= 0.8) s += 10;
    return { score: clamp(s) };
  }
  if (p === "quiet") {
    if (product.noiseLevel == null) return { score: 50 };
    if (product.noiseLevel <= 22) return { score: 98 };
    if (product.noiseLevel <= 26) return { score: 90 };
    if (product.noiseLevel <= 30) return { score: 75 };
    if (product.noiseLevel <= 34) return { score: 52 };
    return { score: 32 };
  }
  if (p === "value") {
    if (product.price == null) return { score: 50 };
    const quality = (isFourK(product.resolution) ? 40 : 20) + Math.min((product.brightnessAnsi || 0) / 80, 30);
    const priceScore = product.price < 1000 ? 25 : product.price < 1600 ? 18 : 8;
    const budgetBoost = budgetEval?.softOver ? -10 : 0;
    return { score: clamp(quality + priceScore + budgetBoost) };
  }
  return { score: 70 };
}

export function evaluateAvailability(product) {
  const status = stockStatus(product);
  if (status === "inactive") {
    return { score: 0, available: false, sellable: false, status };
  }
  if (status === "out_of_stock") {
    return { score: STOCK_RANKING.outOfStockScore, available: false, sellable: true, status };
  }
  if (status === "limited") {
    return { score: STOCK_RANKING.limitedScore, available: true, sellable: true, status };
  }
  if (status === "unknown") {
    return { score: 70, available: true, sellable: true, status };
  }
  return { score: STOCK_RANKING.inStockScore, available: true, sellable: true, status };
}

export function evaluateResolution(product, answers) {
  const u = answers.usage;
  if (u === "office") {
    if (isFourK(product.resolution) || isFullHd(product.resolution)) return { score: 85 };
    return { score: 55 };
  }
  if (!product.resolution) return { score: 52, unknown: true };
  if (isNative4K(product) && u === "movies") return { score: 100 };
  if (isFourK(product.resolution)) return { score: isNative4K(product) ? 100 : 90 };
  if (isFullHd(product.resolution)) return { score: u === "movies" ? 62 : 75 };
  return { score: 40 };
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}

export function imageQualityAdjustment(product, answers) {
  if (answers.priority !== "picture") return 0;
  let n = 0;
  if (isNative4K(product)) n += 12;
  if (product.specSignals?.premiumHomeCinema) n += 10;
  if (/d-ila|sxrd|lcos/i.test(`${product.technology || ""} ${product.title || ""}`)) n += 8;
  if (product.noiseLevel != null && product.noiseLevel <= 24) n += 4;
  if (/zwartwaarde|imax|contrast/.test(String(product.specPlus || "").toLowerCase())) n += 4;
  if (product.specSignals?.largeVenue || product.specSignals?.business) n -= 10;
  if (answers.budget === "flex" || answers.budget === "2500plus") n += 6;
  else if (["500", "1000", "1500"].includes(String(answers.budget))) n = Math.round(n * 0.35);
  return Math.max(-12, Math.min(22, n));
}
