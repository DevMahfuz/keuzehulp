import { getCartPageUrl, getShopOrigin } from "./config";

export function isShopHostname(hostname) {
  return hostname === "www.beamer-winkel.nl" || hostname === "beamer-winkel.nl";
}

export function resolveCartPageUrl(origin, hostname) {
  if (hostname && isShopHostname(hostname) && origin) {
    return `${origin.replace(/\/$/, "")}/cart/`;
  }
  return getCartPageUrl();
}

export function shopOriginFromLocation(origin, hostname) {
  if (isShopHostname(hostname)) return origin.replace(/\/$/, "");
  return getShopOrigin();
}
