import { createProduct, CATEGORIES } from "./productModel";
import { attachSegments, classifySegments } from "./segments";
import { rankProjectors } from "./projectorScoring";
import { categorySignalsFromTitles } from "./shopCategories";

const living = {
  usage: "movies",
  ambientLight: "dark",
  screenSize: "100_120",
  throwDistance: "3_4",
  budget: "flex",
  priority: "picture",
};

function projector(partial) {
  return attachSegments(
    createProduct({
      category: CATEGORIES.PROJECTOR,
      available: true,
      stock: 4,
      resolution: "4K UHD",
      brightnessAnsi: 3000,
      throwRatioMin: 1.3,
      throwRatioMax: 2.1,
      homeCinema: true,
      price: 1400,
      ...partial,
    })
  );
}

test("Home Cinema category + installatie-specs wint niet blind als home cinema", () => {
  const install = projector({
    id: "zu",
    brand: "Optoma",
    title: "Optoma ZU1100",
    brightnessAnsi: 11500,
    price: 9999,
    shopCategories: ["Home Cinema", "Installatie", "Large Venue"],
    sourceText: "verwisselbare lens HDBaseT large venue",
  });
  const cinema = projector({
    id: "tw",
    brand: "Epson",
    title: "Epson EH-TW7100",
    brightnessAnsi: 3000,
    price: 1600,
    shopCategories: ["Home Cinema"],
  });
  const classified = classifySegments(install);
  expect(classified.conflicts).toContain("home_cinema_vs_installation");
  const ranked = rankProjectors([install, cinema], living);
  expect(ranked[0].product.id).toBe("tw");
  expect(ranked.find((r) => r.product.id === "zu").infeasible).toBe(true);
});

test("Game Beamers zonder specs: positieve fit, lagere confidence", () => {
  const classified = classifySegments(
    createProduct({
      title: "Optoma office",
      category: CATEGORIES.PROJECTOR,
      shopCategories: ["Game Beamers"],
      gaming: false,
      inputLag: null,
      refreshRate: null,
    })
  );
  const gaming = classified.segments.find((s) => s.name === "gaming");
  expect(gaming.confidence).toBeLessThan(0.7);
  expect(gaming.sources).toContain("category");
});

test("geen Game-categorie maar lage input lag mag gaming zijn", () => {
  const classified = classifySegments(
    createProduct({
      title: "BenQ X300G",
      category: CATEGORIES.PROJECTOR,
      shopCategories: ["Home Cinema"],
      inputLag: 8,
      refreshRate: 240,
      gaming: true,
    })
  );
  expect(classified.segments.some((s) => s.name === "gaming" && s.confidence >= 0.7)).toBe(true);
});

test("UST category zonder throw blijft inferred, geen verzonnen ratio in signals", () => {
  const product = attachSegments(
    createProduct({
      title: "UST model",
      category: CATEGORIES.PROJECTOR,
      shopCategories: ["Ultra Short Throw"],
      throwRatioMin: null,
      throwRatioMax: null,
      ust: false,
    })
  );
  expect(product.categorySignals.ust).toBe(1);
  expect(product.segments.some((s) => s.name === "ust_living_room")).toBe(true);
});

test("School category wint niet van home cinema puur op lumen", () => {
  const school = projector({
    id: "school",
    brand: "Epson",
    brightnessAnsi: 5000,
    homeCinema: false,
    office: true,
    shopCategories: ["School Beamers"],
    price: 900,
  });
  const cinema = projector({
    id: "cinema",
    brand: "Epson",
    brightnessAnsi: 2500,
    shopCategories: ["Home Cinema"],
    homeCinema: true,
    price: 1500,
  });
  const ranked = rankProjectors([school, cinema], living);
  expect(ranked[0].product.id).toBe("cinema");
});

test("category normalisatie game beamers", () => {
  const { signals } = categorySignalsFromTitles(["Game Beamers", "gaming"]);
  expect(signals.gaming).toBe(1);
});
