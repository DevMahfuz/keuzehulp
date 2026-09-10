import { CART_FAIL_MESSAGE } from "./types";
import { normalizeQuantity, normalizeVariantId } from "./validate";

/** Zelfde source als beamerwinkel-ai-chat, zodat de bestaande parent-bridge blijft werken. */
export const CART_MESSAGE_SOURCE = "beamerwinkel-ai";

export function createAddToCartRequest(requestId, variantId, quantity) {
  const vid = normalizeVariantId(variantId);
  const qty = normalizeQuantity(quantity ?? 1);
  if (!vid || qty === undefined || typeof requestId !== "string") return undefined;
  return {
    source: CART_MESSAGE_SOURCE,
    type: "ADD_TO_CART",
    requestId,
    variantId: vid,
    quantity: qty,
  };
}

export function isAddToCartResult(data) {
  if (!data || typeof data !== "object") return false;
  return (
    data.source === CART_MESSAGE_SOURCE &&
    data.type === "ADD_TO_CART_RESULT" &&
    typeof data.requestId === "string" &&
    typeof data.success === "boolean"
  );
}

export function parentCartResultToTransport(data, expectedRequestId) {
  if (!isAddToCartResult(data)) return "ignore";
  if (data.requestId !== expectedRequestId) return "ignore";
  if (data.success !== true) {
    return {
      ok: false,
      error: data.error ?? data.reason ?? CART_FAIL_MESSAGE,
      reason: data.reason,
    };
  }
  return { ok: true };
}

export function createRequestId() {
  return `kh-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
