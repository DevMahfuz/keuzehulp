import { budgetCeiling } from "./factors";
import { isConsumerIntent, isInstallationSegment } from "./segments";

export function overBudgetRatio(price, budgetKey) {
  const cap = budgetCeiling(budgetKey);
  if (cap == null || price == null || budgetKey === "flex") return 0;
  if (price <= cap) return 0;
  return (price - cap) / cap;
}

export function budgetPenaltyPoints(price, budgetKey, { relax } = {}) {
  if (budgetKey === "flex" || budgetKey == null) return { budgetPenalty: 0, overPct: 0, extreme: false, cap: null };
  const cap = budgetCeiling(budgetKey);
  if (cap == null || price == null) return { budgetPenalty: 0, overPct: 0, extreme: false, cap };
  const overPct = price <= cap ? 0 : (price - cap) / cap;
  let budgetPenalty = 0;
  if (overPct <= 0) budgetPenalty = 0;
  else if (overPct <= 0.1) budgetPenalty = 3;
  else if (overPct <= 0.25) budgetPenalty = 10;
  else if (overPct <= 0.5) budgetPenalty = 20;
  else if (overPct <= 1) budgetPenalty = 32;
  else budgetPenalty = 42;
  if (relax) budgetPenalty = Math.max(0, budgetPenalty - 8);
  return { budgetPenalty, overPct, extreme: overPct > 1, cap, overBy: Math.max(0, price - cap) };
}

function segmentStrength(product, name) {
  const hit = (product.segments || []).find((s) => s.name === name);
  return hit ? hit.confidence : 0;
}

