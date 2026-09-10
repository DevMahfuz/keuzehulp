import { ANSWER_LABELS } from "../data/questions";

export function labelFor(questionId, value) {
  return ANSWER_LABELS[questionId]?.[value] || value;
}

export function summaryChips(answers) {
  return Object.entries(answers)
    .filter(([, v]) => v != null)
    .map(([k, v]) => labelFor(k, v));
}

export function stockLabel(product) {
  if (product.available === false) return { text: "Niet op voorraad", out: true };
  if (product.stock === 0) return { text: "Niet op voorraad", out: true };
  if (product.stock == null) return { text: "Voorraad onbekend", out: false };
  if (product.stock <= 3) return { text: "Nog maar een paar beschikbaar", out: false };
  return { text: "Op voorraad", out: false };
}

export function keySpecs(product, answers = {}) {
  const specs = [];
  if (product.native4K) specs.push("Native 4K");
  else if (product.resolution) specs.push(product.resolution);
  if (product.brightnessAnsi) {
    specs.push(product.brightnessUnit === "led" ? `${product.brightnessLed} LED-lumen` : `${product.brightnessAnsi} ANSI-lumen`);
  } else if (product.brightnessLed) {
    specs.push(`${product.brightnessLed} LED-lumen`);
  }
  if (product.throwRatioMin != null && (answers.throwDistance === "under_2" || answers.throwDistance === "wall" || product.throwClass === "short" || product.throwClass === "ust")) {
    const same = product.throwRatioMin === product.throwRatioMax;
    specs.push(same ? `Throw ${String(product.throwRatioMin).replace(".", ",")}:1` : `Throw ${product.throwRatioMin}–${product.throwRatioMax}:1`);
  } else if (product.throwClass === "ust") specs.push("Ultra short throw");
  else if (product.throwClass === "short") specs.push("Short throw");
  if (answers.usage === "gaming" && product.inputLag != null) {
    specs.push(`${String(product.inputLag).replace(".", ",")} ms input lag`);
  }
  if ((answers.usage === "movies" || answers.room === "bedroom" || answers.priority === "quiet") && product.noiseLevel != null) {
    specs.push(`${product.noiseLevel} dB`);
  }
  if (product.lightSource) specs.push(product.lightSource);
  if (product.smartBuiltIn) specs.push("Smart");
  if (product.gaming && answers.usage === "gaming") specs.push("Gaming");
  if (product.sizeInches) specs.push(`${product.sizeInches} inch`);
  if (product.clr) specs.push("CLR / UST-doek");
  else if (product.alr) specs.push("ALR");
  return [...new Set(specs)].slice(0, 6);
}
