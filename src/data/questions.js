import { inchHint } from "../utils/format";

const why = (text) => text;

export const PROJECTOR_QUESTIONS = [
  {
    id: "usage",
    title: "Waar ga je de beamer vooral voor gebruiken?",
    why: why("Zo kiezen we een model dat past bij films, sport, games of presentaties — zonder dat jij specificaties hoeft te kennen."),
    options: [
      { value: "movies", label: "Films & series", hint: "Donkere bioscoopavonden" },
      { value: "tv", label: "TV & streaming", hint: "Dagelijks kijken in de woonkamer" },
      { value: "gaming", label: "Gaming", hint: "Console of pc op groot beeld" },
      { value: "sport", label: "Sport", hint: "Snel beeld en veel helderheid" },
      { value: "office", label: "Presentaties / kantoor", hint: "Tekst scherp, ook bij licht" },
      { value: "outdoor", label: "Buiten", hint: "Tuin, terras of evenement" },
      { value: "mixed", label: "Van alles wat", hint: "Een allrounder" },
    ],
  },
  {
    id: "room",
    title: "In welke ruimte ga je vooral kijken?",
    why: why("Woonkamer, thuisbioscoop of slaapkamer vragen om een ander type beamer — niet alleen andere specificaties."),
    showIf: (answers) => ["movies", "tv", "gaming", "mixed", "sport"].includes(answers.usage),
    options: [
      { value: "living", label: "Woonkamer", hint: "Dagelijks gebruik, vaak met licht" },
      { value: "cinema", label: "Thuisbioscoop / donkere kamer" },
      { value: "bedroom", label: "Slaapkamer", hint: "Compact, stil, eenvoudig" },
    ],
  },
  {
    id: "ambientLight",
    title: "Hoe licht is de ruimte meestal tijdens het kijken?",
    why: why("Licht in de kamer bepaalt hoeveel licht de beamer moet geven. Jij kiest de sfeer; wij vertalen dat naar helderheid."),
    options: [
      { value: "dark", label: "Vooral donker", hint: "Gordijnen dicht, avond" },
      { value: "some", label: "Een beetje daglicht", hint: "Lampen of licht door kieren" },
      { value: "lots", label: "Veel daglicht", hint: "Woonkamer overdag" },
      { value: "bright", label: "Heel lichte ruimte", hint: "Grote ramen, weinig verduistering" },
    ],
  },
  {
    id: "screenSize",
    title: "Hoe groot wil je ongeveer kijken?",
    why: why("De beeldmaat bepaalt hoeveel ruimte de beamer nodig heeft en hoe helder het beeld blijft."),
    options: [
      { value: "up_to_100", label: "Tot 100 inch", hint: inchHint(100) },
      { value: "100_120", label: "100–120 inch", hint: inchHint(110) },
      { value: "120_150", label: "120–150 inch", hint: inchHint(135) },
      { value: "over_150", label: "Groter dan 150 inch", hint: inchHint(160) },
      { value: "unknown", label: "Geen idee", hint: "We rekenen met een gangbare woonkamermaat" },
    ],
  },
  {
    id: "throwDistance",
    title: "Hoe ver kan de beamer ongeveer van de muur of het scherm staan?",
    why: why("Zo weten we welke beamer groot genoeg kan projecteren in jouw ruimte — of dat je een model bijna tegen de muur nodig hebt."),
    options: [
      { value: "wall", label: "Bijna tegen de muur", hint: "Op een meubel, vlak voor het scherm" },
      { value: "under_2", label: "Minder dan 2 meter", hint: "Korte afstand, bijvoorbeeld vanaf een kast" },
      { value: "2_3", label: "2–3 meter", hint: "Typische woonkamer" },
      { value: "3_4", label: "3–4 meter", hint: "Ruime opstelling" },
      { value: "over_4", label: "Meer dan 4 meter", hint: "Lange woonkamer of zaal" },
      { value: "unknown", label: "Geen idee", hint: "We houden extra opties open" },
    ],
  },
  {
    id: "budget",
    title: "Wat is ongeveer je budget?",
    why: why("Budget is een richtlijn, geen harde muur. Een model iets erboven mag mee als het duidelijk beter past."),
    options: [
      { value: "500", label: "Tot €500" },
      { value: "1000", label: "€500–€1.000" },
      { value: "1500", label: "€1.000–€1.500" },
      { value: "2500", label: "€1.500–€2.500" },
      { value: "2500plus", label: "€2.500+" },
      { value: "flex", label: "Budget is minder belangrijk" },
    ],
  },
  {
    id: "priority",
    title: "Wat vind je het belangrijkst?",
    why: why("Dit geeft extra gewicht aan beeld, helderheid, gemak of prijs — bovenop wat technisch past."),
    options: [
      { value: "picture", label: "Beste beeldkwaliteit" },
      { value: "brightness", label: "Veel helderheid" },
      { value: "gaming", label: "Gaming" },
      { value: "ease", label: "Makkelijk in gebruik" },
      { value: "quiet", label: "Stil apparaat" },
      { value: "value", label: "Beste prijs/kwaliteit" },
    ],
  },
  {
    id: "gamingLevel",
    title: "Wat voor gamer ben je?",
    why: why("Fanatieke gamers hebben baat bij een beamer die razendsnel reageert. Casual gamers hebben dat minder hard nodig."),
    showIf: (answers) => answers.usage === "gaming" || answers.priority === "gaming",
    options: [
      { value: "casual", label: "Af en toe", hint: "Een avondje per week is prima" },
      { value: "console", label: "Console gaming", hint: "PS5, Xbox of Switch" },
      { value: "competitive", label: "Fanatiek / lage input lag belangrijk", hint: "Snel reageren telt" },
    ],
  },
  {
    id: "outdoorWhen",
    title: "Wanneer wil je vooral buiten kijken?",
    why: why("Overdag in de zon is projectie zelden een goed idee. 's Avonds of in de schemer kan het wél."),
    showIf: (answers) => answers.usage === "outdoor",
    options: [
      { value: "day", label: "Overdag", hint: "Ook bij daglicht of zon" },
      { value: "dusk", label: "In de schemer" },
      { value: "night", label: "'s Avonds / donker" },
    ],
  },
];

