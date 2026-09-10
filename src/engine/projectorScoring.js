import { evaluateBrightness } from "./brightness";
import {
  evaluateAvailability,
  evaluateBudget,
  evaluateGaming,
  evaluatePriority,
  evaluateResolution,
  evaluateUsage,
  imageQualityAdjustment,
} from "./factors";
import { STOCK_RANKING, isSellableProduct } from "../config/stockRanking";
import { isRecommendableProjector } from "./classify";
import { projectorReasons } from "./reasons";
import { evaluateThrowFit } from "./throwFit";
import { applyCommercialScore } from "./commercialScore";
import { evaluateIntentFit, isConsumerInstallationBlocked } from "./intentFit";
import { attachSegments, isInstallationSegment, isConsumerIntent } from "./segments";

export const PROJECTOR_WEIGHTS = {
  throw: 0.28,
  brightness: 0.18,
  usage: 0.12,
  resolution: 0.1,
  gaming: 0.1,
  availability: 0.07,
  priority: 0.15,
};

export function scoreProjector(product, answers, options = {}) {
  const weights = options.weights || PROJECTOR_WEIGHTS;
  const hydrated = product.segments ? product : attachSegments(product);
  const throwFit = evaluateThrowFit(hydrated, answers, options);
  const brightness = evaluateBrightness(hydrated, answers, options);
  const usage = evaluateUsage(hydrated, answers);
  const budget = evaluateBudget(hydrated.price, answers.budget, { relax: options.relaxBudget });
  const resolution = evaluateResolution(hydrated, answers);
  const gaming = evaluateGaming(hydrated, answers);
  const availability = evaluateAvailability(hydrated);
  const priority = options.relaxSoft ? { score: 70 } : evaluatePriority(hydrated, answers, budget);
  const intent = evaluateIntentFit(hydrated, answers, options);

  let technicalScore =
    throwFit.score * weights.throw +
    brightness.score * weights.brightness +
    usage.score * weights.usage +
    resolution.score * weights.resolution +
    (gaming.relevant ? gaming.score : 70) * weights.gaming +
    availability.score * weights.availability +
    priority.score * weights.priority;

  const blockedInstall = isConsumerInstallationBlocked(hydrated, answers, options);
  const installFallback = isConsumerIntent(answers) && isInstallationSegment(hydrated) && options.allowInstall;
  const infeasible = Boolean(throwFit.infeasible || brightness.infeasible || blockedInstall);
  if (infeasible) technicalScore = Math.min(technicalScore, 38);
  if (throwFit.nearest || brightness.nearest) technicalScore = Math.min(technicalScore, 68);
  if (!availability.available) technicalScore = Math.min(technicalScore, STOCK_RANKING.outOfStockScoreCap);
  if (!availability.sellable) technicalScore = 0;

  const commerciallyEligible =
    !infeasible && !throwFit.nearest && !brightness.nearest && !blockedInstall && intent.overPct <= 0.5;
  const applied = applyCommercialScore(technicalScore, hydrated, {
    infeasible: !commerciallyEligible,
    context: { usage: answers.usage },
  });

  const rankingScore =
    technicalScore +
    intent.categoryMatchScore +
    intent.segmentFitScore +
    (commerciallyEligible ? applied.commercialAdjustment : 0) -
    intent.budgetPenalty +
    intent.confidenceAdjustment +
    imageQualityAdjustment(hydrated, answers) -
    (availability.available ? 0 : STOCK_RANKING.outOfStockRankPenalty);

  const matchScore = Math.round(Math.max(0, Math.min(99, rankingScore)));

  const { pros, cons, warnings, concessions } = projectorReasons(hydrated, answers, {
    throwFit,
    brightness,
    budget,
    gaming,
    availability,
    intent,
    blockedInstall: blockedInstall || installFallback,
  });

  return {
    product: hydrated,
    matchScore,
    technicalScore,
    categoryMatchScore: intent.categoryMatchScore,
    segmentFitScore: intent.segmentFitScore,
    commercialAdjustment: commerciallyEligible ? applied.commercialAdjustment : 0,
    budgetPenalty: intent.budgetPenalty,
    confidenceAdjustment: intent.confidenceAdjustment,
    confidence: hydrated.segmentConfidence,
    rankingScore,
    infeasible: infeasible || (blockedInstall && !options.allowInstall),
    nearest: Boolean(throwFit.nearest || brightness.nearest || installFallback),
    breakdown: {
      throwFit,
      brightness,
      usage,
      budget,
      resolution,
      gaming,
      availability,
      priority,
      commercial: commerciallyEligible ? applied.commercialAdjustment : 0,
      intent,
    },
    pros,
    cons,
    warnings,
    concessions,
  };
}

