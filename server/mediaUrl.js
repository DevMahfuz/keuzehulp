const SHOP_ORIGIN = "https://www.beamer-winkel.nl";

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() && value !== "[object Object]") {
      return value.trim();
    }
  }
  return "";
}

/** Turn Lightspeed/CDN paths into a browser-loadable https URL. */
function absoluteAssetUrl(value, origin = process.env.REACT_APP_SHOP_ORIGIN || process.env.SHOP_ORIGIN || SHOP_ORIGIN) {
  const raw = firstString(value);
  if (!raw) return "";
  if (/^data:image\//i.test(raw)) return raw;
  let url = raw.replace(/\\/g, "/").trim();
  if (url.startsWith("//")) url = `https:${url}`;
  if (/^https?:\/\//i.test(url)) {
    if (url.startsWith("http://")) url = `https://${url.slice(7)}`;
    return url;
  }
  const base = String(origin || SHOP_ORIGIN).replace(/\/$/, "");
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function collectImageCandidates(raw) {
  const out = [];
  const push = (v) => {
    if (!v) return;
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(push);
    else if (typeof v === "object") {
      push(v.src);
      push(v.thumb);
      push(v.url);
      push(v.image);
      push(v.http);
      push(v.https);
    }
  };
  push(raw.imageUrl);
  push(raw.image_url);
  push(raw.image);
  push(raw.images);
  push(asRecord(raw.images).image);
  push(raw.thumb);
  push(raw.thumbnail);
  return out;
}

function pickLightspeedImage(raw, origin) {
  for (const candidate of collectImageCandidates(raw || {})) {
    const url = absoluteAssetUrl(candidate, origin);
    if (url) return url;
  }
  return "";
}

function absoluteProductUrl(value, origin = process.env.REACT_APP_SHOP_ORIGIN || process.env.SHOP_ORIGIN || SHOP_ORIGIN) {
  return absoluteAssetUrl(value, origin);
}

module.exports = {
  SHOP_ORIGIN,
  absoluteAssetUrl,
  pickLightspeedImage,
  absoluteProductUrl,
};
