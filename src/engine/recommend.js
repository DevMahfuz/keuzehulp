import { rankProjectors, pickProjectorHighlights } from "./projectorScoring";
import { rankScreens, pickScreenHighlights } from "./screenScoring";
import { normalizeBrandName } from "./commercialScore";

export function matchBand(score) {
  if (score >= 90) return { key: "excellent", label: "Uitstekende match" };
  if (score >= 80) return { key: "good", label: "Goede match" };
  if (score >= 70) return { key: "fair", label: "Redelijke match" };
  return { key: "concession", label: "Alternatief met concessie" };
}

export function modelFamilyKey(product) {
  const brand = normalizeBrandName(product.brand);
  const model = String(product.model || product.title || "")
    .toLowerCase()
    .replace(brand, "")
    .replace(/retourdeal|outlet|refurbished/g, "")
    .replace(/\b(wit|zwart|white|black|grey|gray)\b/g, "")
    .replace(/\/[wb]\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const tokens = model.split(/\s+/).filter(Boolean).slice(0, 3).join(" ");
  return `${brand}::${tokens || product.productId || product.id}`;
}

export function diversifyScored(scored, limit = 8) {
  const seen = new Set();
  const unique = [];
  const rest = [];
  for (const item of scored) {
    const key = modelFamilyKey(item.product);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    } else {
      rest.push(item);
    }
    if (unique.length >= limit) break;
  }
  return unique.concat(rest.filter((item) => !unique.includes(item))).slice(0, limit);
}

function annotate(items, matchType, fallbackLevel) {
  return items.map((item) => {
    const critical = (item.concessions || []).some((c) => c.severity === "critical") || item.nearest;
    let matchScore = item.matchScore;
    if (matchType === "nearest" || critical) matchScore = Math.min(matchScore, 68);
    if (matchType === "soft") matchScore = Math.min(matchScore, 86);
    return {
      ...item,
      matchScore,
      matchType,
      fallbackLevel,
      matchBand: matchBand(matchScore),
    };
  });
}

function pushUnique(items, labels, item, label) {
  if (!item) return;
  if (items.some((i) => i.product.id === item.product.id)) return;
  items.push(item);
  labels.push(label);
}

function pickFallbackThree(pool, matchType, fallbackLevel) {
  const diverse = diversifyScored(pool, 12);
  const items = [];
  const labels = [];
  pushUnique(items, labels, diverse[0], "Beste alternatief");
  const cap = diverse[0]?.breakdown?.budget?.cap;
  const aroundBudget = [...diverse]
    .slice(1)
    .sort((a, b) => {
      const da = cap != null && a.product.price != null ? Math.abs(a.product.price - cap) : 9999;
      const db = cap != null && b.product.price != null ? Math.abs(b.product.price - cap) : 9999;
      return da - db;
    })[0];
  pushUnique(items, labels, aroundBudget, "Beste alternatief rond budget");
  const strongest = [...diverse].sort((a, b) => (b.technicalScore || 0) - (a.technicalScore || 0))[0];
  pushUnique(items, labels, strongest, "Technisch sterkste alternatief");
  for (const extra of diverse) {
    if (items.length >= 3) break;
    pushUnique(items, labels, extra, "Ook een goed alternatief");
  }
  return {
    items: annotate(items.slice(0, 3), matchType, fallbackLevel),
    labels: labels.slice(0, 3),
    fallbackLevel,
    matchLevel: matchType,
  };
}

function technicallyOk(scored) {
  return scored.filter((r) => {
    if (r.infeasible || r.nearest) return false;
    if ((r.technicalScore || 0) < 48) return false;
    if ((r.breakdown?.intent?.overPct || 0) > 0.25) return false;
    if (r.breakdown?.intent?.notes?.includes("installation_not_for_consumer")) return false;
    return true;
  });
}

