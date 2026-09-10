const SHOP_ORIGIN = "https://www.beamer-winkel.nl";

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() && value !== "[object Object]") {
      return value.trim();
    }
  }
  return "";
}

export function absoluteAssetUrl(value, origin = process.env.REACT_APP_SHOP_ORIGIN || SHOP_ORIGIN) {
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
    }
  };
  push(raw.imageUrl);
  push(raw.image_url);
  push(raw.image);
  push(raw.images);
  push(asRecord(raw.images).image);
  push(raw.thumb);
  return out;
}

export function pickLightspeedImage(raw, origin) {
  for (const candidate of collectImageCandidates(raw || {})) {
    const url = absoluteAssetUrl(candidate, origin);
    if (url) return url;
  }
  return "";
}

const PLACEHOLDER_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" role="img" aria-label="Geen productafbeelding"><rect width="400" height="300" rx="16" fill="#f3f6f4"/><rect x="120" y="90" width="160" height="90" rx="10" fill="#d7e4dc" stroke="#1f9d63" stroke-width="3"/><circle cx="200" cy="135" r="18" fill="#ffffff" stroke="#1f9d63" stroke-width="3"/><rect x="155" y="188" width="90" height="10" rx="5" fill="#c5d4cb"/></svg>';

export const PRODUCT_IMAGE_FALLBACK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PLACEHOLDER_SVG)}`;
