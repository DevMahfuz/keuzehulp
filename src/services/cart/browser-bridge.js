import { DisabledCartService, LightspeedCartService } from "./cart-service";
import { getCartMode, getShopOrigin, trustedOrigins } from "./config";
import {
  CART_MESSAGE_SOURCE,
  createAddToCartRequest,
  createRequestId,
  parentCartResultToTransport,
} from "./post-message";
import { postCartAdd, resultMessage } from "./storefront-post";
import { isShopHostname } from "./storefront";
import { CART_BLOCKED_MESSAGE } from "./types";
import { isTrustedOrigin, normalizeQuantity, normalizeVariantId } from "./validate";

export const ADD_TIMEOUT_MS = 8000;

export function createBrowserCartService() {
  if (getCartMode() === "disabled") return new DisabledCartService();
  return new LightspeedCartService(createBrowserCartTransport());
}

export function createBrowserCartTransport() {
  return {
    async addItem(variantId, quantity) {
      if (typeof window === "undefined") {
        return { ok: false, error: CART_BLOCKED_MESSAGE };
      }
      if (window.BeamerWinkelCart?.storefront === true) {
        return window.BeamerWinkelCart.addItem({ variantId: String(variantId), quantity: Number(quantity) });
      }
      if (window.parent !== window) {
        return requestParentAdd(variantId, quantity);
      }
      if (isShopHostname(window.location.hostname)) {
        return postCartAdd(variantId, quantity);
      }
      return { ok: false, error: CART_BLOCKED_MESSAGE, reason: "not_storefront" };
    },
  };
}

export function installParentCartBridge(allowedOrigins = trustedOrigins()) {
  async function onMessage(event) {
    if (!isTrustedOrigin(event.origin, allowedOrigins)) return;
    const data = event.data;
    if (!data || data.source !== CART_MESSAGE_SOURCE || data.type !== "ADD_TO_CART") return;
    if (typeof data.requestId !== "string") return;
    const quantity = normalizeQuantity(data.quantity);
    const variantId = normalizeVariantId(data.variantId);
    if (!variantId || quantity === undefined) {
      replyToSource(event, resultMessage(data.requestId, false, "Ongeldige variant of hoeveelheid."));
      return;
    }
    const posted = await postCartAdd(variantId, quantity);
    replyToSource(event, resultMessage(data.requestId, posted.ok === true, posted.error, posted.reason));
  }

  window.addEventListener("message", onMessage);
  window.BeamerWinkelCart = {
    storefront: true,
    async addItem(input) {
      const quantity = normalizeQuantity(input.quantity ?? 1);
      const variantId = normalizeVariantId(input.variantId);
      if (!variantId || quantity === undefined) {
        return { ok: false, error: "Ongeldige variant of hoeveelheid." };
      }
      return postCartAdd(variantId, quantity);
    },
  };
  return () => window.removeEventListener("message", onMessage);
}

export function requestParentAdd(variantId, quantity, requestId = createRequestId()) {
  return new Promise((resolve) => {
    const shopOrigin = getShopOrigin();
    const message = createAddToCartRequest(requestId, variantId, quantity);
    if (!message) {
      resolve({ ok: false, error: "Ongeldige variant of hoeveelheid." });
      return;
    }
    const timer = window.setTimeout(() => {
      window.removeEventListener("message", onResult);
      resolve({ ok: false, error: "Geen antwoord van de Lightspeed-winkelwagen.", reason: "timeout" });
    }, ADD_TIMEOUT_MS);

    function onResult(event) {
      if (!isTrustedOrigin(event.origin, [shopOrigin])) return;
      const mapped = parentCartResultToTransport(event.data, requestId);
      if (mapped === "ignore") return;
      window.clearTimeout(timer);
      window.removeEventListener("message", onResult);
      resolve(mapped);
    }

    window.addEventListener("message", onResult);
    window.parent.postMessage(message, shopOrigin);
  });
}

function replyToSource(event, payload) {
  const source = event.source;
  if (!source) return;
  source.postMessage(payload, event.origin);
}
