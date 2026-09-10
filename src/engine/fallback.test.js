import { createProduct, CATEGORIES } from "./productModel";
import { recommend } from "./recommend";
import { classifyProduct } from "./classify";
import { hydrateProduct } from "./hydrate";
import { loadCatalog } from "../services/productService";

const living = {
  usage: "movies",
  ambientLight: "lots",
  screenSize: "100_120",
  throwDistance: "3_4",
  budget: "1000",
  priority: "picture",
};

function projector(partial) {
  return createProduct({
    category: CATEGORIES.PROJECTOR,
    available: true,
    stock: 4,
    resolution: "4K UHD",
    brightnessAnsi: 3200,
    throwRatioMin: 1.2,
    throwRatioMax: 1.9,
    homeCinema: true,
    livingRoom: true,
    ...partial,
  });
}

test("budgetoverschrijding toont alsnog een technisch geschikt model", () => {
  const over = projector({ id: "over", brand: "Epson", model: "TW", price: 1149, title: "Epson TW" });
  const result = recommend([over], living);
  expect(result.items.length).toBeGreaterThan(0);
  expect(result.fallbackLevel).toBeGreaterThanOrEqual(1);
  expect(result.items[0].product.id).toBe("over");
  expect(result.items[0].warnings.join(" ")).toMatch(/boven/);
});

test("zachte voorkeuren versoepelen levert resultaten", () => {
  const quietFail = projector({
    id: "loud",
    brand: "Optoma",
    model: "UHD",
    price: 900,
    title: "Optoma UHD",
    noiseLevel: 38,
    smart: false,
  });
  const result = recommend([quietFail], { ...living, priority: "quiet", budget: "flex" });
  expect(result.items.length).toBeGreaterThan(0);
});

test("onmogelijke projectieafstand toont nearest match met waarschuwing", () => {
  const far = projector({
    id: "far",
    brand: "Epson",
    model: "TW7100",
    price: 1400,
    title: "Epson TW7100",
    throwRatioMin: 1.32,
    throwRatioMax: 2.15,
  });
  const result = recommend([far], {
    ...living,
    screenSize: "120_150",
    throwDistance: "2_3",
    budget: "flex",
  });
  expect(result.items.length).toBeGreaterThan(0);
  expect(result.matchLevel).toBe("nearest");
  expect(result.items[0].matchScore).toBeLessThan(70);
  expect(result.items[0].warnings.join(" ")).toMatch(/afstand|meter/i);
});

test("geen perfecte UST/scherm combinatie: incompatibel niet als geschikt", () => {
  const ustBeamer = projector({
    id: "ust-p",
    brand: "Epson",
    model: "LS",
    price: 2500,
    ust: true,
    throwRatioMin: 0.2,
    throwRatioMax: 0.28,
    throwClass: "ust",
  });
  ustBeamer.ust = true;
  ustBeamer.throwClass = "ust";
  const matte = createProduct({
    id: "matte",
    category: CATEGORIES.SCREEN,
    brand: "Celexon",
    model: "Frame",
    title: "Celexon Frame 120",
    price: 400,
    sizeInches: 120,
    fixedFrame: true,
    clr: false,
    ustCompatible: false,
    available: true,
    stock: 2,
  });
  const result = recommend([matte], {
    placement: "wall",
    mechanism: "fixed",
    screenSize: "100_120",
    projectorKind: "ust",
    ambientLight: "lots",
    budget: "flex",
  }, "screen");
  expect(result.items.length).toBeGreaterThan(0);
  expect(result.items[0].infeasible || result.items[0].nearest || result.matchLevel === "nearest").toBeTruthy();
  expect(result.items[0].warnings.join(" ")).toMatch(/CLR|UST/i);
  expect(ustBeamer.id).toBe("ust-p");
});

test("catalogus geladen maar strikte filter 0: fallback activeert", () => {
  const only = projector({
    id: "only",
    brand: "Optoma",
    model: "GT",
    price: 1299,
    title: "Optoma GT",
    throwRatioMin: 0.5,
    throwRatioMax: 0.7,
    shortThrow: true,
  });
  const rankedEmptyIfStrictWouldFail = recommend([only], {
    usage: "movies",
    ambientLight: "lots",
    screenSize: "over_150",
    throwDistance: "wall",
    budget: "500",
    priority: "picture",
  });
  expect(rankedEmptyIfStrictWouldFail.items.length).toBeGreaterThan(0);
  expect(rankedEmptyIfStrictWouldFail.fallbackLevel).toBeGreaterThan(1);
});

test("API niet beschikbaar: loadCatalog geeft geen verzonnen advies", async () => {
  const original = global.fetch;
  global.fetch = jest.fn().mockRejectedValue(new Error("network"));
  const catalog = await loadCatalog();
  global.fetch = original;
  expect(catalog.products).toEqual([]);
  expect(catalog.error).toBe("catalog_unavailable");
  expect(catalog.usingMock).toBe(false);
});

test("fallback met concessie verlaagt matchscore en legt uit", () => {
  const far = projector({
    id: "far2",
    brand: "Epson",
    model: "TW",
    price: 1600,
    throwRatioMin: 1.6,
    throwRatioMax: 2.2,
  });
  const result = recommend([far], {
    ...living,
    screenSize: "120_150",
    throwDistance: "under_2",
    budget: "flex",
  });
  expect(result.items[0].matchScore).toBeLessThan(70);
  expect(result.items[0].matchBand.key).toBe("concession");
  expect(result.items[0].warnings.length).toBeGreaterThan(0);
});

test("diversificatie: drie dezelfde modelvarianten vullen niet alle slots", () => {
  const variants = [1, 2, 3, 4].map((n) =>
    projector({
      id: `optoma-uhd38x-${n}`,
      productId: `p-${n}`,
      brand: "Optoma",
      model: "UHD38x Wit",
      title: `Optoma UHD38x Wit variant ${n}`,
      price: 900 + n,
    })
  );
  const extra = projector({
    id: "epson-tw",
    brand: "Epson",
    model: "EH-TW7100",
    title: "Epson EH-TW7100",
    price: 1400,
  });
  const result = recommend([...variants, extra], { ...living, budget: "flex" });
  const ids = result.items.map((i) => i.product.brand);
  expect(new Set(ids).size).toBeGreaterThan(1);
});

test("classificatie: beugel is geen projector", () => {
  const mount = hydrateProduct({
    title: "Plafondbeugel voor Epson beamers",
    brand: "neomounts",
    sourceText: "Plafondbeugel universeel",
  });
  expect(classifyProduct(mount).category).not.toBe("projector");
  expect(["mount", "accessory"]).toContain(mount.category);
});

test("UST-projector in titel wordt geen scherm", () => {
  const product = hydrateProduct({
    title: "XGIMI Mira - 4K UHD – 2000 ISO Lumen – Ultra Short Throw",
    brand: "XGIMI",
    sourceText: "XGIMI Mira 2000 ISO Lumen Ultra Short Throw",
  });
  expect(product.category).toBe("projector");
});

test("classificatie: projectiescherm is geen projector", () => {
  const screen = hydrateProduct({
    title: "Elite Screens Spectrum 120 inch projectiescherm",
    brand: "Elite Screens",
    sourceText: "projectiescherm 120 inch vast frame",
  });
  expect(screen.category).toBe("screen");
});
