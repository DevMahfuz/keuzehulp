import { categorySignalsFromTitles, shopCategoryTitles } from "./shopCategories";

function pushSegment(list, name, confidence, sources) {
  if (confidence < 0.25) return;
  list.push({
    name,
    confidence: Math.max(0, Math.min(1, confidence)),
    sources: [...new Set(sources.filter(Boolean))],
  });
}

function hasName(segments, name) {
  return segments.some((s) => s.name === name);
}

export function classifySegments(product) {
  const titles = shopCategoryTitles(product);
  const { signals, sources } = categorySignalsFromTitles(titles);
  const spec = product.specSignals || {};
  const text = `${product.title || ""} ${product.sourceText || ""} ${product.specPlus || ""} ${product.specMin || ""}`.toLowerCase();
  const segments = [];
  const conflicts = [];

  const lumen = product.brightnessAnsi;
  const price = product.price;
  const installCat = Math.max(signals.installation || 0, signals.largeVenue || 0, spec.largeVenue ? 1 : 0);
  const installText =
    /verwisselbare lens|interchangeable|edge blend|24\s*\/\s*7|large venue|installatieprojector/.test(text);
  const installConnect = Boolean(product.hdbaset) && Boolean(product.rs232);
  const installLumen = lumen != null && lumen >= 6500;
  const installPrice = price != null && price >= 4500;
  const installHits = [installCat >= 0.8, installText, installConnect, installLumen, installPrice].filter(Boolean).length;

  if (installHits >= 2 || (spec.largeVenue && (installLumen || product.hdbaset))) {
    const conf = Math.min(1, 0.45 + Math.max(installHits, spec.largeVenue ? 2 : 0) * 0.18);
    pushSegment(
      segments,
      spec.largeVenue || signals.largeVenue >= 0.8 || (installLumen && lumen >= 9000) ? "large_venue" : "installation_projector",
      conf,
      [
        ...(sources.installation || []),
        ...(sources.largeVenue || []),
        spec.largeVenue ? "specification_csv:NL_Geschikt_voor" : null,
        installText ? "content" : null,
        product.hdbaset ? "hdbaset" : null,
        installLumen ? "lumen" : null,
      ]
    );
    if ((signals.homeCinema >= 0.8 || spec.homeCinema) && installHits >= 2) {
      conflicts.push("home_cinema_vs_installation");
    }
  }

  const gamingCat = signals.gaming || spec.gaming;
  const gamingSpec =
    (product.inputLag != null && product.inputLag <= 35) ||
    (product.refreshRate != null && product.refreshRate >= 120) ||
    Boolean(product.hdmi21);
  const gamingText = /gaming|input\s*lag|game mode/.test(text);
  if (gamingCat || gamingSpec || gamingText || product.gaming) {
    let conf = 0.3;
    const gSources = [];
    if (signals.gaming) {
      conf += 0.28;
      gSources.push("category");
    }
    if (spec.gaming) {
      conf += 0.28;
      gSources.push("specification_csv:NL_Geschikt_voor");
    }
    if (gamingSpec) {
      conf += 0.42;
      gSources.push(product.inputLag != null ? "input_lag" : "specs");
    } else if (product.gaming || gamingText) {
      conf += 0.1;
      gSources.push("description");
    }
    if (gamingCat && !gamingSpec) conf = Math.min(conf, 0.7);
    if (signals.gaming && spec.gaming && gamingSpec) conf = Math.min(1, conf + 0.1);
    pushSegment(segments, "gaming", conf, [...(sources.gaming || []), ...gSources]);
  }

  if (signals.ust || product.ust || product.throwClass === "ust") {
    const specUst = Boolean(product.ust || product.throwClass === "ust");
    const catUst = signals.ust >= 0.8;
    let conf = catUst && specUst ? 0.95 : catUst || specUst ? 0.78 : 0.4;
    if (catUst && product.throwRatioMax != null && product.throwRatioMax > 0.7) {
      conflicts.push("ust_category_vs_throw");
      conf = 0.4;
    }
    pushSegment(segments, "ust_living_room", conf, [...(sources.ust || []), specUst ? "specs" : "category"]);
  }

  if (signals.shortThrow || product.shortThrow || product.throwClass === "short") {
    pushSegment(segments, "short_throw", signals.shortThrow ? 0.85 : 0.65, sources.shortThrow || ["specs"]);
  }

  if (signals.homeCinema || product.homeCinema || spec.homeCinema || spec.premiumHomeCinema) {
    let conf = signals.homeCinema || spec.homeCinema ? 0.88 : 0.55;
    if (spec.premiumHomeCinema) conf = Math.max(conf, 0.95);
    if (signals.homeCinema && spec.homeCinema) conf = Math.min(1, conf + 0.08);
    if (conflicts.includes("home_cinema_vs_installation")) conf = 0.35;
    pushSegment(segments, "consumer_home_cinema", conf, [
      ...(sources.homeCinema || []),
      spec.homeCinema ? "specification_csv:NL_Geschikt_voor" : null,
    ]);
  }

  if (signals.livingRoom || product.livingRoom || product.smart || spec.smart) {
    pushSegment(segments, "living_room", signals.livingRoom || spec.smart ? 0.9 : 0.5, sources.livingRoom || ["description"]);
  }

  if (signals.bedroom) {
    pushSegment(segments, "bedroom", 0.9, sources.bedroom);
  }

  if (signals.mini || spec.portable || product.outdoor || /mini|portable|draagbaar|elfin|mogo/.test(text)) {
    const miniCat = signals.mini >= 0.8 || spec.portable;
    const brightHuge = lumen != null && lumen >= 3500;
    const heavy = product.weightKg != null && product.weightKg >= 8;
    pushSegment(segments, "portable_consumer", miniCat && !heavy ? 0.9 : 0.45, sources.mini || ["description"]);
    if (miniCat && brightHuge) conflicts.push("mini_vs_high_lumen");
  }

  if (signals.outdoor || product.outdoor) {
    pushSegment(segments, "outdoor_consumer", signals.outdoor ? 0.9 : 0.5, sources.outdoor || ["description"]);
  }

  if (signals.business || product.office || spec.business) {
    const portableBiz = spec.portable || /portable|draagbaar|ultradun|reis/.test(text) || (price != null && price < 1200);
    pushSegment(
      segments,
      portableBiz ? "business_portable" : "business_fixed",
      signals.business || spec.business ? 0.9 : 0.5,
      [...(sources.business || []), spec.business ? "specification_csv:NL_Geschikt_voor" : "description"]
    );
  }

  if (signals.education || spec.education) {
    pushSegment(segments, "education", 0.92, sources.education || ["specification_csv:NL_Geschikt_voor"]);
  }

  if (signals.interactive) {
    pushSegment(segments, "interactive", 0.8, sources.interactive);
  }

  if (!segments.length) {
    pushSegment(segments, "unknown", 0.3, ["none"]);
  }

  const strongest = [...segments].sort((a, b) => b.confidence - a.confidence)[0];
  const provenance = {
    categorySignals: signals,
    categorySources: sources,
    shopCategories: titles,
    conflicts,
  };

  return {
    shopCategories: titles,
    categorySignals: signals,
    categorySources: sources,
    segments,
    segmentConfidence: strongest?.confidence >= 0.8 ? "confirmed" : strongest?.confidence >= 0.5 ? "inferred" : "unknown",
    conflicts,
    provenance,
    hasSegment: (name) => hasName(segments, name),
  };
}

export function attachSegments(product) {
  const classified = classifySegments(product);
  return {
    ...product,
    shopCategories: classified.shopCategories,
    categorySignals: classified.categorySignals,
    categorySources: classified.categorySources,
    segments: classified.segments,
    segmentConfidence: classified.segmentConfidence,
    segmentConflicts: classified.conflicts,
    provenance: classified.provenance,
  };
}

export function isInstallationSegment(product) {
  return (product.segments || []).some(
    (s) => (s.name === "installation_projector" || s.name === "large_venue") && s.confidence >= 0.5
  );
}

export function isConsumerIntent(answers = {}) {
  return ["movies", "tv", "gaming", "mixed", "sport", "outdoor"].includes(answers.usage);
}
