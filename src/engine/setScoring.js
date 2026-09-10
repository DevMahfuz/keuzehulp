import { CATEGORIES } from "./productModel";
import { rankScreens } from "./screenScoring";
import { recommend } from "./recommend";

export function compatibleScreenAnswers(projector, setAnswers) {
  return {
    screenSize: setAnswers.screenSize,
    budget: setAnswers.budget === "500" ? "1000" : setAnswers.budget === "1000" ? "1000plus" : "flex",
    placement: setAnswers.placement && setAnswers.placement !== "any" ? setAnswers.placement : "wall",
    mechanism: setAnswers.mechanism || "any",
    projectorKind: projector.throwClass === "ust" ? "ust" : "standard",
    ambientLight: setAnswers.ambientLight,
  };
}

export function pickAccessories(products, projector) {
  const mounts = products.filter((p) => p.category === CATEGORIES.MOUNT && p.available !== false);
  const cables = products.filter((p) => p.category === CATEGORIES.CABLE && p.available !== false);
  const mount =
    projector.throwClass === "ust"
      ? mounts.find((m) => m.mountType === "ust-cabinet") || mounts[0]
      : mounts.find((m) => m.mountType === "ceiling") || mounts[0];
  const cable = cables[0] || null;
  return { mount: mount || null, cable };
}

export function recommendSet(products, answers) {
  const rec = recommend(products, answers, "projector");
  const projectorPick = rec.items[0] || rec.ranked?.[0];
  if (!projectorPick) {
    return { projector: null, screen: null, accessories: [], total: 0 };
  }

  const screenAnswers = compatibleScreenAnswers(projectorPick.product, answers);
  const screens = rankScreens(products, screenAnswers);
  const screenRec = recommend(products, screenAnswers, "screen");
  const compatible = screens.find((s) => !s.infeasible && !s.nearest);
  const screenPick = compatible || screenRec.items.find((s) => !s.infeasible) || screenRec.items[0] || null;

  const { mount, cable } = pickAccessories(products, projectorPick.product);
  const accessories = [mount, cable].filter(Boolean).map((product) => ({
    product,
    optional: true,
    reason:
      product.category === CATEGORIES.MOUNT
        ? projectorPick.product.throwClass === "ust"
          ? "Meubel/beugel zodat de beamer vlak voor het scherm staat"
          : "Stevige plafondmontage voor een vaste opstelling"
        : "HDMI-kabel om beeldbron en beamer te verbinden",
  }));

  const parts = [projectorPick.product, screenPick?.product, ...accessories.map((a) => a.product)].filter(Boolean);
  const total = parts.reduce((sum, p) => sum + (p.price || 0), 0);

  return {
    projector: projectorPick,
    screen: screenPick,
    accessories,
    total,
    screenAnswers,
    fallbackLevel: rec.fallbackLevel,
  };
}
