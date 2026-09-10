import { recommend, debugSnapshot, modelFamilyKey } from "./recommend";
import { catalogStats } from "./catalogStats";

export const LIVE_SCENARIOS = {
  A: {
    name: "Woonkamer veel daglicht 120 inch 3m €1500 films",
    answers: {
      usage: "movies",
      ambientLight: "lots",
      screenSize: "100_120",
      throwDistance: "2_3",
      budget: "1500",
      priority: "picture",
    },
  },
  B: {
    name: "Donkere home cinema 120 inch 3–4m beeldkwaliteit",
    answers: {
      usage: "movies",
      room: "cinema",
      ambientLight: "dark",
      screenSize: "100_120",
      throwDistance: "3_4",
      budget: "flex",
      priority: "picture",
    },
  },
  C: {
    name: "Gaming €1500 lage input lag",
    answers: {
      usage: "gaming",
      ambientLight: "some",
      screenSize: "100_120",
      throwDistance: "2_3",
      budget: "1500",
      priority: "gaming",
      gamingLevel: "competitive",
    },
  },
  D: {
    name: "UST 120 inch lichte woonkamer",
    answers: {
      usage: "tv",
      ambientLight: "lots",
      screenSize: "100_120",
      throwDistance: "wall",
      budget: "flex",
      priority: "ease",
    },
  },
  E: {
    name: "Kantoor presentatie veel licht",
    answers: {
      usage: "office",
      ambientLight: "bright",
      screenSize: "up_to_100",
      throwDistance: "3_4",
      budget: "1000",
      priority: "brightness",
    },
  },
  F: {
    name: "Normaal elektrisch projectiescherm woonkamer 120 inch",
    category: "screen",
    answers: {
      placement: "wall",
      mechanism: "electric",
      screenSize: "100_120",
      projectorKind: "standard",
      ambientLight: "some",
      budget: "flex",
      aspectRatio: "16:9",
    },
  },
  G: {
    name: "UST projector CLR scherm",
    category: "screen",
    answers: {
      placement: "wall",
      mechanism: "fixed",
      screenSize: "100_120",
      projectorKind: "ust",
      ambientLight: "lots",
      budget: "flex",
    },
  },
  H: {
    name: "Slaapkamer",
    answers: {
      usage: "tv",
      room: "bedroom",
      ambientLight: "dark",
      screenSize: "up_to_100",
      throwDistance: "2_3",
      budget: "1000",
      priority: "quiet",
    },
  },
  I: {
    name: "Buiten beamer avonds",
    answers: {
      usage: "outdoor",
      outdoorWhen: "night",
      ambientLight: "dark",
      screenSize: "100_120",
      throwDistance: "3_4",
      budget: "1500",
      priority: "brightness",
    },
  },
  J: {
    name: "School onderwijs",
    answers: {
      usage: "office",
      ambientLight: "bright",
      screenSize: "up_to_100",
      throwDistance: "3_4",
      budget: "1000",
      priority: "brightness",
    },
  },
  K: {
    name: "Short throw",
    answers: {
      usage: "tv",
      ambientLight: "some",
      screenSize: "100_120",
      throwDistance: "under_2",
      budget: "flex",
      priority: "ease",
    },
  },
  L: {
    name: "Mini draagbaar",
    answers: {
      usage: "mixed",
      ambientLight: "some",
      screenSize: "up_to_100",
      throwDistance: "unknown",
      budget: "500",
      priority: "ease",
    },
  },
  M: {
    name: "Met goed geluid",
    answers: {
      usage: "tv",
      ambientLight: "some",
      screenSize: "100_120",
      throwDistance: "2_3",
      budget: "flex",
      priority: "ease",
    },
  },
};

export function catalogQuality(products) {
  const stats = catalogStats(products);
  const counts = stats.counts;
  const projectors = products.filter((p) => p.productKind === "projector");
  const missing = { brightnessAnsi: 0, throwRatio: 0, resolution: 0, ust: 0, image: 0 };
  const shop = {
    homeCinema: 0,
    gaming: 0,
    business: 0,
    ust: 0,
    shortThrow: 0,
    mini: 0,
    education: 0,
    livingRoom: 0,
    bedroom: 0,
    outdoor: 0,
    goodSound: 0,
  };
  const segmentDist = {};
  const segmentConf = { confirmed: 0, inferred: 0, unknown: 0 };
  for (const p of projectors) {
    if (p.brightnessAnsi == null) missing.brightnessAnsi += 1;
    if (p.throwRatioMin == null && !p.ust) missing.throwRatio += 1;
    if (!p.resolution) missing.resolution += 1;
    if (p.fieldConfidence?.ust === "unknown") missing.ust += 1;
    if (!p.imageUrl) missing.image += 1;
    const s = p.categorySignals || {};
    if (s.homeCinema) shop.homeCinema += 1;
    if (s.gaming) shop.gaming += 1;
    if (s.business) shop.business += 1;
    if (s.ust) shop.ust += 1;
    if (s.shortThrow) shop.shortThrow += 1;
    if (s.mini) shop.mini += 1;
    if (s.education) shop.education += 1;
    if (s.livingRoom) shop.livingRoom += 1;
    if (s.bedroom) shop.bedroom += 1;
    if (s.outdoor) shop.outdoor += 1;
    if (s.goodSound) shop.goodSound += 1;
    const names = new Set((p.segments || []).map((seg) => seg.name));
    for (const n of names) segmentDist[n] = (segmentDist[n] || 0) + 1;
    const conf = p.segmentConfidence || "unknown";
    segmentConf[conf] = (segmentConf[conf] || 0) + 1;
  }
  return {
    total: products.length,
    counts,
    projectorReliable: stats.reliableProjector,
    projectorSparse: stats.sparseProjector,
    liveProjector: stats.liveProjector,
    enrichedProjector: stats.enrichedProjector,
    missing,
    shop,
    segmentDist,
    segmentConf,
    specCoverage: stats.specCoverage,
  };
}

export function runLiveScenarios(products) {
  const quality = catalogQuality(products);
  const scenarios = {};
  for (const [key, spec] of Object.entries(LIVE_SCENARIOS)) {
    const rec = recommend(products, spec.answers, spec.category || "projector");
    const seen = new Set();
    const families = new Set();
    const top = [];
    for (const row of [...rec.items, ...(rec.ranked || [])]) {
      if (!row?.product || seen.has(row.product.id)) continue;
      const family = modelFamilyKey(row.product);
      if (families.has(family)) continue;
      seen.add(row.product.id);
      families.add(family);
      top.push(debugSnapshot({ ...row, matchType: rec.matchLevel }));
      if (top.length >= 5) break;
    }
    scenarios[key] = {
      name: spec.name,
      fallbackLevel: rec.fallbackLevel,
      matchLevel: rec.matchLevel,
      top,
    };
  }
  return { quality, scenarios };
}
