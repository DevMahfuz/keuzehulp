export function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return "Prijs op aanvraag";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatMeters(value) {
  if (value == null || Number.isNaN(Number(value))) return "onbekend";
  return `${Number(value).toLocaleString("nl-NL", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })} m`;
}

export function formatRange(min, max, unit = "m") {
  if (min == null && max == null) return "Onbekend";
  if (min != null && max != null && min !== max) {
    return `${Number(min).toLocaleString("nl-NL", { maximumFractionDigits: 1 })}–${Number(max).toLocaleString("nl-NL", { maximumFractionDigits: 1 })} ${unit}`;
  }
  const v = min ?? max;
  return `${Number(v).toLocaleString("nl-NL", { maximumFractionDigits: 1 })} ${unit}`;
}

export function formatPercent(score) {
  return `${Math.round(score)}%`;
}

export function inchHint(inches) {
  if (!inches) return "";
  const width = (inches * 0.0254 * 16) / Math.hypot(16, 9);
  return `±${inches} inch · ca. ${width.toFixed(1)} m breed`;
}
