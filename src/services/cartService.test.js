import { addToCart, cartStatusMessage, lightspeedCartAddUrl } from "../services/cartService";
import { assessProductAddability, productToCartLine } from "../services/cart/product-map";
import { postCartAdd } from "../services/cart/storefront-post";
import {
  CART_JSON_PATH,
  cartAddRequestUrl,
  cartQuantityCount,
  isCartPostHttpOk,
  parseCartProducts,
  refreshLightspeedCartUi,
  verifyCartAdd,
} from "../services/cart/storefront-cart";
import { cartAddPath, isValidVariantId, normalizeQuantity } from "../services/cart/validate";
import { CART_FAIL_MESSAGE } from "../services/cart/types";
import { resolveCartVariantId } from "../services/cart/addability";
import { createBrowserCartTransport } from "../services/cart/browser-bridge";

const VID = "320204914";
const product = {
  id: "108626710",
  productId: "108626710",
  variantId: VID,
  sku: "AIR",
  available: true,
  stock: 3,
  isMock: false,
  variantCount: 1,
};

function emptyCart() {
  return { cart: false };
}

function cartWithVid(vid, quantity = 1) {
  return {
    cart: {
      products: {
        line1: { vid: Number(vid), quantity, sku: "AIR", title: "Lumenix AIR" },
      },
    },
  };
}

function jsonResponse(data) {
  return {
    ok: true,
    status: 200,
    type: "basic",
    url: CART_JSON_PATH,
    json: async () => data,
  };
}

function mockShopLocation() {
  delete window.location;
  window.location = {
    hostname: "www.beamer-winkel.nl",
    origin: "https://www.beamer-winkel.nl",
    href: "https://www.beamer-winkel.nl/keuzehulp",
    assign: jest.fn(),
  };
}

beforeEach(() => {
  delete window.location;
  window.location = {
    hostname: "localhost",
    origin: "http://localhost:3006",
    href: "http://localhost:3006/",
    assign: jest.fn(),
  };
  delete window.updateCartAjax;
  delete window.BeamerWinkelCart;
  global.fetch = jest.fn();
});

test("cart add URL volgt Lightspeed-formulier met trailing slash en quantity", () => {
  expect(cartAddPath(VID)).toBe(`/cart/add/${VID}/`);
  expect(cartAddRequestUrl(VID, 1)).toBe(`/cart/add/${VID}/?quantity=1`);
  expect(cartAddRequestUrl(VID, 2)).toBe(`/cart/add/${VID}/?quantity=2`);
  expect(lightspeedCartAddUrl({ variantId: "99", id: "1" }, 2)).toBe(
    "https://www.beamer-winkel.nl/cart/add/99/?quantity=2"
  );
});

test("ongeldige of ontbrekende variant", () => {
  expect(isValidVariantId("")).toBe(false);
  expect(resolveCartVariantId({ variantId: "108626710", productId: "108626710" })).toBeUndefined();
  expect(cartStatusMessage("no_variant")).toBe(CART_FAIL_MESSAGE);
});

test("quantity 1 tot 10", () => {
  expect(normalizeQuantity(1)).toBe(1);
  expect(normalizeQuantity(10)).toBe(10);
  expect(normalizeQuantity(0)).toBeUndefined();
  expect(normalizeQuantity(11)).toBeUndefined();
});

test("uitverkocht: geen POST", async () => {
  const result = await addToCart({ ...product, stock: 0, available: false });
  expect(result.ok).toBe(false);
  expect(result.status).toBe("out_of_stock");
  expect(global.fetch).not.toHaveBeenCalled();
});

test("multi-variant vereist configuratie, geen default-add", async () => {
  const multi = { ...product, variantCount: 3 };
  const addability = assessProductAddability(multi);
  expect(addability.canAddDirectly).toBe(false);
  expect(productToCartLine(multi).requiresConfiguration).toBe(true);
  const result = await addToCart(multi);
  expect(result.ok).toBe(false);
  expect(result.status).toBe("requires_configuration");
  expect(global.fetch).not.toHaveBeenCalled();
});

