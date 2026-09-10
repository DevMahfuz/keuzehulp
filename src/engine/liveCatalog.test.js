import fs from "fs";
import path from "path";
import { fromLightspeedList } from "../services/lightspeedAdapter";
import { runLiveScenarios } from "./liveScenarios";
import { rankScreens } from "./screenScoring";
import { rankProjectors } from "./projectorScoring";
import { createProduct, CATEGORIES } from "./productModel";
import { catalogStats, assertProjectorCountConsistency } from "./catalogStats";

const catalogPath = path.join(__dirname, "..", "..", ".live-catalog.json");
const hasLive = fs.existsSync(catalogPath);

(hasLive ? test : test.skip)("live catalog scenarios and commercial checks", () => {
  const payload = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const products = fromLightspeedList(payload);
  expect(products.length).toBeGreaterThan(100);

  const report = runLiveScenarios(products);
  expect(assertProjectorCountConsistency(catalogStats(products))).toBe(true);
  const slim = {
    quality: report.quality,
    scenarios: Object.fromEntries(
      Object.entries(report.scenarios).map(([key, spec]) => [
        key,
        {
          name: spec.name,
          fallbackLevel: spec.fallbackLevel,
          matchLevel: spec.matchLevel,
          top: spec.top.map((t) => ({
            product: t.product,
            price: t.price,
            shopCategories: (t.shopCategories || []).filter((c) => !["Beamers", "Merken", "Categorie", "Specificaties", "Populair"].includes(c)),
            segments: (t.segments || []).map((s) => `${s.name}:${s.confidence}`),
            technicalScore: Number((t.technicalScore || 0).toFixed(1)),
            categoryMatchScore: t.categoryMatchScore,
            segmentFitScore: Number((t.segmentFitScore || 0).toFixed(1)),
            commercialAdjustment: t.commercialAdjustment,
            budgetPenalty: t.budgetPenalty,
            finalScore: Number((t.finalScore || 0).toFixed(1)),
            confidence: t.confidence,
            gamingEvidence: t.gamingEvidence,
            specEnriched: t.specEnriched,
            specMatchMethod: t.specMatchMethod,
            native4K: t.native4K,
            throwClass: t.throwClass,
          })),
        },
      ])
    ),
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ specifications: payload.meta?.specifications, ...slim }, null, 2));

  for (const key of ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]) {
    expect(report.scenarios[key].top.length).toBeGreaterThan(0);
  }

  const screens = products.filter((p) => p.category === "screen");
  const normal = rankScreens(screens, {
    placement: "wall",
    mechanism: "fixed",
    screenSize: "100_120",
    projectorKind: "standard",
    ambientLight: "dark",
    budget: "flex",
  }).filter((s) => !s.infeasible);
  if (normal.length >= 2) {
    const elite = normal.find((s) => /elite/i.test(s.product.brand));
    if (elite) {
      const otherSame = normal.find(
        (s) => s.product.id !== elite.product.id && Math.abs((s.technicalScore || 0) - (elite.technicalScore || 0)) < 3
      );
      if (otherSame && !/elite/i.test(otherSame.product.brand)) {
        expect(elite.rankingScore).toBeGreaterThanOrEqual(otherSame.rankingScore);
      }
    }
  }

  const ustScreens = rankScreens(screens, {
    placement: "wall",
    mechanism: "fixed",
    screenSize: "100_120",
    projectorKind: "ust",
    ambientLight: "lots",
    budget: "flex",
  }).filter((s) => !s.infeasible);
  const hivi = ustScreens.find((s) => /hivilux/i.test(s.product.brand));
  const eliteClr = ustScreens.find((s) => /elite/i.test(s.product.brand));
  if (hivi && eliteClr) {
    expect(hivi.rankingScore).toBeGreaterThan(eliteClr.rankingScore);
  }

  const projectors = products.filter((p) => p.productKind === "projector");
  const ranked = rankProjectors(projectors, {
    usage: "movies",
    ambientLight: "dark",
    screenSize: "100_120",
    throwDistance: "3_4",
    budget: "flex",
    priority: "picture",
  }).filter((p) => !p.infeasible);
  expect(ranked.length).toBeGreaterThan(0);
  expect(createProduct({ category: CATEGORIES.PROJECTOR, id: "x" }).category).toBe("projector");
});
