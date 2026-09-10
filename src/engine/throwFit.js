import { DISTANCE_PRESETS, SIZE_PRESETS, diagonalInchesToWidthMeters, THROW_CLASS_THRESHOLDS } from "../utils/screenGeometry";

export function getTargetSizeInches(screenSizeKey) {
  return SIZE_PRESETS[screenSizeKey]?.targetInches ?? SIZE_PRESETS.unknown.targetInches;
}

export function userThrowIntent(answers = {}) {
  const d = answers.throwDistance;
  if (d === "wall") return "ust";
  if (d === "under_2") return "short_throw";
  if (d === "unknown" || d == null) return "unknown";
  if (d === "2_3" || d === "3_4" || d === "over_4") return "distance_based";
  return "unknown";
}

export function getDistancePreset(throwDistanceKey) {
  return DISTANCE_PRESETS[throwDistanceKey] ?? DISTANCE_PRESETS.unknown;
}

export function throwRangeForSize(product, sizeInches) {
  const width = diagonalInchesToWidthMeters(sizeInches);
  if (!width) return { min: null, max: null, width, known: false };

  let minR = product.throwRatioMin;
  let maxR = product.throwRatioMax;

  if (minR == null && maxR == null) {
    if (product.ust) {
      minR = 0.18;
      maxR = 0.4;
    } else if (product.shortThrow) {
      minR = 0.4;
      maxR = 1.0;
    } else {
      return { min: product.minThrowDistance ?? null, max: product.maxThrowDistance ?? null, width, known: false };
    }
  }

  if (minR == null) minR = maxR;
  if (maxR == null) maxR = minR;

  return {
    min: minR * width,
    max: maxR * width,
    width,
    known: true,
    minR,
    maxR,
  };
}

/**
 * Returns compatibility for desired image size at the visitor's distance.
 * infeasible=true means this product must not be the top recommendation.
 */
export function evaluateThrowFit(product, answers, options = {}) {
  const sizeInches = getTargetSizeInches(answers.screenSize);
  const distance = getDistancePreset(answers.throwDistance);
  const range = throwRangeForSize(product, sizeInches);
  const throwClass = product.throwClass;
  const isUstProduct = throwClass === "ust" || product.ust === true || (product.categorySignals?.ust || 0) >= 0.8;
  const isShortProduct = (throwClass === "short" || product.shortThrow) && !isUstProduct;
  const nearMiss = Boolean(options.nearMiss);
  const allowUstRelax = Boolean(options.allowUstRelax);
  const throwIntent = userThrowIntent(answers);

  const result = {
    sizeInches,
    range,
    throwClass,
    throwIntent,
    infeasible: false,
    nearest: false,
    score: 55,
    needsUst: Boolean(distance.needsUst) || throwIntent === "ust",
    imageWidthMeters: range.width,
  };

  if (product.maxScreenInches != null && sizeInches > product.maxScreenInches * 1.05) {
    result.reason = "screen_too_large";
    if (nearMiss) {
      result.nearest = true;
      result.score = 18;
      return result;
    }
    result.infeasible = true;
    result.score = 8;
    return result;
  }
  if (product.minScreenInches != null && sizeInches < product.minScreenInches * 0.85) {
    result.score = 48;
    result.smallForProduct = true;
  }

  if (throwIntent === "short_throw") {
    const reallyShort =
      isShortProduct ||
      (product.throwRatioMax != null &&
        product.throwRatioMax <= THROW_CLASS_THRESHOLDS.shortMax &&
        (product.throwRatioMin == null || product.throwRatioMin <= THROW_CLASS_THRESHOLDS.shortMax));
    if (isUstProduct || !reallyShort) {
      result.reason = isUstProduct ? "ust_not_short_throw" : "not_short_throw";
      if (allowUstRelax || nearMiss) {
        result.nearest = true;
        result.score = isUstProduct ? 24 : 28;
        return result;
      }
      result.infeasible = true;
      result.score = 12;
      return result;
    }
  }

  if (distance.needsUst) {
    if (!isUstProduct) {
      result.reason = "needs_ust";
      if (allowUstRelax) {
        result.nearest = true;
        result.score = 16;
        return result;
      }
      result.infeasible = true;
      result.score = 0;
      return result;
    }
    // "Bijna tegen de muur" means UST. Image size determines exact cm; do not require a fixed 35 cm.
    if (range.max != null && range.max > 1.2) {
      result.reason = "distance_mismatch";
      result.neededDistance = range.max;
      if (nearMiss) {
        result.nearest = true;
        result.score = 18;
        return result;
      }
      result.infeasible = true;
      result.score = 10;
      return result;
    }
    result.score = range.max != null && range.max <= 0.85 ? 95 : 82;
    return result;
  }

  if (answers.throwDistance === "unknown" || distance.meters == null) {
    if (throwIntent === "short_throw" && isUstProduct) {
      result.score = 38;
    } else if (isUstProduct) result.score = 50;
    else result.score = 70;
    return result;
  }

  const min = range.min;
  const max = range.max;

  if (min == null || max == null) {
    result.score = 40;
    result.uncertain = true;
    return result;
  }

  const slack = 0.12;
  const windowMin = distance.min != null ? distance.min : distance.meters;
  const windowMax = distance.max != null ? distance.max : distance.meters;
  const overlap = windowMin != null && windowMax != null && max >= windowMin * (1 - slack) && min <= windowMax * (1 + slack);

  if (!overlap) {
    const d = distance.meters;
    result.reason = "distance_mismatch";
    result.neededDistance = d != null && d < min ? min : max;
    result.neededRange = { min, max };
    if (nearMiss) {
      result.nearest = true;
      result.score = 18;
      return result;
    }
    result.infeasible = true;
    result.score = 0;
    return result;
  }

  const mid = (min + max) / 2;
  const target = distance.meters != null ? distance.meters : (windowMin + windowMax) / 2;
  const span = Math.max(max - min, 0.15);
  const closeness = 1 - Math.min(Math.abs(target - mid) / span, 1);
  result.score = 70 + closeness * 30;

  if (throwIntent === "short_throw" && isShortProduct) {
    result.score = Math.max(result.score, 92);
  }

  return result;
}
