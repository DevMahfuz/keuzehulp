/**
 * Server-side Lightspeed eCom C-Series client.
 * Mirrors beamer-winkel-management-dashboard/lib/lightspeed.ts (auth, host, pagination).
 * Secrets stay in process.env — never sent to the browser.
 */
const LIGHTSPEED_PAGE_LIMIT = 250;
const LIGHTSPEED_PAGE_CONCURRENCY = 3;
const LIGHTSPEED_REQUEST_TIMEOUT_MS = 20_000;

function isLightspeedConfigured() {
  return Boolean(
    process.env.LIGHTSPEED_CLUSTER_ID?.trim() &&
      process.env.LIGHTSPEED_API_KEY?.trim() &&
      process.env.LIGHTSPEED_API_SECRET?.trim()
  );
}

function lightspeedConfigError() {
  const cluster = process.env.LIGHTSPEED_CLUSTER_ID;
  const key = process.env.LIGHTSPEED_API_KEY;
  const secret = process.env.LIGHTSPEED_API_SECRET;
  if (!cluster?.trim()) return "ontbrekende cluster-ID";
  if (!key?.trim()) return "ontbrekende API-key";
  if (!secret?.trim()) return "ontbrekend API-secret";
  return null;
}

function lightspeedApiOrigin(cluster = process.env.LIGHTSPEED_CLUSTER_ID ?? "") {
  const id = cluster.trim().toLowerCase();
  if (id.includes("shoplightspeed") || id === "us1") return "https://api.shoplightspeed.com";
  return "https://api.webshopapp.com";
}

function lightspeedRequestUrl(path, page, extraQuery) {
  const lang = process.env.LIGHTSPEED_LANGUAGE?.trim() || "nl";
  const url = new URL(`${lightspeedApiOrigin()}/${lang}/${path}.json`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(LIGHTSPEED_PAGE_LIMIT));
  if (extraQuery) {
    for (const [k, v] of Object.entries(extraQuery)) url.searchParams.set(k, v);
  }
  return url;
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function lightspeedFetch(path, page = 1, extraQuery) {
  const missing = lightspeedConfigError();
  if (missing) throw new Error(missing);
  const url = lightspeedRequestUrl(path, page, extraQuery);
  const key = process.env.LIGHTSPEED_API_KEY.trim();
  const secret = process.env.LIGHTSPEED_API_SECRET.trim();
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  let attempt = 0;
  while (true) {
    attempt += 1;
    let res;
    try {
      res = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
        signal: AbortSignal.timeout(LIGHTSPEED_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (/timeout|aborted/i.test(msg)) throw new Error("timeout");
      throw new Error("Lightspeed-verbinding mislukt");
    }
    if (res.status === 429 || res.status >= 500) {
      if (attempt >= 5) throw new Error(`Lightspeed ${path} faalde na retries (${res.status})`);
      await sleep(500 * 2 ** attempt);
      continue;
    }
    if (!res.ok) throw new Error(`Lightspeed HTTP ${res.status}`);
    return res.json();
  }
}

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function str(v) {
  if (v == null) return null;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s || s === "[object Object]") return null;
    return s;
  }
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "object") {
    const rec = v;
    return str(rec.title) ?? str(rec.name) ?? str(rec.value);
  }
  return null;
}

function num(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function resourceId(value) {
  if (value == null || value === false) return null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return str(value);
  const rec = asRecord(value);
  return resourceId(rec.id) ?? resourceId(rec.resource);
}

function parseStockLevel(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const nested = asRecord(value);
    const n = num(value) ?? num(nested.stockLevel) ?? num(nested.level) ?? num(nested.stock);
    if (n != null) return Math.max(0, Math.floor(n));
    if (nested.available === false) return 0;
    if (nested.available === true) return 1;
  }
  return null;
}

function listFrom(json, keys) {
  const rec = asRecord(json);
  for (const key of keys) {
    const raw = rec[key];
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") return [raw];
  }
  return [];
}

module.exports = {
  LIGHTSPEED_PAGE_LIMIT,
  LIGHTSPEED_PAGE_CONCURRENCY,
  isLightspeedConfigured,
  lightspeedConfigError,
  lightspeedApiOrigin,
  lightspeedFetch,
  asRecord,
  str,
  num,
  resourceId,
  parseStockLevel,
  listFrom,
};
