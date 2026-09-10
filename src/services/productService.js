import { fromLightspeedList } from "./lightspeedAdapter";

export function getProductApiUrl() {
  return process.env.REACT_APP_PRODUCT_API_URL || "/api/products";
}

/**
 * Loads catalog from the same-origin proxy (or REACT_APP_PRODUCT_API_URL).
 * Never call Lightspeed with secrets from the browser.
 * Does not present mock products as live shop inventory.
 */
export async function loadCatalog() {
  const url = getProductApiUrl();
  const started = typeof performance !== "undefined" ? performance.now() : Date.now();
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        products: [],
        source: "error",
        error: "catalog_unavailable",
        usingMock: false,
        loadMs: (typeof performance !== "undefined" ? performance.now() : Date.now()) - started,
      };
    }
    const hydrateStarted = typeof performance !== "undefined" ? performance.now() : Date.now();
    const products = fromLightspeedList(json).filter((p) => !p.isMock);
    const hydrateMs = (typeof performance !== "undefined" ? performance.now() : Date.now()) - hydrateStarted;
    if (!products.length) {
      return {
        products: [],
        source: json.source || "api",
        error: "catalog_empty",
        usingMock: false,
        hydrateMs,
        loadMs: (typeof performance !== "undefined" ? performance.now() : Date.now()) - started,
        meta: json.meta || null,
      };
    }
    return {
      products,
      source: json.source || "api",
      error: null,
      usingMock: false,
      hydrateMs,
      loadMs: (typeof performance !== "undefined" ? performance.now() : Date.now()) - started,
      meta: json.meta || null,
    };
  } catch {
    return {
      products: [],
      source: "error",
      error: "catalog_unavailable",
      usingMock: false,
      loadMs: (typeof performance !== "undefined" ? performance.now() : Date.now()) - started,
    };
  }
}