export function preferAvailableCandidate(ranked, windowPts = STOCK_RANKING.nearEqualWindow) {
  if (!ranked?.length) return ranked;
  const best = ranked.find((r) => !r.infeasible) || ranked[0];
  if (!best || best.breakdown?.availability?.available) return ranked;
  const alt = ranked.find(
    (r) =>
      r !== best &&
      !r.infeasible &&
      r.breakdown?.availability?.available &&
      (best.rankingScore || 0) - (r.rankingScore || 0) <= windowPts
  );
  if (!alt) return ranked;
  return [alt, best, ...ranked.filter((r) => r !== alt && r !== best)];
}

export function rankProjectors(products, answers, options = {}) {
  const scored = products
    .filter((p) => isRecommendableProjector(p) && isSellableProduct(p))
    .map((p) => scoreProjector(p, answers, options))
    .sort((a, b) => {
      if (a.infeasible !== b.infeasible) return a.infeasible ? 1 : -1;
      if (a.breakdown.availability.available !== b.breakdown.availability.available) {
        const gap = Math.abs((a.rankingScore || 0) - (b.rankingScore || 0));
        if (gap <= STOCK_RANKING.nearEqualWindow) {
          return a.breakdown.availability.available ? -1 : 1;
        }
      }
      if (b.rankingScore !== a.rankingScore) return (b.rankingScore || 0) - (a.rankingScore || 0);
      if (a.breakdown.availability.available !== b.breakdown.availability.available) {
        return a.breakdown.availability.available ? -1 : 1;
      }
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return (b.technicalScore || 0) - (a.technicalScore || 0);
    });
  return preferAvailableCandidate(scored);
}

export function pickProjectorHighlights(ranked) {
  const feasible = ranked.filter((r) => !r.infeasible && !r.nearest);
  const pool = feasible.length ? feasible : ranked.filter((r) => !r.infeasible);
  if (!pool.length) return { items: [], labels: [] };

  const best = pool[0];
  const value = [...pool]
    .filter((p) => (p.rankingScore || 0) >= (best.rankingScore || 0) * 0.72)
    .sort((a, b) => valueIndex(b) - valueIndex(a))[0];
  const premium = [...pool].filter(isPremiumHighlight).sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0))[0];

  const items = [];
  const labels = [];
  const pushUnique = (item, label) => {
    if (!item) return;
    if (items.some((i) => i.product.id === item.product.id)) return;
    items.push(item);
    labels.push(label);
  };

  pushUnique(best, "Beste match");
  pushUnique(value && value.product.id !== best.product.id ? value : pool[1], "Beste prijs/kwaliteit");
  if (premium && premium.product.id !== best.product.id) {
    pushUnique(premium, "Premium keuze");
  }
  for (const extra of pool) {
    if (items.length >= 3) break;
    pushUnique(extra, "Ook een goede optie");
  }

  return { items: items.slice(0, 3), labels: labels.slice(0, 3) };
}

function isPremiumHighlight(scored) {
  const p = scored.product;
  if (p.specSignals?.largeVenue || p.specSignals?.business) return false;
  if (p.native4K || p.specSignals?.premiumHomeCinema) return true;
  return /sony|jvc/i.test(p.brand || "");
}

function valueIndex(scored) {
  const price = scored.product.price || 1;
  return scored.rankingScore / Math.sqrt(price / 800);
}
