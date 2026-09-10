import { isFourK, isNative4K } from "./factors";
import { formatMeters, formatPrice } from "../utils/format";
import { budgetCeiling } from "./factors";
import { getDistancePreset } from "./throwFit";

export function projectorReasons(product, answers, parts) {
  const pros = [];
  const cons = [];
  const warnings = [];
  const concessions = [];
  const { throwFit, brightness, budget, gaming, availability, intent, blockedInstall } = parts;

  if ((product.segments || []).some((s) => s.name === "consumer_home_cinema" && s.confidence >= 0.5) && answers.usage === "movies") {
    pros.push("Ontworpen voor films en thuisbioscoopgebruik");
  }
  if ((product.segments || []).some((s) => s.name === "living_room" && s.confidence >= 0.6) && (answers.usage === "tv" || answers.usage === "movies")) {
    pros.push("Past bij dagelijks gebruik in de woonkamer");
  }
  if (answers.usage === "gaming" && (product.segments || []).some((s) => s.name === "gaming" && s.confidence >= 0.7)) {
    if (product.inputLag != null || (product.refreshRate != null && product.refreshRate >= 120) || product.gaming) {
      pros.push("Sterke keuze voor games");
    }
  } else if (answers.usage === "gaming" && product.categorySignals?.gaming >= 0.8 && product.inputLag == null && !(product.refreshRate >= 120)) {
    // category only: no fake lag claim
  }
  if (answers.room === "bedroom" && (product.categorySignals?.bedroom >= 0.8 || (product.segments || []).some((s) => s.name === "bedroom"))) {
    pros.push("Past goed in een slaapkameropstelling");
  }
  if (answers.usage === "office" && product.categorySignals?.education >= 0.8) {
    pros.push("Bedoeld voor klaslokaal en onderwijs");
  }
  if (answers.usage === "office" && product.categorySignals?.business >= 0.8) {
    pros.push("Bedoeld voor presentaties en kantoorgebruik");
  }
  if (product.categorySignals?.goodSound >= 0.8 && (answers.priority === "ease" || answers.room === "bedroom" || answers.usage === "tv")) {
    pros.push("Handig als je geen losse speakers wilt");
  }
  if (answers.throwDistance === "wall" && product.categorySignals?.ust >= 0.8) {
    pros.push("Ultra short throw: beeld vanaf een meubel tegen de muur");
  }

  if (throwFit.needsUst && product.throwClass === "ust") {
    pros.push("Past bijna tegen de muur (ultra short throw)");
  } else if (!throwFit.infeasible && throwFit.range.known && !throwFit.nearest) {
    pros.push(`Geschikt voor ongeveer ${throwFit.sizeInches} inch`);
    pros.push("Goede match met jouw kijkafstand");
  }

  if (brightness.have && brightness.have >= brightness.need) {
    if (answers.ambientLight === "lots" || answers.ambientLight === "bright") {
      pros.push("Helder genoeg voor jouw woonkamer");
    } else {
      pros.push("Helder genoeg voor jouw kijkmoment");
    }
  } else if (brightness.uncertain) {
    cons.push("Lichtopbrengst is niet volledig opgegeven");
  } else if (brightness.dim) {
    cons.push("Iets krapper in helderheid dan ideaal");
    if (answers.ambientLight === "lots" || answers.ambientLight === "bright") {
      warnings.push("Voor het beste beeld adviseren we de ruimte iets te verduisteren.");
    }
  }

  if (answers.usage === "movies" && isNative4K(product)) {
    pros.push("Native 4K");
  } else if (answers.usage === "movies" && isFourK(product.resolution)) {
    pros.push("4K voor films en series");
  } else if (answers.usage === "office" && (product.office || product.specSignals?.business)) {
    if (product.brightnessAnsi) pros.push(`${product.brightnessAnsi} ANSI-lumen voor lichte ruimtes`);
    else pros.push("Gemaakt voor presentaties en scherpe tekst");
  } else if (answers.usage === "gaming" && (product.gaming || (product.inputLag != null && product.inputLag <= 35))) {
    pros.push("Geschikt voor gaming");
  } else if ((product.smartBuiltIn || (product.smart && !product.wifiOptional)) && (answers.usage === "tv" || answers.priority === "ease")) {
    pros.push("Apps aan boord: snel starten zonder extra kastje");
  } else if (isFourK(product.resolution) && !isNative4K(product)) {
    pros.push("4K-weergave (niet native 4K)");
  }

  if (product.inputLag != null && product.inputLag <= 20 && gaming.relevant) {
    const lagLabel = Number.isInteger(product.inputLag) ? String(product.inputLag) : String(product.inputLag).replace(".", ",");
    pros.push(`${lagLabel} ms input lag`);
  }

  if (answers.throwDistance === "under_2" && product.throwRatioMax != null && product.throwRatioMax <= 1) {
    const ratio = String(product.throwRatioMin === product.throwRatioMax ? product.throwRatioMax : `${product.throwRatioMin}–${product.throwRatioMax}`).replace(".", ",");
    pros.push(`Throw ratio ${ratio}:1`);
  }

  if (answers.usage === "movies" && product.noiseLevel != null && product.noiseLevel <= 24) {
    pros.push(`${product.noiseLevel} dB`);
  }

  if (product.wifiOptional && !product.wifiBuiltIn && (answers.usage === "tv" || answers.priority === "ease")) {
    warnings.push("WiFi is niet ingebouwd; daarvoor is een dongle of extra speler nodig.");
  }

  if (intent?.notes?.includes("csv_min_poor_daylight")) {
    const text = "Volgens de productkennis van Beamer-Winkel is dit model overdag minder sterk.";
    warnings.push(text);
    concessions.push({ code: "daylight", text });
  }
  if (intent?.notes?.includes("csv_min_no_smart")) {
    warnings.push("Geen ingebouwde smart functies; een losse mediaspeler is nodig.");
  }

  const cap = budget.cap ?? budgetCeiling(answers.budget);
  if (budget.overBy > 0 || budget.softOver) {
    const extra = budget.overBy || (product.price && cap ? product.price - cap : 0);
    if (extra > 0) {
      const text = `Deze projector ligt ${formatPrice(extra)} boven het door jou gekozen budget.`;
      cons.push("Iets boven je richtbudget, omdat het beter past");
      warnings.push(text);
      concessions.push({ code: "budget", text });
    }
  } else if (!budget.overBudget && answers.budget && answers.budget !== "flex") {
    pros.push("Past binnen jouw budget");
  }

  if (product.noiseLevel && product.noiseLevel <= 28 && answers.priority === "quiet") {
    pros.push("Relatief stille ventilator");
  }

  if (!availability.available) {
    cons.push("Momenteel niet op voorraad");
  }

  if (blockedInstall || intent?.notes?.includes("installation_not_for_consumer")) {
    const text = "Dit is een professionele installatieprojector en waarschijnlijk zwaarder uitgevoerd dan je voor thuis nodig hebt.";
    warnings.push(text);
    concessions.push({ code: "installation", text, severity: "critical" });
  }
  if (intent?.notes?.includes("daylight_outdoor_not_recommended")) {
    const text = "Projectie in direct daglicht of volle zon geeft zelden een goed beeld, ook niet met een extra heldere beamer.";
    warnings.push(text);
    concessions.push({ code: "outdoor_day", text, severity: "critical" });
  }

  if (throwFit.reason === "needs_ust") {
    const text = "Voor deze korte afstand is eigenlijk een beamer vlak tegen de muur nodig. Dit is een gewoon model.";
    warnings.push(text);
    concessions.push({ code: "ust", text, severity: "critical" });
  }
  if (throwFit.reason === "ust_not_short_throw") {
    const text = "Dit is een model dat bijna tegen de muur staat. Jij zocht een korte afstand, niet vlak tegen de muur.";
    warnings.push(text);
    concessions.push({ code: "ust_vs_short", text, severity: "critical" });
  }
  if (throwFit.reason === "not_short_throw") {
    const text = "Deze beamer heeft meer ruimte nodig dan de korte afstand die je koos.";
    warnings.push(text);
    concessions.push({ code: "short_throw", text, severity: "critical" });
  }
  if (throwFit.reason === "distance_mismatch") {
    const needed = throwFit.neededDistance ?? throwFit.range.min;
    const have = getDistancePreset(answers.throwDistance).meters;
    const extra = needed != null && have != null ? needed - have : null;
    const text =
      extra != null && extra > 0
        ? `Voor ${throwFit.sizeInches} inch heeft deze beamer ongeveer ${formatMeters(needed)} afstand nodig. Je gaf aan ongeveer ${formatMeters(have)} beschikbaar te hebben.`
        : `Voor ±${throwFit.sizeInches} inch heeft dit model ongeveer ${formatMeters(throwFit.range.min)} tot ${formatMeters(throwFit.range.max)} nodig.`;
    warnings.push(text);
    concessions.push({ code: "throw", text, severity: "critical" });
  }

  return { pros: pros.slice(0, 5), cons: cons.slice(0, 3), warnings: warnings.slice(0, 3), concessions };
}

