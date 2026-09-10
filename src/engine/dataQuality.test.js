import { createProduct, CATEGORIES } from "./productModel";
import { scoreProjector } from "./projectorScoring";
import { hydrateProduct } from "./hydrate";
import { parseProductSpecs } from "./parseSpecs";
import { stockLabel } from "../utils/labels";
import { fromLightspeed } from "../services/lightspeedAdapter";

const answers = {
  usage: "movies",
  ambientLight: "lots",
  screenSize: "100_120",
  throwDistance: "3_4",
  budget: "flex",
  priority: "picture",
};

test("ontbrekende ANSI lumen crasht niet en is niet automatisch ongeschikt", () => {
  const product = createProduct({
    id: "no-lumen",
    category: CATEGORIES.PROJECTOR,
    brand: "Optoma",
    model: "Mystery",
    brightnessAnsi: null,
    throwRatioMin: 1.3,
    throwRatioMax: 2.0,
    resolution: "4K UHD",
    available: true,
  });
  const scored = scoreProjector(product, answers);
  expect(scored.breakdown.brightness.uncertain).toBe(true);
  expect(scored.breakdown.brightness.infeasible).toBe(false);
  expect(Number.isFinite(scored.technicalScore)).toBe(true);
});

test("ontbrekende throw ratio is onzeker, niet automatisch ongeschikt", () => {
  const product = createProduct({
    id: "no-throw",
    category: CATEGORIES.PROJECTOR,
    brightnessAnsi: 3000,
    throwRatioMin: null,
    throwRatioMax: null,
    ust: false,
    shortThrow: false,
    resolution: "Full HD",
    available: true,
  });
  const scored = scoreProjector(product, answers);
  expect(scored.breakdown.throwFit.uncertain).toBe(true);
  expect(scored.infeasible).toBe(false);
});

test("ontbrekende afbeelding, oude prijs, voorraad en description crasht niet", () => {
  const product = fromLightspeed({
    id: 99,
    title: "Optoma UHD38x 4K 4000 ANSI-lumen beamer",
    dataSource: "lightspeed",
    normalized: true,
    category: "projector",
    brand: "Optoma",
    price: 999,
    oldPrice: null,
    imageUrl: "",
    stock: null,
    description: null,
    available: true,
  });
  expect(product.imageUrl).toBe("");
  expect(product.oldPrice).toBe(null);
  expect(stockLabel(product).text).toBe("Voorraad onbekend");
  expect(stockLabel(product).out).toBe(false);
});

test("Hivilux in de merknaam maakt een scherm niet UST-compatible", () => {
  const parsed = parseProductSpecs("HiViLux ALR Zero-Fixed Frame 120 inch projectiescherm");
  expect(parsed.values.clr).toBe(false);
  expect(parsed.values.ustCompatible).toBe(false);
});

test("onbekende UST-status is unknown, niet automatisch UST", () => {
  const parsed = parseProductSpecs("Optoma kantoorprojector presentatie");
  expect(parsed.confidence.ust).toBe("unknown");
  expect(parsed.values.ust).toBe(false);
});

test("3600 ANSI lumen in specs is confirmed", () => {
  const parsed = parseProductSpecs("Lichtopbrengst 3600 ANSI lumen Full HD");
  expect(parsed.values.brightnessAnsi).toBe(3600);
  expect(parsed.confidence.brightnessAnsi).toBe("confirmed");
});

test("UST uit titel is inferred/confirmed, niet unknown", () => {
  const parsed = parseProductSpecs("Formovie Theater Ultra Short Throw laser TV");
  expect(parsed.values.ust).toBe(true);
  expect(["confirmed", "inferred"]).toContain(parsed.confidence.ust);
});

test("hydrate van leeg product crasht niet", () => {
  const product = hydrateProduct({ id: "x", title: "Onbekend artikel" });
  expect(product.id).toBe("x");
  expect(product.category === "unknown" || product.category === "accessory" || product.category === "projector").toBe(
    true
  );
});
