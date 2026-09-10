import { createProduct, CATEGORIES } from "./productModel";
import { rankProjectors } from "./projectorScoring";
import { rankScreens, scoreScreen } from "./screenScoring";
import { recommendSet } from "./setScoring";
import { commercialBrandPoints } from "./commercialScore";

const baseScreen = {
  category: CATEGORIES.SCREEN,
  price: 400,
  sizeInches: 120,
  widthMeters: 2.65,
  aspectRatio: "16:9",
  screenType: "fixed",
  fixedFrame: true,
  tensioned: true,
  alr: false,
  clr: false,
  ustCompatible: false,
  gain: 1.0,
  mounting: "wall",
  stock: 5,
  available: true,
};

const standardScreenAnswers = {
  placement: "wall",
  mechanism: "fixed",
  screenSize: "100_120",
  projectorKind: "standard",
  ambientLight: "dark",
  budget: "flex",
};

const ustScreenAnswers = {
  placement: "wall",
  mechanism: "fixed",
  screenSize: "100_120",
  projectorKind: "ust",
  ambientLight: "some",
  budget: "flex",
};

const livingAnswers = {
  usage: "movies",
  ambientLight: "dark",
  screenSize: "100_120",
  throwDistance: "3_4",
  budget: "flex",
  priority: "picture",
};

function projector({ id, brand, brightnessAnsi = 3000, resolution = "4K UHD", throwRatioMin = 1.32, throwRatioMax = 2.15, homeCinema = true }) {
  return createProduct({
    id,
    brand,
    model: id,
    title: `${brand} ${id}`,
    category: CATEGORIES.PROJECTOR,
    price: 1400,
    resolution,
    brightnessAnsi,
    throwRatioMin,
    throwRatioMax,
    homeCinema,
    livingRoom: true,
    available: true,
    stock: 4,
  });
}

test("twee technisch gelijkwaardige normale schermen: Elite Screens eindigt hoger", () => {
  const elite = createProduct({ ...baseScreen, id: "elite-eq", brand: "Elite Screens", model: "Fixed 120" });
  const other = createProduct({ ...baseScreen, id: "other-eq", brand: "EluneVision", model: "Fixed 120" });
  const ranked = rankScreens([elite, other], standardScreenAnswers);
  expect(ranked[0].infeasible).toBe(false);
  expect(ranked[1].infeasible).toBe(false);
  expect(ranked[0].technicalScore).toBeCloseTo(ranked[1].technicalScore, 0);
  expect(ranked[0].product.brand).toBe("Elite Screens");
  expect(ranked[0].commercialAdjustment).toBeGreaterThan(ranked[1].commercialAdjustment);
});

test("UST: Hivilux UST/CLR eindigt boven Elite als beide technisch geschikt zijn", () => {
  const elite = createProduct({
    ...baseScreen,
    id: "elite-clr",
    brand: "Elite Screens",
    clr: true,
    ustCompatible: true,
    alr: true,
  });
  const hivilux = createProduct({
    ...baseScreen,
    id: "hivilux-clr",
    brand: "HiViLux",
    clr: true,
    ustCompatible: true,
    alr: true,
  });
  const ranked = rankScreens([elite, hivilux], ustScreenAnswers);
  expect(ranked.every((r) => !r.infeasible)).toBe(true);
  expect(ranked[0].product.brand.toLowerCase()).toBe("hivilux");
  expect(ranked[0].rankingScore).toBeGreaterThan(ranked[1].rankingScore);
});

test("BenQ vs Epson met gelijke technische score: Epson eerst", () => {
  const epson = projector({ id: "eq-epson", brand: "Epson" });
  const benq = projector({ id: "eq-benq", brand: "BenQ" });
  const ranked = rankProjectors([benq, epson], livingAnswers).filter((r) => !r.infeasible);
  expect(ranked[0].technicalScore).toBeCloseTo(ranked[1].technicalScore, 0);
  expect(ranked[0].product.brand).toBe("Epson");
  expect(ranked[1].product.brand).toBe("BenQ");
});

test("BenQ technisch duidelijk beter mag nog winnen", () => {
  const benq = projector({
    id: "benq-best",
    brand: "BenQ",
    brightnessAnsi: 4000,
    resolution: "4K UHD",
    throwRatioMin: 1.32,
    throwRatioMax: 2.15,
  });
  const epson = projector({
    id: "epson-weak",
    brand: "Epson",
    brightnessAnsi: 800,
    resolution: "SVGA",
    throwRatioMin: 0.2,
    throwRatioMax: 0.25,
  });
  const ranked = rankProjectors([benq, epson], livingAnswers);
  expect(ranked[0].product.brand).toBe("BenQ");
  expect(ranked[0].infeasible).toBe(false);
  expect(ranked[1].infeasible).toBe(true);
});

test("Elite technisch ongeschikt wint niet via merkbonus", () => {
  const eliteWrong = createProduct({
    ...baseScreen,
    id: "elite-clr-wrong",
    brand: "Elite Screens",
    clr: true,
    ustCompatible: true,
    alr: true,
  });
  const otherFit = createProduct({ ...baseScreen, id: "other-fit", brand: "Celexon", model: "Frame 120" });
  const ranked = rankScreens([eliteWrong, otherFit], standardScreenAnswers);
  expect(ranked[0].product.brand).toBe("Celexon");
  expect(ranked.find((r) => r.product.brand === "Elite Screens").infeasible).toBe(true);
  expect(ranked.find((r) => r.product.brand === "Elite Screens").commercialAdjustment).toBe(0);
});

test("Hivilux zonder UST-compatibiliteit krijgt geen UST-merkbonus", () => {
  const hiviluxPlain = createProduct({
    ...baseScreen,
    id: "hivilux-matte",
    brand: "Hivilux",
    clr: false,
    ustCompatible: false,
  });
  expect(commercialBrandPoints(hiviluxPlain, { projectorKind: "ust" })).toBe(0);
  const scored = scoreScreen(hiviluxPlain, ustScreenAnswers);
  expect(scored.infeasible).toBe(true);
  expect(scored.commercialAdjustment).toBe(0);
});

test("complete set: UST-beamer kiest Hivilux CLR boven Elite CLR", () => {
  const ustBeamer = projector({
    id: "ust-set",
    brand: "Epson",
    throwRatioMin: 0.2,
    throwRatioMax: 0.28,
  });
  ustBeamer.throwClass = "ust";
  ustBeamer.ust = true;
  const elite = createProduct({
    ...baseScreen,
    id: "set-elite-clr",
    brand: "Elite Screens",
    clr: true,
    ustCompatible: true,
  });
  const hivilux = createProduct({
    ...baseScreen,
    id: "set-hivilux-clr",
    brand: "Hivilux",
    clr: true,
    ustCompatible: true,
  });
  const set = recommendSet([ustBeamer, elite, hivilux], {
    ...livingAnswers,
    throwDistance: "wall",
    placement: "wall",
    mechanism: "fixed",
  });
  expect(set.projector.product.throwClass).toBe("ust");
  expect(set.screen.product.brand.toLowerCase()).toBe("hivilux");
});

test("merk-normalisatie is hoofdletterongevoelig", () => {
  const a = commercialBrandPoints(createProduct({ ...baseScreen, brand: "elite screens" }), {
    projectorKind: "standard",
  });
  const b = commercialBrandPoints(createProduct({ ...baseScreen, brand: "Elite Screens" }), {
    projectorKind: "standard",
  });
  expect(a).toBe(b);
  expect(a).toBe(10);
});
