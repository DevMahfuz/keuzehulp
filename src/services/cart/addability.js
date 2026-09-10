export const CONFIG_REQUIRED_MESSAGE =
  "Dit product heeft nog een keuze nodig. Kies de uitvoering op de productpagina.";

const VARIANT_ID_PATTERN = /^\d{1,16}$/;

export function resolveCartVariantId(input) {
  const productId = validVid(input.productId);
  for (const candidate of [input.vid, input.variantId, input.id]) {
    const vid = validVid(candidate);
    if (vid && vid !== productId) return vid;
  }
  return undefined;
}

export function assessAddability(input) {
  const sellable = listSellableVariants(input.variants, input.productId);
  const implicitVid = resolveCartVariantId({
    vid: input.variantId,
    productId: input.productId,
  });
  const selectedVid =
    resolveCartVariantId({
      vid: input.selectedVariantId,
      productId: input.productId,
    }) ?? implicitVid;
  const numberOfVariants = sellable.length > 0 ? sellable.length : implicitVid ? 1 : 0;
  const hasRequiredOptions = detectRequiredOptions(input.options) || detectRequiredOptions(input.matrix);
  const hasRequiredCustomFields = detectRequiredCustomFields(input.custom);

  const debugBase = {
    productId: input.productId,
    vid: implicitVid,
    numberOfVariants,
    selectedVariantId: selectedVid,
    hasRequiredOptions,
    hasRequiredCustomFields,
  };

  if (hasRequiredCustomFields) return blocked(debugBase, "required_custom_fields");
  if (!selectedVid) {
    return blocked(debugBase, numberOfVariants > 1 ? "multiple_variants_unselected" : "missing_variant_id");
  }
  if (sellable.length > 1) {
    const matches = sellable.filter((variant) => variant === selectedVid);
    if (matches.length !== 1) return blocked(debugBase, "multiple_variants_unselected");
  }
  return allowed(debugBase);
}

export function detectRequiredOptions(value) {
  if (value === true) return true;
  if (!value || value === false) return false;
  const groups = asRecordList(value);
  if (!groups) return false;
  for (const group of groups) {
    if (hasRequiredFlag(group)) return true;
    if (countEntries(group.values) > 1) return true;
  }
  return false;
}

export function detectRequiredCustomFields(value) {
  if (value === true) return true;
  if (!value || value === false) return false;
  const fields = asRecordList(value);
  if (!fields) return false;
  return fields.some((field) => hasRequiredFlag(field));
}

export function listSellableVariants(value, productId) {
  if (!value || value === false) return [];
  const list = Array.isArray(value) ? value : typeof value === "object" ? Object.values(value) : [];
  const ids = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    if (item.available === false || item.stock?.available === false) continue;
    const id = resolveCartVariantId({
      variantId: item.variantId,
      vid: item.vid,
      id: item.id,
      productId,
    });
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

function validVid(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return String(value);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return VARIANT_ID_PATTERN.test(trimmed) ? trimmed : undefined;
}

function blocked(debug, reasonCode) {
  const debugFull = { ...debug, requiresConfiguration: true, canAddDirectly: false, reason: reasonCode };
  return { canAddDirectly: false, reason: CONFIG_REQUIRED_MESSAGE, debug: debugFull };
}

function allowed(debug) {
  return {
    canAddDirectly: true,
    debug: { ...debug, requiresConfiguration: false, canAddDirectly: true },
  };
}

function asRecordList(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => Boolean(item) && typeof item === "object");
  }
  if (typeof value === "object") {
    return Object.values(value).filter((item) => Boolean(item) && typeof item === "object");
  }
  return undefined;
}

function hasRequiredFlag(value) {
  return value.required === true || value.required === 1 || value.required === "true";
}

function countEntries(value) {
  if (!value || value === false) return 0;
  if (Array.isArray(value)) return value.length;
  if (typeof value === "object") return Object.keys(value).length;
  return 0;
}