export function screenReasons(product, answers, parts) {
  const pros = [];
  const cons = [];
  const warnings = [];
  const concessions = [];

  if (product.sizeInches) {
    pros.push(`${product.sizeInches} inch kijkformaat`);
  }
  if (answers.projectorKind === "ust" && product.ustCompatible) {
    pros.push("Gemaakt voor ultra short throw (CLR/ALR)");
  }
  if (answers.projectorKind === "standard" && !product.clr) {
    pros.push("Past bij een gewone beamer");
  }
  if (product.electric) pros.push("Elektrisch op- en uitrollen");
  if (product.fixedFrame) pros.push("Strak vast frame, geen golven in het doek");
  if (product.mobile) pros.push("Makkelijk mee te nemen");
  if ((answers.ambientLight === "lots" || answers.ambientLight === "bright") && (product.alr || product.clr)) {
    pros.push("Houdt beter contrast bij omgevingslicht");
  }
  if (parts.budget?.softOver || parts.budget?.overBy > 0) cons.push("Iets boven je richtbudget");
  if (answers.projectorKind === "ust" && !product.ustCompatible) {
    const text = "Een UST-beamer geeft op dit doek vaak een fletser beeld. Een CLR-doek is beter.";
    warnings.push(text);
    concessions.push({ code: "ust_screen", text, severity: "critical" });
  }
  if (answers.projectorKind === "standard" && product.clr) {
    const text = "CLR-doeken zijn bedoeld voor beamers vlak bij de muur, niet voor een gewone afstand.";
    warnings.push(text);
    concessions.push({ code: "clr_mismatch", text, severity: "critical" });
  }
  return { pros: pros.slice(0, 5), cons, warnings, concessions };
}
