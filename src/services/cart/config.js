export const SHOP_ORIGIN = "https://www.beamer-winkel.nl";
export const CART_PATH = "/cart/";
export const MAX_WIDGET_QUANTITY = 10;

export function getCartMode() {
  const mode = process.env.REACT_APP_CART_MODE || "";
  if (mode === "disabled") return "disabled";
  if (mode === "storefront" || mode === "lightspeed") return "storefront";
  return process.env.NODE_ENV === "production" ? "storefront" : "disabled";
}

export function getShopOrigin() {
  return (process.env.REACT_APP_SHOP_ORIGIN || SHOP_ORIGIN).replace(/\/$/, "");
}

export function getWidgetOrigin() {
  const value = (process.env.REACT_APP_WIDGET_ORIGIN || "").trim();
  return value ? value.replace(/\/$/, "") : undefined;
}

export function getCartPageUrl() {
  return `${getShopOrigin()}${CART_PATH}`;
}

export function trustedOrigins() {
  const origins = [getShopOrigin()];
  const widget = getWidgetOrigin();
  if (widget) origins.push(widget);
  return origins;
}