export function evaluateIntentFit(product, answers = {}, options = {}) {
  const signals = product.categorySignals || {};
  const spec = product.specSignals || {};
  const hintsMin = String(product.specMin || "").toLowerCase();
  const hintsPlus = String(product.specPlus || "").toLowerCase();
  let categoryMatchScore = 0;
  let segmentFitScore = 0;
  const notes = [];

  const usage = answers.usage;
  const wantsUst = answers.throwDistance === "wall";
  const consumer = isConsumerIntent(answers);
  const install = isInstallationSegment(product);

  if (usage === "movies" || answers.priority === "picture") {
    if (signals.homeCinema >= 0.8 || spec.homeCinema) categoryMatchScore += 12;
    else if (signals.livingRoom >= 0.8) categoryMatchScore += 6;
    if (spec.premiumHomeCinema) categoryMatchScore += 4;
    if (signals.business >= 0.8 || spec.business) categoryMatchScore -= 6;
    if (signals.education >= 0.8 || spec.education) categoryMatchScore -= 8;
    if (spec.largeVenue) categoryMatchScore -= 12;
    segmentFitScore += segmentStrength(product, "consumer_home_cinema") * 12;
    segmentFitScore += segmentStrength(product, "living_room") * 6;
    if (answers.ambientLight === "lots" || answers.ambientLight === "bright") {
      if (/overdag minder/.test(hintsMin)) {
        segmentFitScore -= 10;
        notes.push("csv_min_poor_daylight");
      }
      if (spec.brightRoom || /overdag goed/.test(hintsPlus)) segmentFitScore += 6;
    }
  }

  if (usage === "tv") {
    if (signals.livingRoom >= 0.8) categoryMatchScore += 12;
    if (signals.homeCinema >= 0.8) categoryMatchScore += 8;
    if (signals.goodSound >= 0.8) categoryMatchScore += 4;
    segmentFitScore += segmentStrength(product, "living_room") * 12;
  }

  if (usage === "gaming" || answers.priority === "gaming") {
    const specEvidence =
      (product.inputLag != null && product.inputLag <= 30) ||
      (product.refreshRate != null && product.refreshRate >= 120);
    if (signals.gaming >= 0.8 || spec.gaming) categoryMatchScore += specEvidence ? 12 : 6;
    const g = segmentStrength(product, "gaming");
    segmentFitScore += g * 14;
    if (signals.gaming >= 0.8 && !specEvidence) {
      notes.push("gaming_category_without_specs");
    }
  }

  if (usage === "office") {
    if (signals.business >= 0.8 || spec.business) categoryMatchScore += 14;
    if (signals.education >= 0.8 || spec.education) categoryMatchScore += 10;
    if (signals.homeCinema >= 0.8 && signals.business < 0.5) categoryMatchScore -= 6;
    segmentFitScore += Math.max(segmentStrength(product, "business_fixed"), segmentStrength(product, "business_portable")) * 14;
    segmentFitScore += segmentStrength(product, "education") * 10;
  }

  if (usage === "outdoor") {
    if (signals.outdoor >= 0.8) categoryMatchScore += 12;
    segmentFitScore += segmentStrength(product, "outdoor_consumer") * 10;
    if (answers.outdoorWhen === "day") {
      segmentFitScore -= 18;
      notes.push("daylight_outdoor_not_recommended");
    }
  }

  if (answers.room === "bedroom") {
    if (signals.bedroom >= 0.8) categoryMatchScore += 10;
    if (signals.mini >= 0.8) categoryMatchScore += 4;
    segmentFitScore += segmentStrength(product, "bedroom") * 10;
    segmentFitScore += segmentStrength(product, "portable_consumer") * 4;
  } else if (answers.room === "living" || answers.room === "cinema") {
    if (signals.livingRoom >= 0.8 && answers.room === "living") categoryMatchScore += 6;
    if (signals.homeCinema >= 0.8 && answers.room === "cinema") categoryMatchScore += 6;
  }

  if (wantsUst) {
    if (signals.ust >= 0.8 || product.throwClass === "ust" || product.ust) categoryMatchScore += 15;
    segmentFitScore += segmentStrength(product, "ust_living_room") * 12;
    if (product.throwClass === "short" && !product.ust) categoryMatchScore -= 8;
    if (signals.ust >= 0.8 && product.throwRatioMax != null && product.throwRatioMax > 0.7) {
      categoryMatchScore -= 10;
      notes.push("ust_category_conflict");
    }
  } else if (answers.throwDistance === "under_2") {
    const isUst = product.throwClass === "ust" || product.ust || signals.ust >= 0.8;
    if ((signals.shortThrow >= 0.8 || product.throwClass === "short") && !isUst) {
      categoryMatchScore += 14;
      segmentFitScore += segmentStrength(product, "short_throw") * 12;
    } else if (isUst) {
      categoryMatchScore -= 6;
      segmentFitScore -= 8;
      notes.push("ust_vs_short_throw_intent");
    }
  }

  if (answers.priority === "ease" && signals.goodSound >= 0.8) categoryMatchScore += 5;

  if (answers.room === "bedroom" || answers.priority === "quiet") {
    if (product.noiseLevel != null && product.noiseLevel <= 26) segmentFitScore += 4;
  }
  if ((answers.priority === "ease" || answers.usage === "tv") && /geen ingebouwde smart/.test(hintsMin)) {
    segmentFitScore -= 8;
    notes.push("csv_min_no_smart");
  }
  if ((answers.usage === "mixed" || answers.priority === "ease") && /zwaar/.test(hintsMin) && (spec.portable || product.categorySignals?.mini >= 0.8)) {
    segmentFitScore -= 8;
    notes.push("csv_min_heavy_portable");
  }
  if ((answers.usage === "mixed" || answers.usage === "tv") && signals.mini >= 0.8 && answers.screenSize !== "120_150" && answers.screenSize !== "over_150") {
    categoryMatchScore += 8;
    segmentFitScore += segmentStrength(product, "portable_consumer") * 8;
  }
  if (signals.mini >= 0.8 && (answers.screenSize === "120_150" || answers.screenSize === "over_150") && (answers.ambientLight === "lots" || answers.ambientLight === "bright")) {
    segmentFitScore -= 16;
    notes.push("mini_too_small_for_bright_large");
  }

  if (consumer && install && !options.allowInstall) {
    segmentFitScore -= 25;
    notes.push("installation_not_for_consumer");
  } else if (usage === "office" && install) {
    segmentFitScore += 4;
  }

  if (usage === "movies" && signals.education >= 0.8) {
    segmentFitScore -= 12;
    notes.push("education_vs_home_cinema");
  }

  if (
    answers.priority === "picture" &&
    (answers.budget === "flex" || answers.budget === "2500plus") &&
    (answers.ambientLight === "dark" || answers.room === "cinema")
  ) {
    if (spec.premiumHomeCinema || product.native4K) {
      segmentFitScore += 8;
      notes.push("image_quality_priority");
    }
    if (product.smartBuiltIn) segmentFitScore -= 3;
  }

  const budget = budgetPenaltyPoints(product.price, answers.budget, { relax: options.relaxBudget });
  const sparse = product.dataQuality === "sparse" ? -6 : product.dataQuality === "partial" ? -2 : 0;

  categoryMatchScore = Math.max(-15, Math.min(15, categoryMatchScore));
  segmentFitScore = Math.max(-25, Math.min(15, segmentFitScore));

  return {
    categoryMatchScore,
    segmentFitScore,
    budgetPenalty: budget.budgetPenalty,
    overPct: budget.overPct,
    extremeBudget: budget.extreme,
    confidenceAdjustment: sparse,
    notes,
    install,
    consumer,
  };
}

export function isConsumerInstallationBlocked(product, answers, options = {}) {
  return isConsumerIntent(answers) && isInstallationSegment(product) && !options.allowInstall;
}
