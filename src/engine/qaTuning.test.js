import { createProduct, CATEGORIES } from "./productModel";
import { classifyProduct } from "./classify";
import { hydrateProduct } from "./hydrate";
import { attachSegments } from "./segments";
import { rankProjectors, pickProjectorHighlights } from "./projectorScoring";
import { recommend } from "./recommend";
import { applySpecToProduct, parseSpecRow, parseCsv } from "./specifications";
import fs from "fs";
import path from "path";

function projector(partial) {
  return attachSegments(
    createProduct({
      category: CATEGORIES.PROJECTOR,
      productKind: "projector",
      available: true,
      stock: 3,
      resolution: "4K UHD",
      brightnessAnsi: 3000,
      throwRatioMin: 1.3,
      throwRatioMax: 2.0,
      homeCinema: true,
      price: 1400,
      ...partial,
    })
  );
}

test("UST-schuiflade is nooit een projector", () => {
  const p = hydrateProduct({
    title: "NP - UST Projector Slide - UST beamer schuiflade",
    brand: "NP",
    sourceText: "UST projector slide schuiflade",
  });
  expect(p.productKind).toBe("furniture");
  expect(p.category).not.toBe("projector");
  const ranked = rankProjectors([p], { usage: "tv", throwDistance: "wall", budget: "flex" });
  expect(ranked).toHaveLength(0);
});

test("projector lens is nooit een projector", () => {
  const p = hydrateProduct({
    title: "Epson ELPLU03S Beamer - 4K - 20000 Lumen - Laser",
    brand: "Epson",
    sourceText: "ELPLU03S ultra short throw lens",
  });
  expect(p.productKind).toBe("projector_lens");
  expect(classifyProduct(p).productKind).toBe("projector_lens");
});

test("echte BenQ LU960 blijft projector zonder CSV", () => {
  const p = hydrateProduct({
    title: "BenQ LU960 - WUXGA - 5500 Lumen Business Projector",
    brand: "BenQ",
    sourceText: "BenQ LU960 WUXGA 5500 Lumen laser business projector",
    brightnessAnsi: 5500,
    resolution: "WUXGA",
    specEnriched: false,
  });
  expect(p.productKind).toBe("projector");
  expect(p.category).toBe("projector");
  const ranked = rankProjectors([p], { usage: "office", ambientLight: "bright", throwDistance: "3_4", budget: "flex" });
  expect(ranked).toHaveLength(1);
});

test("huurproduct is geen losse beamer", () => {
  const p = hydrateProduct({
    title: "Huurbeamer: Epson EH-LS650W - 4K - 3600 ANSI Lumen - UST projector",
    brand: "Epson",
    specEnriched: true,
    sourceText: "Beamers te huur",
  });
  expect(p.productKind).not.toBe("projector");
});

test("bundle/pakket is geen losse beamer-recommendation", () => {
  const p = hydrateProduct({
    title: "Beamer Verhuur Pakket – Epson LS650W + 100 inch Scherm + JBL Soundbar",
    brand: "Epson",
    sourceText: "verhuur pakket beamer scherm",
  });
  expect(p.productKind).toBe("bundle");
  expect(rankProjectors([p], { usage: "movies", budget: "flex" })).toHaveLength(0);
});

test("short throw intent prefereert echte short throw boven UST", () => {
  const st = projector({
    id: "st",
    brand: "Optoma",
    title: "Optoma UHD35STx",
    throwRatioMin: 0.5,
    throwRatioMax: 0.5,
    throwClass: "short",
    shortThrow: true,
    ust: false,
    inputLag: 4.2,
    gaming: true,
    price: 1200,
  });
  const ust = projector({
    id: "ust",
    brand: "Epson",
    title: "Epson EH-LS800 UST",
    throwClass: "ust",
    ust: true,
    shortThrow: false,
    throwRatioMin: 0.25,
    throwRatioMax: 0.28,
    price: 2500,
    categorySignals: { ust: 1, homeCinema: 1 },
  });
  const ranked = rankProjectors([st, ust], {
    usage: "gaming",
    ambientLight: "some",
    screenSize: "120_150",
    throwDistance: "under_2",
    budget: "1500",
    priority: "gaming",
    gamingLevel: "competitive",
  });
  expect(ranked.find((r) => r.product.id === "st").infeasible).toBe(false);
  expect(ranked.find((r) => r.product.id === "ust").infeasible).toBe(true);
  expect(ranked.filter((r) => !r.infeasible)[0].product.id).toBe("st");
});