export function recommend(products, answers, category = "projector") {
  if (category === "screen") return recommendScreens(products, answers);

  const ranked = rankProjectors(products, answers);
  const exact = technicallyOk(ranked);
  if (exact.length) {
    const picked = pickProjectorHighlights(diversifyScored(exact, 10));
    if (picked.items.length) {
      return {
        ...picked,
        items: annotate(picked.items, "exact", 1),
        fallbackLevel: 1,
        matchLevel: "exact",
        ranked,
        emptyReason: null,
      };
    }
  }

  const soft = rankProjectors(products, answers, { relaxBudget: true, relaxSoft: true });
  const softOk = technicallyOk(soft);
  if (softOk.length) {
    return { ...pickFallbackThree(softOk, "soft", 2), ranked: soft, emptyReason: null };
  }

  const near = rankProjectors(products, answers, { relaxBudget: true, relaxSoft: true, nearMiss: true });
  const nearOk = near.filter((r) => !r.infeasible);
  if (nearOk.length) {
    return { ...pickFallbackThree(nearOk, "nearest", 3), ranked: near, emptyReason: null };
  }

  const last = rankProjectors(products, answers, {
    relaxBudget: true,
    relaxSoft: true,
    nearMiss: true,
    allowUstRelax: true,
    allowInstall: true,
  });
  if (last.length) {
    const pool = last.filter((r) => !r.infeasible);
    return { ...pickFallbackThree(pool.length ? pool : last, "nearest", 3), ranked: last, emptyReason: null };
  }

  return {
    items: [],
    labels: [],
    fallbackLevel: 0,
    matchLevel: "none",
    ranked,
    emptyReason: "no_relevant_products",
  };
}

function recommendScreens(products, answers) {
  const ranked = rankScreens(products, answers);
  const exact = ranked.filter((r) => !r.infeasible);
  if (exact.length) {
    const picked = pickScreenHighlights(diversifyScored(exact, 10));
    return {
      ...picked,
      items: annotate(picked.items, "exact", 1),
      fallbackLevel: 1,
      matchLevel: "exact",
      ranked,
      emptyReason: null,
    };
  }
  const soft = rankScreens(products, answers, { relaxBudget: true, relaxSoft: true });
  const softOk = soft.filter((r) => !r.infeasible);
  if (softOk.length) {
    return { ...pickFallbackThree(softOk, "soft", 2), ranked: soft, emptyReason: null };
  }
  const near = rankScreens(products, answers, { relaxBudget: true, nearMiss: true, allowUstRelax: true });
  if (near.length) {
    return { ...pickFallbackThree(near, "nearest", 3), ranked: near, emptyReason: null };
  }
  return {
    items: [],
    labels: [],
    fallbackLevel: 0,
    matchLevel: "none",
    ranked,
    emptyReason: "no_relevant_products",
  };
}

export function debugSnapshot(scored) {
  const p = scored.product || {};
  return {
    product: p.title,
    price: p.price,
    id: p.id,
    shopCategories: p.shopCategories,
    segments: p.segments,
    classification: p.category,
    technicalScore: scored.technicalScore,
    categoryMatchScore: scored.categoryMatchScore,
    segmentFitScore: scored.segmentFitScore,
    commercialAdjustment: scored.commercialAdjustment,
    budgetPenalty: scored.budgetPenalty,
    confidenceAdjustment: scored.confidenceAdjustment,
    confidence: scored.confidence || p.segmentConfidence,
    finalScore: scored.rankingScore,
    categorySignals: p.categorySignals,
    gamingEvidence: {
      inputLag: p.inputLag,
      refreshRate: p.refreshRate,
      gamingFlag: p.gaming,
      category: p.categorySignals?.gaming || 0,
      sources: p.categorySources?.gaming || [],
    },
    matchType: scored.matchType,
    positives: scored.pros,
    concessions: scored.concessions || scored.warnings,
    exclusionReason: scored.infeasible
      ? scored.breakdown?.throwFit?.reason ||
        (scored.breakdown?.intent?.notes || []).join(",") ||
        (scored.breakdown?.brightness?.dim ? "brightness" : "infeasible")
      : null,
    dataQuality: p.dataQuality,
    fieldConfidence: p.fieldConfidence,
    specEnriched: p.specEnriched,
    specMatchMethod: p.specMatchMethod,
    fieldSources: p.fieldSources,
    specConflicts: p.specConflicts,
    specSuitableFor: p.specSuitableFor,
    native4K: p.native4K,
    throwClass: p.throwClass,
    throwRatioMin: p.throwRatioMin,
    throwRatioMax: p.throwRatioMax,
    inputLag: p.inputLag,
    provenance: p.provenance,
  };
}

export function isAdvisorDebugEnabled() {
  if (process.env.NODE_ENV === "production") return false;
  if (typeof window === "undefined") return Boolean(process.env.KEUZEHULP_DEBUG);
  try {
    const q = new URLSearchParams(window.location.search);
    return q.get("debug") === "1" || window.localStorage.getItem("keuzehulp:debug") === "1";
  } catch {
    return false;
  }
}
