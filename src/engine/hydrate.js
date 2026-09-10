import { classifyProduct } from "./classify";
import { collectSourceText, dataQualityFromConfidence, parseProductSpecs } from "./parseSpecs";
import { createProduct } from "./productModel";
import { attachSegments } from "./segments";

function pick(explicit, parsed, confidenceKey, confidence) {
  if (explicit != null && explicit !== "") return explicit;
  if (parsed != null && parsed !== "") {
    if (confidenceKey) confidence[confidenceKey] = confidence[confidenceKey] || "inferred";
    return parsed;
  }
  return explicit ?? parsed ?? null;
}

function pickBool(explicit, parsed, key, confidence, parsedConf) {
  if (explicit === true) {
    confidence[key] = "confirmed";
    return true;
  }
  if (parsed === true) {
    confidence[key] = parsedConf[key] || "inferred";
    return true;
  }
  if (explicit === false && parsedConf[key] === "unknown") {
    confidence[key] = "unknown";
    return false;
  }
  confidence[key] = parsedConf[key] || (explicit == null ? "unknown" : "inferred");
  return Boolean(explicit ?? parsed);
}

export function hydrateProduct(partial = {}) {
  const sourceText = partial.sourceText || collectSourceText(partial);
  const parsed = parseProductSpecs(sourceText);
  const conf = { ...parsed.confidence };
  const v = parsed.values;

  const draft = {
    ...partial,
    sourceText,
    brightnessAnsi: pick(partial.brightnessAnsi, v.brightnessAnsi),
    resolution: pick(partial.resolution, v.resolution),
    nativeResolution: pick(partial.nativeResolution, v.nativeResolution || v.resolution),
    throwRatioMin: pick(partial.throwRatioMin, v.throwRatioMin),
    throwRatioMax: pick(partial.throwRatioMax, v.throwRatioMax),
    minThrowDistance: pick(partial.minThrowDistance, v.minThrowDistance),
    maxThrowDistance: pick(partial.maxThrowDistance, v.maxThrowDistance),
    technology: pick(partial.technology, v.technology),
    lightSource: pick(partial.lightSource, v.lightSource),
    inputLag: pick(partial.inputLag, v.inputLag),
    refreshRate: pick(partial.refreshRate, v.refreshRate),
    noiseLevel: pick(partial.noiseLevel, v.noiseLevel),
    sizeInches: pick(partial.sizeInches, v.sizeInches),
    gain: pick(partial.gain, v.gain),
    aspectRatio: pick(partial.aspectRatio, v.aspectRatio) || partial.aspectRatio,
    hdr: pickBool(partial.hdr, v.hdr, "hdr", conf, parsed.confidence),
    ust: pickBool(partial.ust, v.ust, "ust", conf, parsed.confidence),
    shortThrow: pickBool(partial.shortThrow, v.shortThrow, "shortThrow", conf, parsed.confidence),
    gaming: pickBool(partial.gaming, v.gaming, "gaming", conf, parsed.confidence),
    smart: pickBool(partial.smart, v.smart, "smart", conf, parsed.confidence),
    office: pickBool(partial.office, v.office, "office", conf, parsed.confidence),
    homeCinema: pickBool(partial.homeCinema, v.homeCinema, "homeCinema", conf, parsed.confidence),
    livingRoom: pickBool(partial.livingRoom, v.livingRoom, "livingRoom", conf, parsed.confidence),
    outdoor: pickBool(partial.outdoor, v.outdoor, "outdoor", conf, parsed.confidence),
    electric: pickBool(partial.electric, v.electric, "electric", conf, parsed.confidence),
    manual: pickBool(partial.manual, v.manual, "manual", conf, parsed.confidence),
    fixedFrame: pickBool(partial.fixedFrame, v.fixedFrame, "fixedFrame", conf, parsed.confidence),
    floorRising: pickBool(partial.floorRising, v.floorRising, "floorRising", conf, parsed.confidence),
    mobile: pickBool(partial.mobile, v.mobile, "mobile", conf, parsed.confidence),
    tensioned: pickBool(partial.tensioned, v.tensioned, "tensioned", conf, parsed.confidence),
    alr: pickBool(partial.alr, v.alr, "alr", conf, parsed.confidence),
    clr: pickBool(partial.clr, v.clr, "clr", conf, parsed.confidence),
  };

  draft.ustCompatible = pickBool(
    partial.ustCompatible,
    v.ustCompatible || draft.clr,
    "ustCompatible",
    conf,
    parsed.confidence
  );

  for (const key of ["ust", "shortThrow", "gaming", "smart", "homeCinema", "office", "livingRoom"]) {
    if (partial.specEnriched && typeof partial[key] === "boolean") {
      draft[key] = partial[key];
      if (partial.fieldConfidence?.[key]) conf[key] = partial.fieldConfidence[key];
    }
  }
  if (partial.specEnriched && partial.brightnessAnsi == null && partial.fieldConfidence?.brightnessAnsi === "unknown") {
    draft.brightnessAnsi = null;
    conf.brightnessAnsi = "unknown";
  }
  if (partial.throwClass) draft.throwClass = partial.throwClass;

  if (partial.brightnessAnsi != null) {
    conf.brightnessAnsi = partial.fieldConfidence?.brightnessAnsi || "confirmed";
  }
  if (partial.throwRatioMin != null || partial.throwRatioMax != null) {
    conf.throwRatio = partial.fieldConfidence?.throwRatio || "confirmed";
  }
  if (partial.resolution) conf.resolution = partial.fieldConfidence?.resolution || (conf.resolution === "unknown" ? "confirmed" : conf.resolution);
  if (partial.inputLag != null) conf.inputLag = partial.fieldConfidence?.inputLag || "confirmed";
  if (partial.noiseLevel != null) conf.noiseLevel = partial.fieldConfidence?.noiseLevel || conf.noiseLevel;
  if (partial.native4K) conf.native4K = "confirmed";

  const classified = classifyProduct(draft);
  draft.productKind = classified.productKind;
  if (partial.isMock) {
    draft.category = partial.category || classified.category;
    if (!draft.productKind && draft.category === "projector") draft.productKind = "projector";
  } else {
    draft.category = classified.category !== "unknown" ? classified.category : partial.category || "unknown";
  }

  if (draft.category !== "screen") {
    draft.ustCompatible = Boolean(partial.ustCompatible);
  }

  const product = attachSegments(
    createProduct({
      ...draft,
      fieldConfidence: conf,
      dataQuality: dataQualityFromConfidence(conf),
      classification: classified,
      productKind: draft.productKind || classified.productKind,
      sourceText,
      shopCategories: draft.shopCategories || draft.categories || [],
      specSignals: draft.specSignals,
      specSuitableFor: draft.specSuitableFor,
      specPlus: draft.specPlus,
      specMin: draft.specMin,
      specEnriched: draft.specEnriched,
      specMatchMethod: draft.specMatchMethod,
      specConflicts: draft.specConflicts,
      fieldSources: draft.fieldSources || partial.fieldSources,
      native4K: draft.native4K || partial.native4K,
      cinema4K: draft.cinema4K || partial.cinema4K,
      brightnessUnit: draft.brightnessUnit || partial.brightnessUnit,
      brightnessLed: draft.brightnessLed ?? partial.brightnessLed,
      minScreenInches: draft.minScreenInches ?? partial.minScreenInches,
      maxScreenInches: draft.maxScreenInches ?? partial.maxScreenInches,
      weightKg: draft.weightKg ?? partial.weightKg,
      lampHours: draft.lampHours ?? partial.lampHours,
      smartBuiltIn: draft.smartBuiltIn ?? partial.smartBuiltIn,
      wifiBuiltIn: draft.wifiBuiltIn ?? partial.wifiBuiltIn,
      wifiOptional: draft.wifiOptional ?? partial.wifiOptional,
      hdmi21: draft.hdmi21 ?? partial.hdmi21,
      hdbaset: draft.hdbaset ?? partial.hdbaset,
      rs232: draft.rs232 ?? partial.rs232,
      ean: draft.ean || partial.ean,
    })
  );
  if (product.category === "screen" && product.categorySignals?.ustScreen >= 0.8) {
    return { ...product, ustCompatible: true };
  }
  return product;
}

export function projectorHasReliableTech(product) {
  return (
    product?.brightnessAnsi != null &&
    Boolean(product.resolution) &&
    (product.throwRatioMin != null || product.ust === true)
  );
}
