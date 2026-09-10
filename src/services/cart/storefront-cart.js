import { cartAddPath } from "./validate";

export const CART_JSON_PATH = "/cart/?format=json";
export const CART_NOT_VERIFIED = "cart_not_verified";

export const CART_POST_HEADERS = {
  Accept: "*/*",
  "X-Requested-With": "XMLHttpRequest",
};

export function cartAddRequestUrl(variantId, quantity) {
  return `${cartAddPath(variantId)}?quantity=${encodeURIComponent(String(quantity))}`;
}

export function isCartPostHttpOk(status, type) {
  if (type === "opaqueredirect" || type === "opaque" || type === "error") return false;
  return status >= 200 && status < 300;
}

export function parseCartProducts(data) {
  if (data === null || data === undefined) return null;
  if (typeof data !== "object") return null;
  const cart = data.cart;
  if (cart === false || cart === null || cart === undefined) return [];
  if (typeof cart !== "object") return null;
  const products = cart.products;
  if (products === false || products === null || products === undefined) return [];
  const list = collectProducts(products);
  if (list === null) return null;
  return list.map(toSnapshot);
}

export function cartQuantityCount(lines) {
  return lines.reduce((sum, line) => sum + (line.quantity > 0 ? line.quantity : 0), 0);
}

export function findCartLine(lines, variantId, sku) {
  const vid = variantId.trim();
  const byVid = lines.find((line) => line.vid === vid);
  if (byVid) return byVid;
  const wantedSku = sku?.trim();
  if (!wantedSku) return undefined;
  return lines.find((line) => line.sku === wantedSku);
}

export function verifyCartAdd(input) {
  const afterLines = parseCartProducts(input.after);
  if (afterLines === null) {
    return { verified: false, itemFound: false, countBefore: 0, countAfter: 0 };
  }
  const beforeLines = parseCartProducts(input.before) ?? [];
  const countBefore = cartQuantityCount(beforeLines);
  const countAfter = cartQuantityCount(afterLines);
  const matched = findCartLine(afterLines, input.variantId, input.sku);
  if (matched) {
    return { verified: true, itemFound: true, countBefore, countAfter, matched };
  }
  const afterHasVid = afterLines.some((line) => Boolean(line.vid));
  if (afterHasVid) {
    return { verified: false, itemFound: false, countBefore, countAfter };
  }
  const countIncreased = countAfter > countBefore;
  return { verified: countIncreased, itemFound: false, countBefore, countAfter };
}

export function refreshLightspeedCartUi(host = typeof window !== "undefined" ? window : undefined) {
  if (host && typeof host.updateCartAjax === "function") host.updateCartAjax();
}

function collectProducts(products) {
  if (Array.isArray(products)) return products;
  if (typeof products === "object") return Object.values(products);
  return null;
}

function toSnapshot(value) {
  if (!value || typeof value !== "object") return { quantity: 0 };
  const quantity = Number(value.quantity);
  return {
    vid: value.vid !== undefined && value.vid !== null ? String(value.vid) : undefined,
    sku: typeof value.sku === "string" ? value.sku : undefined,
    title: typeof value.title === "string" ? value.title : undefined,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 0,
  };
}
