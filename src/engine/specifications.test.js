import fs from "fs";
import path from "path";
import { createProduct, CATEGORIES } from "./productModel";
import { attachSegments } from "./segments";
import { rankProjectors } from "./projectorScoring";
import {
  parseCsv,
  parseThrowRatio,
  parseBrightness,
  parseInputLag,
  parseResolution,
  parseSpecRow,
  inferThrowClassFromRatio,
  applySpecToProduct,
  enrichProductList,
} from "./specifications";
import { inferThrowClass, THROW_CLASS_THRESHOLDS } from "../utils/screenGeometry";

const csvPath = path.join(__dirname, "..", "..", "data", "projector-specifications.csv");
const csvText = fs.readFileSync(csvPath, "utf8");
const parsedCsv = parseCsv(csvText);
const specRows = parsedCsv.rows.map(parseSpecRow);
const byTitle = (re) => specRows.find((r) => re.test(r.shortTitle));

test("CSV leest 242 specificatieregels", () => {
  expect(parsedCsv.errors.filter((e) => e !== "unexpected_header")).toEqual([]);
  expect(parsedCsv.rows.length).toBe(242);
});

test("throw ratio parser ondersteunt komma, streepjes en :1", () => {
  expect(parseThrowRatio("1.32 – 2.15:1")).toEqual({ min: 1.32, max: 2.15 });
  expect(parseThrowRatio("1.36-2.18")).toEqual({ min: 1.36, max: 2.18 });
  expect(parseThrowRatio("1.38:1 - 2.21:1")).toEqual({ min: 1.38, max: 2.21 });
  expect(parseThrowRatio("0.50:1")).toEqual({ min: 0.5, max: 0.5 });
  expect(parseThrowRatio("1,22 - 1,47 :1")).toEqual({ min: 1.22, max: 1.47 });
  expect(parseThrowRatio('"1.32 – 2.15:1"')).toEqual({ min: 1.32, max: 2.15 });
});

test("0.50:1 is short throw, geen UST", () => {
  expect(THROW_CLASS_THRESHOLDS.ustMax).toBe(0.4);
  expect(inferThrowClass({ throwRatioMin: 0.5, throwRatioMax: 0.5 })).toBe("short");
  expect(inferThrowClassFromRatio({ throwRatioMin: 0.5, throwRatioMax: 0.5, title: "Optoma UHD35STx" })).toBe("short");
  expect(inferThrowClass({ throwRatioMin: 0.25, throwRatioMax: 0.27 })).toBe("ust");
});

test("Epson EH-TW7000 uit CSV", () => {
  const row = byTitle(/EH-TW7000/);
  expect(row.suitable.homeCinema).toBe(true);
  expect(row.suitable.gaming).toBe(true);
  expect(row.resolution.className).toBe("4K_UHD");
  expect(row.resolution.native4K).toBe(false);
  expect(row.brightness.generic).toBe(3000);
  expect(row.throwRatioMin).toBeCloseTo(1.32);
  expect(row.throwRatioMax).toBeCloseTo(2.15);
});

test("Optoma UHD35STx: ANSI, 0.50:1, 4.2 ms, short throw, wifi dongle", () => {
  const row = byTitle(/UHD35STx/);
  expect(row.brightness.ansi).toBe(3600);
  expect(row.throwRatioMin).toBeCloseTo(0.5);
  expect(row.inputLag).toBeCloseTo(4.2);
  expect(row.shortThrow).toBe(true);
  expect(row.ust).toBe(false);
  expect(row.wifiOptional).toBe(true);
  expect(row.wifiBuiltIn).toBe(false);
  expect(row.hints.shortThrow).toBe(true);
});

test("Sony VPL-XW5000 native 4K high-end cinema", () => {
  const row = byTitle(/XW5000 B/);
  expect(row.resolution.native4K).toBe(true);
  expect(row.suitable.premiumHomeCinema).toBe(true);
  expect(row.brightness.ansi).toBe(2000);
  expect(row.noiseLevel).toBe(21);
});

test("ViewSonic LS920WU large venue + HDBaseT", () => {
  const row = byTitle(/LS920WU/i);
  expect(row.suitable.largeVenue).toBe(true);
  expect(row.suitable.brightRoom).toBe(true);
  expect(row.brightness.ansi).toBe(6000);
  expect(row.connectivity.hdbaset).toBe(true);
  expect(row.resolution.className).toBe("WUXGA");
});

test("Epson EB-W51 kantoor en school", () => {
  const row = byTitle(/EB-W51/);
  expect(row.suitable.business).toBe(true);
  expect(row.suitable.education).toBe(true);
  expect(row.suitable.homeCinema).toBe(false);
  expect(row.brightness.ansi).toBe(4000);
});

test("Epson EH-LS800 UST via pluspunt zonder throw ratio", () => {
  const row = byTitle(/LS800W - 4K/);
  expect(row.suitable.smart).toBe(true);
  expect(row.ust).toBe(true);
  expect(row.hints.ust).toBe(true);
});

