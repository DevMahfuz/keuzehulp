import { MOCK_PROJECTORS } from "../data/mockProducts";
import { rankProjectors } from "./projectorScoring";
import { evaluateThrowFit } from "./throwFit";

const livingBrightLarge = {
  usage: "tv",
  ambientLight: "lots",
  screenSize: "120_150",
  throwDistance: "2_3",
  budget: "1500",
  priority: "brightness",
};

const darkCinema = {
  usage: "movies",
  ambientLight: "dark",
  screenSize: "100_120",
  throwDistance: "3_4",
  budget: "1500",
  priority: "picture",
};

const gamer = {
  usage: "gaming",
  ambientLight: "some",
  screenSize: "100_120",
  throwDistance: "2_3",
  budget: "1500",
  priority: "gaming",
  gamingLevel: "competitive",
};

const ust = {
  usage: "movies",
  ambientLight: "some",
  screenSize: "120_150",
  throwDistance: "wall",
  budget: "2500plus",
  priority: "picture",
};

const lowBudget = {
  usage: "office",
  ambientLight: "some",
  screenSize: "up_to_100",
  throwDistance: "3_4",
  budget: "500",
  priority: "value",
};

const office = {
  usage: "office",
  ambientLight: "bright",
  screenSize: "up_to_100",
  throwDistance: "3_4",
  budget: "1000",
  priority: "brightness",
};

function ids(ranked) {
  return ranked.map((r) => r.product.id);
}

test("lichte woonkamer + groot beeld: zwakke portable beamers niet bovenaan", () => {
  const ranked = rankProjectors(MOCK_PROJECTORS, livingBrightLarge);
  expect(ranked[0].infeasible).toBe(false);
  expect(ranked[0].product.id).not.toBe("mock-xgimi-mogo-3-pro");
  const mogo = ranked.find((r) => r.product.id === "mock-xgimi-mogo-3-pro");
  expect(mogo.matchScore).toBeLessThan(ranked[0].matchScore);
  expect(ranked[0].product.brightnessAnsi).toBeGreaterThanOrEqual(2000);
});

test("donkere home cinema: 4K home cinema eindigt boven kantoormodellen", () => {
  const ranked = rankProjectors(MOCK_PROJECTORS, darkCinema);
  const top = ranked.filter((r) => !r.infeasible).slice(0, 3);
  expect(top.some((r) => r.product.homeCinema)).toBe(true);
  expect(top[0].product.id).not.toBe("mock-epson-eb-e01");
});

test("gamer: lage input lag en gaming-modellen winnen", () => {
  const ranked = rankProjectors(MOCK_PROJECTORS, gamer).filter((r) => !r.infeasible);
  expect(ranked[0].product.gaming).toBe(true);
  expect(ranked[0].product.inputLag).toBeLessThanOrEqual(21);
});

test("UST / zeer korte afstand: alleen UST is haalbaar", () => {
  const ranked = rankProjectors(MOCK_PROJECTORS, ust);
  const feasible = ranked.filter((r) => !r.infeasible);
  expect(feasible.length).toBeGreaterThan(0);
  feasible.forEach((r) => {
    expect(r.product.throwClass).toBe("ust");
  });
  const longThrow = ranked.find((r) => r.product.id === "mock-epson-eh-tw7100");
  expect(longThrow.infeasible).toBe(true);
  expect(evaluateThrowFit(longThrow.product, ust).infeasible).toBe(true);
  expect(feasible[0].matchScore).toBeGreaterThan(longThrow.matchScore);
});

test("laag budget: premium UST is niet de beste match", () => {
  const ranked = rankProjectors(MOCK_PROJECTORS, lowBudget).filter((r) => !r.infeasible);
  expect(ranked[0].product.price).toBeLessThan(2000);
  expect(ranked[0].product.id).not.toBe("mock-samsung-premiere-lsp9t");
});

test("kantoor/presentatie: office-modellen gaan voor home cinema UST", () => {
  const ranked = rankProjectors(MOCK_PROJECTORS, office).filter((r) => !r.infeasible);
  expect(ranked[0].product.office).toBe(true);
  expect(ranked[0].product.id).not.toBe("mock-formovie-theater");
});

test("incomplete specs are not ranked first over complete matches", () => {
  const incomplete = {
    ...MOCK_PROJECTORS[0],
    id: "incomplete-spec",
    brightnessAnsi: null,
    throwRatioMin: null,
    throwRatioMax: null,
    ust: false,
    shortThrow: false,
    throwClass: "standard",
  };
  const ranked = rankProjectors([...MOCK_PROJECTORS, incomplete], {
    usage: "movies",
    ambientLight: "lots",
    screenSize: "100_120",
    throwDistance: "3_4",
    budget: "flex",
    priority: "picture",
  });
  expect(ranked[0].product.id).not.toBe("incomplete-spec");
});

test("technically impossible throw is never first", () => {
  const ranked = rankProjectors(MOCK_PROJECTORS, ust);
  expect(ranked[0].infeasible).toBe(false);
  expect(ids(ranked)[0]).not.toBe("mock-optoma-uhd38x");
});
