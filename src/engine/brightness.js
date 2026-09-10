import { getTargetSizeInches } from "./throwFit";

const BASE_LUMENS = {
  dark: 1400,
  some: 2300,
  lots: 3200,
  bright: 4200,
};

export function requiredAnsiLumens(answers) {
  const light = answers.ambientLight || "some";
  const size = getTargetSizeInches(answers.screenSize);
  const base = BASE_LUMENS[light] ?? BASE_LUMENS.some;
  const sizeFactor = Math.max(0.85, size / 110);
  let need = base * sizeFactor;
  if (answers.usage === "outdoor" || answers.usage === "sport") need *= 1.15;
  if (answers.usage === "office") need *= 1.08;
  if (answers.priority === "brightness") need *= 1.1;
  return Math.round(need);
}

export function evaluateBrightness(product, answers, options = {}) {
  const need = requiredAnsiLumens(answers);
  const haveAnsi = product.brightnessAnsi;
  const ledOnly = haveAnsi == null && product.brightnessLed != null;
  const have = haveAnsi != null ? haveAnsi : null;

  if (have == null) {
    if (ledOnly) {
      return { need, have: product.brightnessLed, unit: "led", score: 36, infeasible: false, uncertain: true, ledLumens: true };
    }
    return { need, have: null, score: 40, infeasible: false, uncertain: true };
  }

  const ratio = have / need;
  const dark = answers.ambientLight === "dark";
  if (ratio < 0.55 && (answers.ambientLight === "lots" || answers.ambientLight === "bright")) {
    if (options.nearMiss) {
      return { need, have, score: 20, infeasible: false, dim: true, nearest: true };
    }
    return { need, have, score: 12, infeasible: true, dim: true };
  }
  if (ratio < 0.45) {
    return { need, have, score: 18, infeasible: false, dim: true };
  }
  if (dark) {
    const venue = Boolean(product.specSignals?.largeVenue || product.specSignals?.business);
    if (ratio < 0.7) return { need, have, score: 58, dim: true };
    if (ratio <= 1.6) return { need, have, score: 100 };
    if (ratio <= 2.4) return { need, have, score: venue ? 52 : 70, oversized: ratio > 2 };
    if (ratio <= 3.5) return { need, have, score: venue ? 32 : 48, oversized: true };
    return { need, have, score: venue ? 18 : 28, oversized: true };
  }
  if (ratio < 0.75) return { need, have, score: 48, dim: true };
  if (ratio < 1) return { need, have, score: 72 };
  if (ratio < 1.35) return { need, have, score: 100 };
  if (ratio < 1.8) return { need, have, score: 90 };
  return { need, have, score: 70, oversized: true };
}
