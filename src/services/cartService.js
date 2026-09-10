import { createBrowserCartService } from "./cart/browser-bridge";
import { getCartMode, getShopOrigin } from "./cart/config";
import { cartAddRequestUrl } from "./cart/storefront-cart";
import { CART_FAIL_MESSAGE } from "./cart/types";
import { isProductSellable, productToCartLine } from "./cart/product-map";
import { normalizeVariantId } from "./cart/validate";

export { createBrowserCartService } from "./cart/browser-bridge";
export { installParentCartBridge } from "./cart/browser-bridge";
export { assessProductAddability, isProductSellable, productToCartLine } from "./cart/product-map";
export { getCartPageUrl, getCartMode, getShopOrigin } from "./cart/config";
export { cartAddRequestUrl } from "./cart/storefront-cart";
export { CART_FAIL_MESSAGE, CART_SUCCESS_MESSAGE, CART_BLOCKED_MESSAGE } from "./cart/types";
export { CONFIG_REQUIRED_MESSAGE } from "./cart/addability";

export function isCartConfigured() {
  return getCartMode() !== "disabled";
}

export function lightspeedCartAddUrl(product, quantity = 1) {
  const vid = normalizeVariantId(product.variantId);
  if (!vid) return "";
  return `${getShopOrigin()}${cartAddRequestUrl(vid, quantity)}`;
}

export async function addToCart(product, quantity = 1) {
  if (!product) return { ok: false, status: "no_product", message: CART_FAIL_MESSAGE };
  if (!isProductSellable(product)) {
    return { ok: false, status: "out_of_stock", message: "Dit product is niet op voorraad." };
  }
  const line = productToCartLine(product, quantity);
  if (line.addability.debug?.reason === "missing_variant_id" || !line.lightspeedVariantId) {
    return { ok: false, status: "no_variant", message: CART_FAIL_MESSAGE };
  }
  if (line.requiresConfiguration) {
    return {
      ok: false,
      status: "requires_configuration",
      message: line.addability.reason,
    };
  }
  const result = await createBrowserCartService().addItems([line]);
  return {
    ok: result.ok === true,
    status: result.ok ? "added" : result.code || "provider_error",
    message: result.message,
    cartUrl: result.cartUrl,
    verification: result.verification,
    code: result.code,
  };
}

export function cartStatusMessage(status) {
  if (status === "out_of_stock") return "Dit product is niet op voorraad.";
  if (status === "requires_configuration") {
    return "Dit product heeft nog een keuze nodig. Kies de uitvoering op de productpagina.";
  }
  if (status === "not_storefront" || status === "disabled") {
    return "Toevoegen aan de winkelwagen kan in de webshop.";
  }
  return CART_FAIL_MESSAGE;
}
