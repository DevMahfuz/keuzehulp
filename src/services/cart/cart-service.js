import { CONFIG_REQUIRED_MESSAGE, resolveCartVariantId } from "./addability";
import { resolveCartPageUrl } from "./storefront";
import { CART_FAIL_MESSAGE, CART_SUCCESS_MESSAGE } from "./types";
import { normalizeQuantity } from "./validate";

const DEFAULT_QUANTITY = 1;

export class LightspeedCartService {
  constructor(transport) {
    this.transport = transport;
  }

  async addItems(items) {
    if (!items?.length) {
      return { ok: false, addedSkus: [], code: "missing_ids", message: CART_FAIL_MESSAGE };
    }
    const item = items[0];
    const quantity = normalizeQuantity(item.quantity ?? DEFAULT_QUANTITY);
    if (quantity === undefined) {
      return { ok: false, addedSkus: [], code: "provider_error", message: CART_FAIL_MESSAGE };
    }
    const variantId = resolveCartVariantId({
      vid: item.lightspeedVariantId,
      productId: item.lightspeedProductId,
    });
    if (!variantId) {
      return { ok: false, addedSkus: [], code: "missing_ids", message: CART_FAIL_MESSAGE };
    }
    if (item.requiresConfiguration) {
      return { ok: false, addedSkus: [], code: "requires_configuration", message: CONFIG_REQUIRED_MESSAGE };
    }
    const posted = await this.transport.addItem(variantId, quantity);
    const cartUrl = resolveCartPageUrl(
      typeof window !== "undefined" ? window.location.origin : undefined,
      typeof window !== "undefined" ? window.location.hostname : undefined
    );
    if (!posted.ok) {
      const code = posted.reason === "cart_not_verified" ? "cart_not_verified" : "provider_error";
      return {
        ok: false,
        addedSkus: [],
        code,
        cartUrl,
        message: posted.error ?? CART_FAIL_MESSAGE,
        verification: posted.verification,
      };
    }
    return {
      ok: true,
      addedSkus: [item.sku].filter(Boolean),
      cartUrl,
      message: CART_SUCCESS_MESSAGE,
      verification: posted.verification,
    };
  }
}

export class DisabledCartService {
  async addItems() {
    return {
      ok: false,
      addedSkus: [],
      code: "disabled",
      message:
        "Winkelwagen is hier uitgeschakeld. Open het product in de webshop om het toe te voegen.",
    };
  }
}