export const SCREEN_QUESTIONS = [
  {
    id: "placement",
    title: "Waar komt het scherm?",
    why: why("Montage bepaalt of je een vast frame, plafondrol of mobiel scherm nodig hebt."),
    options: [
      { value: "wall", label: "Aan de muur" },
      { value: "ceiling", label: "Aan het plafond" },
      { value: "floor", label: "Op de vloer", hint: "Omhoogkomend scherm" },
      { value: "mobile", label: "Mobiel / meenemen" },
    ],
  },
  {
    id: "mechanism",
    title: "Wil je het scherm kunnen oprollen?",
    why: why("Elektrisch is het comfortabelst, handmatig voordeliger, een vast frame geeft het strakste beeld."),
    showIf: (answers) => answers.placement !== "mobile",
    options: [
      { value: "electric", label: "Elektrisch" },
      { value: "manual", label: "Handmatig" },
      { value: "fixed", label: "Vast frame" },
      { value: "any", label: "Geen voorkeur" },
    ],
  },
  {
    id: "screenSize",
    title: "Hoe groot wil je kijken?",
    why: why("We matchen de doekmaat op wat je wilt zien — in inch én ongeveer in meters."),
    options: [
      { value: "up_to_100", label: "Tot 100 inch", hint: inchHint(100) },
      { value: "100_120", label: "100–120 inch", hint: inchHint(110) },
      { value: "120_150", label: "120–150 inch", hint: inchHint(135) },
      { value: "over_150", label: "Groter dan 150 inch", hint: inchHint(160) },
      { value: "unknown", label: "Geen idee" },
    ],
  },
  {
    id: "projectorKind",
    title: "Welke beamer gebruik je?",
    why: why("Een beamer bijna tegen de muur heeft een speciaal contrast-doek nodig. Een gewone beamer juist niet."),
    options: [
      { value: "standard", label: "Gewone beamer, verder van de muur" },
      { value: "ust", label: "Beamer bijna tegen de muur", hint: "Vaak op een tv-meubel" },
      { value: "unknown", label: "Weet ik niet" },
    ],
  },
  {
    id: "ambientLight",
    title: "Hoeveel omgevingslicht is er?",
    why: why("Bij veel daglicht helpt een speciaal contrast-doek om het beeld donkerder en leesbaarder te houden."),
    options: [
      { value: "dark", label: "Vooral donker" },
      { value: "some", label: "Een beetje daglicht" },
      { value: "lots", label: "Veel daglicht" },
      { value: "bright", label: "Heel lichte ruimte" },
    ],
  },
  {
    id: "budget",
    title: "Wat is ongeveer je budget voor het scherm?",
    why: why("Ook hier is budget een richtlijn. Een beter doek mag iets erboven als het technisch nodig is."),
    options: [
      { value: "200", label: "Tot €200" },
      { value: "500", label: "€200–€500" },
      { value: "1000", label: "€500–€1.000" },
      { value: "1000plus", label: "€1.000+" },
      { value: "flex", label: "Budget is minder belangrijk" },
    ],
  },
];