test("HTTP 2xx is geen cart-succes op zich", () => {
  expect(isCartPostHttpOk(200)).toBe(true);
  expect(isCartPostHttpOk(302)).toBe(false);
  expect(isCartPostHttpOk(0, "opaqueredirect")).toBe(false);
});

test("cart item present → verificatie success en count stijgt", () => {
  const check = verifyCartAdd({
    before: emptyCart(),
    after: cartWithVid(VID),
    variantId: VID,
  });
  expect(check.verified).toBe(true);
  expect(check.itemFound).toBe(true);
  expect(check.countBefore).toBe(0);
  expect(check.countAfter).toBe(1);
  expect(cartQuantityCount(parseCartProducts(cartWithVid(VID, 2)))).toBe(2);
});

test("verkeerde vid of ongewijzigde cart → verificatie mislukt", () => {
  expect(verifyCartAdd({ before: emptyCart(), after: emptyCart(), variantId: VID }).verified).toBe(false);
  expect(verifyCartAdd({ before: emptyCart(), after: cartWithVid("999"), variantId: VID }).verified).toBe(false);
});

test("POST 200 zonder verificatie is failure", async () => {
  const fetchImpl = jest.fn(async (input, init) => {
    const url = String(input);
    if (url.includes("/cart/?format=json")) return jsonResponse(emptyCart());
    if (url.includes("/cart/add/") && init?.method === "POST") {
      return { ok: true, status: 200, type: "basic", url };
    }
    throw new Error(url);
  });
  const result = await postCartAdd(VID, 1, fetchImpl);
  expect(result.ok).toBe(false);
  expect(result.reason).toBe("cart_not_verified");
});

test("POST fout", async () => {
  const fetchImpl = jest.fn(async (input, init) => {
    const url = String(input);
    if (url.includes("/cart/?format=json")) return jsonResponse(emptyCart());
    if (init?.method === "POST") return { ok: false, status: 500, type: "basic", url };
    throw new Error(url);
  });
  const result = await postCartAdd(VID, 1, fetchImpl);
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/500/);
});

test("juiste variant in cart + updateCartAjax", async () => {
  const ajax = jest.fn();
  window.updateCartAjax = ajax;
  let cart = emptyCart();
  const fetchImpl = jest.fn(async (input, init) => {
    const url = String(input);
    if (url.includes("/cart/?format=json")) return jsonResponse(cart);
    if (url.includes(`/cart/add/${VID}/`) && init?.method === "POST") {
      expect(init.body).toBeUndefined();
      expect(init.credentials).toBe("include");
      expect(init.headers["X-Requested-With"]).toBe("XMLHttpRequest");
      cart = cartWithVid(VID);
      return { ok: true, status: 200, type: "basic", url, redirected: true };
    }
    throw new Error(url);
  });
  const result = await postCartAdd(VID, 1, fetchImpl);
  expect(result.ok).toBe(true);
  expect(result.verification.itemFound).toBe(true);
  expect(ajax).toHaveBeenCalled();
  refreshLightspeedCartUi();
  expect(ajax).toHaveBeenCalledTimes(2);
});

test("localhost/external blokkeert echte cart zonder fake success", async () => {
  const transport = createBrowserCartTransport();
  const result = await transport.addItem(VID, 1);
  expect(result.ok).toBe(false);
  expect(result.reason).toBe("not_storefront");
  expect(window.location.assign).not.toHaveBeenCalled();
  const added = await addToCart(product);
  expect(added.ok).toBe(false);
});

test("storefront hostname gebruikt POST+JSON verificatie", async () => {
  mockShopLocation();
  let cart = emptyCart();
  global.fetch = jest.fn(async (input, init) => {
    const url = String(input);
    if (url.includes("/cart/?format=json")) return jsonResponse(cart);
    if (url.includes(`/cart/add/${VID}/`) && init?.method === "POST") {
      cart = cartWithVid(VID);
      return { ok: true, status: 200, type: "basic", url };
    }
    throw new Error(url);
  });
  const result = await addToCart(product);
  expect(result.ok).toBe(true);
  expect(result.status).toBe("added");
});
