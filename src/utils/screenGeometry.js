/** 16:9 screen geometry helpers used by throw-distance scoring. */

export const ASPECT_16_9 = 16 / 9;

export function inchesToMeters(inches) {
  return inches * 0.0254;
}

/** Image width in meters for a 16:9 diagonal in inches. */
export function diagonalInchesToWidthMeters(inches) {
  if (!inches) return null;
  return inchesToMeters(inches) * (16 / Math.hypot(16, 9));
}

export function widthMetersToDiagonalInches(widthMeters) {
  if (!widthMeters) return null;
  return (widthMeters * Math.hypot(16, 9)) / (16 * 0.0254);
}

export const SIZE_PRESETS = {
  up_to_100: { targetInches: 100, label: "tot 100 inch", widthMeters: 2.21 },
  "100_120": { targetInches: 110, label: "100–120 inch", widthMeters: 2.44 },
  "120_150": { targetInches: 135, label: "120–150 inch", widthMeters: 2.99 },
  over_150: { targetInches: 160, label: "groter dan 150 inch", widthMeters: 3.54 },
  unknown: { targetInches: 120, label: "ongeveer 120 inch", widthMeters: 2.65 },
};

export const DISTANCE_PRESETS = {
  wall: { meters: 0.35, min: 0.05, max: 0.55, needsUst: true },
  under_2: { meters: 1.4, min: 0.6, max: 2, needsUst: false },
  "2_3": { meters: 2.5, min: 2, max: 3, needsUst: false },
  "3_4": { meters: 3.5, min: 3, max: 4, needsUst: false },
  over_4: { meters: 5, min: 4, max: 8, needsUst: false },
  unknown: { meters: null, min: null, max: null, needsUst: false },
};

export const THROW_CLASS_THRESHOLDS = {
  ustMax: 0.4,
  shortMax: 1.0,
};

export function inferThrowClass({ throwRatioMin, throwRatioMax, ust, shortThrow }) {
  const max = throwRatioMax ?? throwRatioMin;
  const min = throwRatioMin ?? throwRatioMax;
  if (max != null && max <= THROW_CLASS_THRESHOLDS.ustMax) return "ust";
  if (ust && (max == null || max <= THROW_CLASS_THRESHOLDS.ustMax)) return "ust";
  if (max != null && max <= THROW_CLASS_THRESHOLDS.shortMax) return "short";
  if (shortThrow) return "short";
  if (min != null && min >= THROW_CLASS_THRESHOLDS.ustMax && min <= THROW_CLASS_THRESHOLDS.shortMax && max != null && max <= 1.4) {
    return "short";
  }
  return "standard";
}