test("JVC DLA-NP5 native cinema 4K", () => {
  const row = byTitle(/DLA-NP5 Zwart/);
  expect(row.resolution.native4K).toBe(true);
  expect(row.resolution.cinema4K).toBe(true);
  expect(row.brightness.ansi).toBe(1900);
  expect(row.suitable.homeCinema).toBe(true);
});

test("LED lumen wordt niet als ANSI behandeld", () => {
  expect(parseBrightness("2400 LED Lumen").ansi).toBeNull();
  expect(parseBrightness("2400 LED Lumen").led).toBe(2400);
  expect(parseInputLag("-")).toBeNull();
});

test("Native 4K home cinema wint van 6000 lumen large venue in donkere bioscoop", () => {
  const jvc = attachSegments(
    applySpecToProduct(
      createProduct({
        id: "jvc",
        category: CATEGORIES.PROJECTOR,
        brand: "JVC",
        title: "JVC DLA-NP5",
        price: 5000,
        available: true,
        stock: 2,
      }),
      byTitle(/DLA-NP5 Zwart/),
      "internalId"
    )
  );
  const venue = attachSegments(
    applySpecToProduct(
      createProduct({
        id: "ls920",
        category: CATEGORIES.PROJECTOR,
        brand: "ViewSonic",
        title: "ViewSonic LS920WU",
        price: 2500,
        available: true,
        stock: 2,
      }),
      byTitle(/LS920WU/i),
      "internalId"
    )
  );
  const ranked = rankProjectors([jvc, venue], {
    usage: "movies",
    ambientLight: "dark",
    screenSize: "100_120",
    throwDistance: "3_4",
    budget: "flex",
    priority: "picture",
  });
  expect(ranked[0].product.id).toBe("jvc");
  expect(ranked.find((r) => r.product.id === "ls920").infeasible || ranked[0].product.id === "jvc").toBeTruthy();
});

test("UHD35STx is sterke short-throw gaming match", () => {
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
        throwRatioMin: 1.5,
        throwRatioMax: 1.7,
      }),
      byTitle(/UHD35STx/),
      "ean"
    )
  );
  expect(st.throwClass).toBe("short");
  expect(st.inputLag).toBeCloseTo(4.2);
  const ranked = rankProjectors([st], {
    usage: "gaming",
    ambientLight: "some",
    screenSize: "120_150",
    throwDistance: "under_2",
    budget: "1500",
    priority: "gaming",
    gamingLevel: "competitive",
  });
  expect(ranked[0].infeasible).toBe(false);
  expect(ranked[0].breakdown.gaming.score).toBeGreaterThan(70);
});

test("EB-W51 is geen home-cinema topmatch tegen TW7000", () => {
  const school = attachSegments(
    applySpecToProduct(
      createProduct({
        id: "w51",
        category: CATEGORIES.PROJECTOR,
        brand: "Epson",
        title: "Epson EB-W51",
        price: 600,
        available: true,
        stock: 4,
        throwRatioMin: 1.3,
        throwRatioMax: 1.6,
      }),
      byTitle(/EB-W51/),
      "internalId"
    )
  );
  const cinema = attachSegments(
    applySpecToProduct(
      createProduct({
        id: "tw7000",
        category: CATEGORIES.PROJECTOR,
        brand: "Epson",
        title: "Epson EH-TW7000",
        price: 1400,
        available: true,
        stock: 4,
      }),
      byTitle(/EH-TW7000/),
      "internalId"
    )
  );
  const ranked = rankProjectors([school, cinema], {
    usage: "movies",
    ambientLight: "dark",
    screenSize: "100_120",
    throwDistance: "3_4",
    budget: "flex",
    priority: "picture",
  });
  expect(ranked[0].product.id).toBe("tw7000");
});

test("matching via Internal_ID is exact", () => {
  const live = [
    createProduct({
      id: "108626710",
      productId: "108626710",
      category: CATEGORIES.PROJECTOR,
      brand: "Epson",
      title: "Epson EH-TW7000 - 4K - 3000 Lumen",
      sku: "EPS-V11H961040",
      ean: "8715946670867",
    }),
  ];
  const { report, products } = enrichProductList(live, parsedCsv.rows);
  expect(report.byMethod.internalId).toBeGreaterThanOrEqual(1);
  expect(products[0].specEnriched).toBe(true);
  expect(products[0].specMatchMethod).toBe("internalId");
  expect(products[0].throwRatioMin).toBeCloseTo(1.32);
});

test("resolution parser native vs 4K UHD", () => {
  expect(parseResolution("3840 x 2160 4K UHD").native4K).toBe(false);
  expect(parseResolution("3840 x 2160 Native 4K UHD").native4K).toBe(true);
  expect(parseResolution("4096 x 2160 Native 4K").cinema4K).toBe(true);
});
