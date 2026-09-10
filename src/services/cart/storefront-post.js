import { CART_FAIL_MESSAGE } from "./types";
import { CART_MESSAGE_SOURCE } from "./post-message";
import {
  CART_JSON_PATH,
  CART_NOT_VERIFIED,
  CART_POST_HEADERS,
  cartAddRequestUrl,
  isCartPostHttpOk,
  refreshLightspeedCartUi,
  verifyCartAdd,
} from "./storefront-cart";

export async function postCartAdd(variantId, quantity, fetchImpl = fetch) {
  const url = cartAddRequestUrl(variantId, quantity);
  try {
    const before = await fetchCartJson(fetchImpl);
    const response = await fetchImpl(url, {
      method: "POST",
      credentials: "include",
      headers: { ...CART_POST_HEADERS },
      redirect: "follow",
    });
    if (!isCartPostHttpOk(response.status, response.type)) {
      return {
        ok: false,
        error: `Lightspeed cart weigerde de actie (${response.status}).`,
      };
    }
    const after = await fetchCartJson(fetchImpl);
    const check = verifyCartAdd({ before, after, variantId });
    if (!check.verified) {
      return {
        ok: false,
        error: CART_FAIL_MESSAGE,
        reason: CART_NOT_VERIFIED,
        verification: check,
      };
    }
    refreshLightspeedCartUi();
    return { ok: true, verification: check };
  } catch {
    return { ok: false, error: "Netwerkfout bij toevoegen aan winkelwagen." };
  }
}

async function fetchCartJson(fetchImpl) {
  try {
    const response = await fetchImpl(CART_JSON_PATH, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function resultMessage(requestId, success, error, reason) {
  return {
    source: CART_MESSAGE_SOURCE,
    type: "ADD_TO_CART_RESULT",
    requestId,
    success,
    ok: success,
    error,
    reason,
  };
}
