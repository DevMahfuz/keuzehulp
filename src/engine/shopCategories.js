export function normalizeCategoryTitle(title) {
  return String(title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " en ")
    .replace(/beamers?/g, "beamer")
    .replace(/projectors?/g, "projector")
    .replace(/schermen/g, "scherm")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SIGNAL_RULES = [
  { key: "homeCinema", weight: 1, tests: [/^home cinema$/, /thuisbioscoop/, /home cinema advies/] },
  { key: "gaming", weight: 1, tests: [/^game beamer/, /^gaming/, /game beamer/] },
  { key: "business", weight: 1, tests: [/zakelijke beamer/, /^zakelijk$/, /corporate/, /^business/] },
  { key: "education", weight: 1, tests: [/school beamer/, /onderwijs/, /^school$/] },
  { key: "ust", weight: 1, tests: [/^ultra short throw$/, /^ust$/, /ultra short throw/] },
  { key: "shortThrow", weight: 1, tests: [/^short throw/, /korte projectie/] },
  { key: "mini", weight: 1, tests: [/^mini beamer/, /^portable/, /draagbaar/] },
  { key: "livingRoom", weight: 1, tests: [/voor de woonkamer/, /woonkamer/] },
  { key: "bedroom", weight: 1, tests: [/voor de slaapkamer/, /slaapkamer/] },
  { key: "outdoor", weight: 1, tests: [/^buiten beamer$/, /voor buiten/, /buiten projecteren/] },
  { key: "goodSound", weight: 1, tests: [/met goed geluid/, /goed geluid/, /bose audio/] },
  { key: "installation", weight: 1, tests: [/^installatie$/, /^professioneel$/, /installatie beamer/] },
  { key: "largeVenue", weight: 1, tests: [/large venue/, /grote zaal/] },
  { key: "interactive", weight: 0.8, tests: [/^interactief$/] },
  { key: "spec4k", weight: 0.4, tests: [/^4k$/, /^4k beamer/] },
  { key: "specHd", weight: 0.3, tests: [/^hd$/] },
  { key: "specLaser", weight: 0.3, tests: [/^laser$/] },
  { key: "specLed", weight: 0.3, tests: [/^led$/] },
  { key: "spec3d", weight: 0.3, tests: [/^3d$/] },
  { key: "screenElectric", weight: 1, tests: [/elektrische scherm/, /elektrisch projectiescherm/] },
  { key: "screenManual", weight: 1, tests: [/handmatige scherm/, /handmatig projectiescherm/] },
  { key: "screenFixed", weight: 1, tests: [/^fixed frame$/, /vast frame/, /acoustic fixed frame/, /alr fixed frame/, /4k fixed frame/] },
  { key: "screenTripod", weight: 1, tests: [/statief scherm/, /op statief/] },
  { key: "screenFloor", weight: 1, tests: [/floor up/, /vloerscherm/] },
  { key: "screenMobile", weight: 1, tests: [/mobiele scherm/, /mobiel scherm/] },
  { key: "screenOutdoor", weight: 1, tests: [/outdoor scherm/, /voor buiten/] },
  { key: "ustScreen", weight: 1, tests: [/alr voor ust/, /geschikt voor ust/, /ust beamer/] },
  { key: "alr", weight: 0.8, tests: [/\balr\b/, /high contrast/] },
  { key: "acoustic", weight: 0.7, tests: [/akoestisch/, /acoustic/] },
  { key: "tabTension", weight: 0.7, tests: [/tab tension/, /tensioned/] },
];

const EMPTY_SIGNALS = Object.fromEntries(
  [...new Set(SIGNAL_RULES.map((r) => r.key))].map((k) => [k, 0])
);

export function categorySignalsFromTitles(titles = []) {
  const signals = { ...EMPTY_SIGNALS };
  const sources = {};
  for (const title of titles) {
    const n = normalizeCategoryTitle(title);
    if (!n) continue;
    for (const rule of SIGNAL_RULES) {
      if (rule.tests.some((re) => re.test(n))) {
        signals[rule.key] = Math.max(signals[rule.key] || 0, rule.weight);
        if (!sources[rule.key]) sources[rule.key] = [];
        if (!sources[rule.key].includes(title)) sources[rule.key].push(title);
      }
    }
  }
  return { signals, sources };
}

export function shopCategoryTitles(product) {
  const list = product.shopCategories || product.categories || [];
  return list.map((c) => (typeof c === "string" ? c : c.title || c.name)).filter(Boolean);
}