test("UST intent prefereert UST, geen short throw als equivalent", () => {
  const st = projector({
    id: "st",
    throwClass: "short",
    shortThrow: true,
    ust: false,
    throwRatioMin: 0.5,
    throwRatioMax: 0.5,
  });
  const ust = projector({
    id: "ust",
    throwClass: "ust",
    ust: true,
    throwRatioMin: 0.25,
    throwRatioMax: 0.28,
    categorySignals: { ust: 1 },
  });
  const ranked = rankProjectors([st, ust], {
    usage: "tv",
    ambientLight: "lots",
    screenSize: "100_120",
    throwDistance: "wall",
    budget: "flex",
    priority: "ease",
  });
  expect(ranked.find((r) => r.product.id === "st").infeasible).toBe(true);
  expect(ranked.filter((r) => !r.infeasible)[0].product.id).toBe("ust");
});

test("high-end home cinema + imageQualityPriority tilt JVC/Sony omhoog", () => {
  const jvc = projector({
    id: "jvc",
    brand: "JVC",
    title: "JVC DLA-NP5",
    native4K: true,
    cinema4K: true,
    brightnessAnsi: 1900,
    noiseLevel: 24,
    technology: "D-ILA",
    price: 5500,
    specSignals: { homeCinema: true, premiumHomeCinema: true, gaming: true },
    specPlus: "Diepe zwartwaarden",
  });
  const cheap = projector({
    id: "cheap",
    brand: "Hisense",
    title: "Hisense smart 4K",
    brightnessAnsi: 2500,
    native4K: false,
    smartBuiltIn: true,
    price: 999,
    specSignals: { homeCinema: true, smart: true },
  });
  const ranked = rankProjectors([jvc, cheap], {
    usage: "movies",
    room: "cinema",
    ambientLight: "dark",
    screenSize: "100_120",
    throwDistance: "3_4",
    budget: "flex",
    priority: "picture",
  });
  expect(ranked[0].product.id).toBe("jvc");
});

test("large venue verliest in donkere consumenten-home-cinema", () => {
  const venue = projector({
    id: "venue",
    brand: "ViewSonic",
    title: "ViewSonic LS920WU",
    brightnessAnsi: 6000,
    resolution: "WUXGA",
    price: 2500,
    specSignals: { largeVenue: true, brightRoom: true, business: true },
    hdbaset: true,
  });
  const cinema = projector({
    id: "cinema",
    brand: "JVC",
    title: "JVC DLA-NP5",
    native4K: true,
    brightnessAnsi: 1900,
    price: 5000,
    specSignals: { homeCinema: true, premiumHomeCinema: true },
  });
  const ranked = rankProjectors([venue, cinema], {
    usage: "movies",
    ambientLight: "dark",
    screenSize: "100_120",
    throwDistance: "3_4",
    budget: "flex",
    priority: "picture",
  });
  expect(ranked[0].product.id).toBe("cinema");
});

test("fallback blijft werken bij onmogelijke combo", () => {
  const far = projector({
    id: "far",
    throwRatioMin: 1.4,
    throwRatioMax: 2.2,
    price: 2000,
  });
  const result = recommend([far], {
    usage: "movies",
    ambientLight: "lots",
    screenSize: "over_150",
    throwDistance: "under_2",
    budget: "500",
    priority: "picture",
  });
  expect(result.items.length).toBeGreaterThan(0);
  expect(result.fallbackLevel).toBeGreaterThan(1);
  expect(result.items[0].matchBand.key).toBe("concession");
});

test("Premium keuze is geen duurste-installatie-label", () => {
  const pool = [
    projector({ id: "a", price: 1200, native4K: false }),
    projector({ id: "b", price: 1800, native4K: true, brand: "Sony", specSignals: { premiumHomeCinema: true, homeCinema: true } }),
    projector({ id: "c", price: 9000, brightnessAnsi: 10000, specSignals: { largeVenue: true } }),
  ].map((p) => ({
    product: p,
    rankingScore: p.price === 1800 ? 90 : p.price === 1200 ? 88 : 40,
    infeasible: false,
    nearest: false,
    matchScore: 80,
  }));
  const picked = pickProjectorHighlights(pool);
  expect(picked.labels).not.toContain("Premium alternatief");
  if (picked.labels.includes("Premium keuze")) {
    expect(picked.items[picked.labels.indexOf("Premium keuze")].product.id).toBe("b");
  }
});

test("CSV UHD35STx blijft short throw", () => {
  const csvPath = path.join(__dirname, "..", "..", "data", "projector-specifications.csv");
  const parsed = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const row = parsed.rows.map(parseSpecRow).find((r) => /UHD35STx/.test(r.shortTitle));
  const st = attachSegments(
    applySpecToProduct(
      createProduct({
        id: "uhd35",
        category: CATEGORIES.PROJECTOR,
        brand: "Optoma",
        title: "Optoma UHD35STx",
        price: 1200,
        available: true,
        stock: 3,
      }),
      row,
      "ean"
    )
  );
  expect(st.throwClass).toBe("short");
  expect(st.ust).toBe(false);
});
