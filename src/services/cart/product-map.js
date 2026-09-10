import { assessAddability, CONFIG_REQUIRED_MESSAGE, resolveCartVariantId } from "./addability";

export function isProductSellable(product) {
  if (!product) return false;
  if (product.sellable === false || product.isVisible === false) return false;
  if (product.available === false || product.stock === 0) return false;
  if (product.isMock || String(product.id || "").startsWith("mock-")) return false;
  return true;
}

export function productCartKind(product) {
  if (product?.category === "screen" || product?.productKind === "projection_screen") return "screen";
  if (product?.productKind === "projector" || product?.category === "projector") return "projector";
  if (product?.productKind === "accessory" || product?.category === "accessory") return "accessory";
  return "other";
}

export function assessProductAddability(product) {
  if (!isProductSellable(product)) {
    return {
      canAddDirectly: false,
      reason: "out_of_stock",
      debug: { canAddDirectly: false, requiresConfiguration: false, reason: "out_of_stock" },
    };
  }
  const productId = product.productId || product.id;
  const variantId = product.variantId;
  if (Number(product.variantCount) > 1) {
    return {
      canAddDirectly: false,
      reason: CONFIG_REQUIRED_MESSAGE,
      debug: {
        productId,
        vid: resolveCartVariantId({ vid: variantId, productId }),
        numberOfVariants: Number(product.variantCount),
        requiresConfiguration: true,
        canAddDirectly: false,
        reason: "multiple_variants_unselected",
      },
    };
  }
  return assessAddability({
    productId,
    variantId,
    selectedVariantId: variantId,
  });
}

export function productToCartLine(product, quantity = 1) {
  const addability = assessProductAddability(product);
  const productId = product.productId || product.id;
  return {
    sku: product.sku || "",
    quantity,
    lightspeedProductId: productId != null ? String(productId) : undefined,
    lightspeedVariantId: product.variantId != null ? String(product.variantId) : undefined,
    productUrl: product.productUrl,
    productKind: productCartKind(product),
    requiresConfiguration: !addability.canAddDirectly && addability.debug?.reason !== "out_of_stock",
    addability,
  };
}
