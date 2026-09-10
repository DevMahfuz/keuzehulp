import { MOCK_SCREENS } from "../data/mockProducts";
import { rankScreens } from "./screenScoring";
import { compatibleScreenAnswers } from "./setScoring";
import { MOCK_PROJECTORS } from "../data/mockProducts";
import { recommendSet } from "./setScoring";

test("UST-beamer krijgt geen standaard matte doek als beste match", () => {
  const ranked = rankScreens(MOCK_SCREENS, {
    placement: "wall",
    mechanism: "fixed",
    screenSize: "100_120",
    projectorKind: "ust",
    ambientLight: "lots",
    budget: "flex",
  });
  const feasible = ranked.filter((r) => !r.infeasible);
  expect(feasible[0].product.ustCompatible).toBe(true);
  const elite = ranked.find((r) => r.product.id === "mock-screen-elite-spectrum-100");
  expect(elite.infeasible).toBe(true);
});

test("normale beamer krijgt geen CLR UST-doek als haalbare topkeuze", () => {
  const ranked = rankScreens(MOCK_SCREENS, {
    placement: "wall",
    mechanism: "fixed",
    screenSize: "100_120",
    projectorKind: "standard",
    ambientLight: "dark",
    budget: "flex",
  });
  const top = ranked.filter((r) => !r.infeasible)[0];
  expect(top.product.clr).toBeFalsy();
});

test("complete set: UST projector koppelt UST-compatible scherm", () => {
  const set = recommendSet([...MOCK_PROJECTORS, ...MOCK_SCREENS], {
    usage: "movies",
    ambientLight: "some",
    screenSize: "120_150",
    throwDistance: "wall",
    budget: "2500plus",
    priority: "picture",
    placement: "wall",
    mechanism: "fixed",
  });
  expect(set.projector.product.throwClass).toBe("ust");
  expect(set.screen.product.ustCompatible).toBe(true);
  const answers = compatibleScreenAnswers(set.projector.product, { screenSize: "120_150", placement: "wall" });
  expect(answers.projectorKind).toBe("ust");
});
