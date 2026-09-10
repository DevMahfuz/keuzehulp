import { STOCK_RANKING, isSellableProduct } from "../config/stockRanking";
import { evaluateAvailability, evaluateBudget } from "./factors";
import { CATEGORIES } from "./productModel";
import { screenReasons } from "./reasons";
import { getTargetSizeInches } from "./throwFit";
import { applyCommercialScore } from "./commercialScore";
import { attachSegments } from "./segments";
import { budgetPenaltyPoints } from "./intentFit";

export function scoreScreen(product, answers, options = {}) {
  const hydrated = product.segments ? product : attachSegments(product);
  const size = getTargetSizeInches(answers.screenSize);
  const budget = evaluateBudget(hydrated.price, answers.budget, { relax: options.relaxBudget });
  const availability = evaluateAvailability(hydrated);
  const signals = hydrated.categorySignals || {};

  let score = 40;
  let infeasible = false;
  let nearest = false;
  let categoryMatchScore = 0;

  if (hydrated.sizeInches) {
    const diff = Math.abs(hydrated.sizeInches - size) / size;
    if (diff <= 0.12) score += 25;
    else if (diff <= 0.25) score += 14;
    else if (diff <= 0.4) score += 4;
    else score -= 10;
  }

  const placement = answers.placement;
  if (placement === "wall") {
    if (hydrated.fixedFrame || hydrated.mounting === "wall" || signals.screenFixed) {
      score += 18;
      categoryMatchScore += 6;
    }
    if (hydrated.electric || signals.screenElectric) {
      score += 10;
      categoryMatchScore += 4;
    }
    if (hydrated.mobile) score -= 15;
  } else if (placement === "ceiling") {
    if (hydrated.electric || hydrated.manual || hydrated.mounting === "ceiling" || signals.screenElectric || signals.screenManual) {
      score += 18;
    }
    if (hydrated.floorRising) score -= 8;
  } else if (placement === "floor") {
    if (hydrated.floorRising || signals.screenFloor) {
      score += 28;
      categoryMatchScore += 8;
    } else {
      score -= 20;
      if (options.nearMiss) nearest = true;
      else infeasible = true;
    }
  } else if (placement === "mobile") {
    if (hydrated.mobile || signals.screenMobile || signals.screenTripod) {
      score += 30;
      categoryMatchScore += 8;
    } else {
      score -= 25;
      if (options.nearMiss) nearest = true;
      else infeasible = true;
    }
  }

  const mech = answers.mechanism;
  if (mech === "electric" && (hydrated.electric || signals.screenElectric)) {
    score += 16;
    categoryMatchScore += 8;
  }
  if (mech === "manual" && (hydrated.manual || signals.screenManual)) score += 16;
  if (mech === "fixed" && (hydrated.fixedFrame || signals.screenFixed)) score += 16;
  if (mech === "electric" && !hydrated.electric && !signals.screenElectric && mech !== "any") score -= 12;
  if (mech === "fixed" && hydrated.mobile) score -= 10;

  if (answers.aspectRatio && hydrated.aspectRatio) {
    if (String(hydrated.aspectRatio).replace(/\s/g, "") === String(answers.aspectRatio).replace(/\s/g, "")) {
      score += 10;
      categoryMatchScore += 4;
    } else {
      score -= 8;
    }
  }

  const kind = answers.projectorKind;
  const ustScreen = hydrated.ustCompatible || hydrated.clr || signals.ustScreen >= 0.8;
  if (kind === "ust") {
    if (ustScreen) {
      score += 28;
      categoryMatchScore += 12;
    } else {
      score -= 30;
      if (options.allowUstRelax) nearest = true;
      else infeasible = true;
    }
  } else if (kind === "standard") {
    if (hydrated.clr || (hydrated.ustCompatible && !hydrated.alr && signals.ustScreen >= 0.8)) {
      score -= 28;
      if (options.nearMiss) nearest = true;
      else infeasible = true;
    } else {
      score += 12;
    }
  }

  const light = answers.ambientLight;
  if ((light === "lots" || light === "bright") && (hydrated.alr || hydrated.clr || signals.alr)) score += 14;
  if (light === "dark" && hydrated.gain && hydrated.gain >= 1) score += 6;

  score += availability.score * 0.08;

  if (infeasible) score = Math.min(score, 36);
  if (nearest) score = Math.min(score, 68);
  if (!availability.available) score = Math.min(score, STOCK_RANKING.outOfStockScoreCap);

  const technicalScore = score;
  const budgetInfo = budgetPenaltyPoints(hydrated.price, answers.budget, { relax: options.relaxBudget });
  categoryMatchScore = Math.max(-15, Math.min(15, categoryMatchScore));
  const commerciallyEligible = !infeasible && !nearest;
  const applied = applyCommercialScore(technicalScore, hydrated, {
    infeasible: !commerciallyEligible,
    context: { projectorKind: answers.projectorKind },
  });
  const rankingScore =
    technicalScore +
    categoryMatchScore +
    (commerciallyEligible ? applied.commercialAdjustment : 0) -
    budgetInfo.budgetPenalty -
    (availability.available ? 0 : STOCK_RANKING.outOfStockRankPenalty);

  const { pros, cons, warnings, concessions } = screenReasons(hydrated, answers, { budget, availability });

  return {
    product: hydrated,
    matchScore: Math.round(Math.max(0, Math.min(99, rankingScore))),
    technicalScore,
    categoryMatchScore,
    segmentFitScore: 0,
    commercialAdjustment: commerciallyEligible ? applied.commercialAdjustment : 0,
    budgetPenalty: budgetInfo.budgetPenalty,
    rankingScore,
    infeasible,
    nearest,
    breakdown: { budget, availability, size, commercial: applied.commercialAdjustment },
    pros,
    cons,
    warnings,
    concessions,
  };
}

export function rankScreens(products, answers, options = {}) {
  return products
    .filter((p) => p.category === CATEGORIES.SCREEN && isSellableProduct(p))
    .map((p) => scoreScreen(p, answers, options))
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
}

export function pickScreenHighlights(ranked) {
  const feasible = ranked.filter((r) => !r.infeasible);
  const pool = feasible.length ? feasible : ranked;
  const items = pool.slice(0, 3);
  const labels = items.map((_, i) => ["Beste match", "Beste prijs/kwaliteit", "Premium keuze"][i] || "Ook een goede optie");
  if (items[1] && items[2] && (items[2].product.price || 0) < (items[1].product.price || 0)) {
    labels[1] = "Voordelige keuze";
    labels[2] = "Premium keuze";
  }
  return { items, labels };
}
