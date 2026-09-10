import { MAX_WIDGET_QUANTITY, trustedOrigins } from "./config";

const VARIANT_ID_PATTERN = /^\d{1,16}$/;

export function normalizeVariantId(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value < 0) return undefined;
    return normalizeVariantId(String(value));
  }
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!VARIANT_ID_PATTERN.test(trimmed)) return undefined;
  return trimmed;
}

export function isValidVariantId(value) {
  return normalizeVariantId(value) !== undefined;
}

export function normalizeQuantity(value) {
  if (typeof value === "string" && value.trim() !== "") {
    if (!/^\d+$/.test(value.trim())) return undefined;
    return normalizeQuantity(Number(value.trim()));
  }
  if (typeof value !== "number" || !Number.isInteger(value)) return undefined;
  if (value < 1 || value > MAX_WIDGET_QUANTITY) return undefined;
  return value;
}

export function isTrustedOrigin(origin, allowed = trustedOrigins()) {
  if (!origin) return false;
  return allowed.includes(origin.replace(/\/$/, ""));
}

export function cartAddPath(variantId) {
  const vid = normalizeVariantId(variantId);
  if (!vid) throw new Error("Ongeldige variant-ID.");
  return `/cart/add/${vid}/`;
}