export const SET_EXTRA_QUESTIONS = [
  {
    id: "placement",
    title: "Waar komt het projectiescherm?",
    why: why("We zoeken een scherm dat bij jouw beamer én bij de montage past."),
    options: [
      { value: "wall", label: "Aan de muur" },
      { value: "ceiling", label: "Aan het plafond" },
      { value: "floor", label: "Op de vloer / omhoogkomend" },
      { value: "any", label: "Maakt me niet uit" },
    ],
  },
  {
    id: "mechanism",
    title: "Hoe wil je het scherm gebruiken?",
    options: [
      { value: "electric", label: "Elektrisch oprollen" },
      { value: "fixed", label: "Vast frame" },
      { value: "any", label: "Kies maar wat het beste past" },
    ],
  },
];

export function getQuestionsForCategory(category, answers = {}) {
  let list = [];
  if (category === "projector") list = PROJECTOR_QUESTIONS;
  else if (category === "screen") list = SCREEN_QUESTIONS;
  else if (category === "set") list = [...PROJECTOR_QUESTIONS, ...SET_EXTRA_QUESTIONS];
  return list.filter((q) => !q.showIf || q.showIf(answers));
}

export const CATEGORY_OPTIONS = [
  {
    value: "projector",
    emoji: "📽",
    title: "Ik zoek een beamer",
    text: "Wij vertalen jouw situatie naar het juiste model.",
  },
  {
    value: "screen",
    emoji: "🖥",
    title: "Ik zoek een projectiescherm",
    text: "Vast, elektrisch, mobiel of speciaal voor een beamer vlak bij de muur.",
  },
  {
    value: "set",
    emoji: "✨",
    title: "Ik wil een complete set",
    text: "Beamer, passend scherm en de juiste accessoires.",
  },
];

export const ANSWER_LABELS = {
  usage: {
    movies: "Films & series",
    tv: "TV & streaming",
    gaming: "Gaming",
    sport: "Sport",
    office: "Presentaties / kantoor",
    outdoor: "Buiten",
    mixed: "Van alles wat",
  },
  ambientLight: {
    dark: "Vooral donker",
    some: "Een beetje daglicht",
    lots: "Veel daglicht",
    bright: "Heel lichte ruimte",
  },
  screenSize: {
    up_to_100: "Tot 100 inch",
    "100_120": "100–120 inch",
    "120_150": "120–150 inch",
    over_150: "Groter dan 150 inch",
    unknown: "Beeldmaat open",
  },
  throwDistance: {
    wall: "Bijna tegen de muur",
    under_2: "Minder dan 2 m",
    "2_3": "2–3 meter",
    "3_4": "3–4 meter",
    over_4: "Meer dan 4 m",
    unknown: "Afstand open",
  },
  budget: {
    200: "Tot €200",
    500: "Tot €500",
    1000: "Tot €1.000",
    1500: "Tot €1.500",
    2500: "Tot €2.500",
    "2500plus": "€2.500+",
    "1000plus": "€1.000+",
    flex: "Flexibel budget",
  },
  priority: {
    picture: "Beste beeld",
    brightness: "Helderheid",
    gaming: "Gaming",
    ease: "Eenvoud",
    quiet: "Stil",
    value: "Prijs/kwaliteit",
  },
  gamingLevel: {
    casual: "Af en toe gamen",
    console: "Console gaming",
    competitive: "Fanatiek gamen",
  },
  outdoorWhen: {
    day: "Buiten overdag",
    dusk: "Buiten in de schemer",
    night: "Buiten 's avonds",
  },
  room: {
    living: "Woonkamer",
    cinema: "Thuisbioscoop",
    bedroom: "Slaapkamer",
  },
  placement: {
    wall: "Aan de muur",
    ceiling: "Aan het plafond",
    floor: "Op de vloer",
    mobile: "Mobiel",
    any: "Montage open",
  },
  mechanism: {
    electric: "Elektrisch",
    manual: "Handmatig",
    fixed: "Vast frame",
    any: "Geen voorkeur",
  },
  projectorKind: {
    standard: "Normale beamer",
    ust: "Beamer bijna tegen de muur",
    unknown: "Beamer onbekend",
  },
};
