/**
 * Server-side classification + spec parsing (kept in sync with src/engine/classify + parseSpecs).
 * CommonJS so the Lightspeed catalog mapper can use it without a bundler.
 */

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const ACCESSORY_STRONG = [
  /plafondbeugel/,
  /muurbeugel/,
  /\bbeugel\b/,
  /\bhdmi\b/,
  /\bkabel(s)?\b/,
  /\bcable(s)?\b/,
  /afstandsbediening/,
  /3d[-\s]?bril/,
  /beamerlamp|vervangingslamp/,
  /luchtfilter|stoffilter/,
  /mediaspeler|android box/,
  /plafondplaat/,
  /ust[-\s]?meubel|schuiflade/,
  /montagearm/,
  /draagtas|carry\s*bag|\btas\b/,
  /gimbal/,
];

const SCREEN_STRONG = [
  /projectiescherm/,
  /projection\s*screens?/,
  /\bdoek\b/,
  /fixed\s*frame/,
  /vast\s*frame/,
  /floor\s*rising|vloerscherm/,
  /clr[-\s]?(doek|screen|scherm)/,
  /alr[-\s]?(doek|screen|scherm)/,
  /tensioned/,
  /statiefscherm/,
  /projectiedoek/,
  /\bclr\b/,
  /\balr\b/,
];

const PROJECTOR_STRONG = [
  /\bbeamer\b/,
  /\bprojector\b/,
  /laser\s*tv/,
  /cinebeam/,
  /ansi[-\s]?lumen/,
  /\b\d{3,5}\s*lumen\b/,
  /throw\s*ratio/,
  /ultra\s*short\s*throw/,
  /\d{3,5}\s*iso\s*lumen/,
];

const SCREEN_BRANDS = ["elite screens", "celexon", "projecta", "elunevision", "vividstorm", "nothingprojector"];
const PROJECTOR_BRANDS = [
  "optoma",
  "epson",
  "benq",
  "xgimi",
  "hisense",
  "formovie",
  "awol",
  "jmgo",
  "sony",
  "jvc",
  "panasonic",
  "viewsonic",
  "valerion",
  "dangbei",
  "samsung",
];

function hits(text, patterns) {
  return patterns.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
}

function classifyFromText({ title, brand, categoryTitle, content, data01, data02, data03 }) {
  const text = [title, brand, categoryTitle, content, data01, data02, data03].filter(Boolean).join(" ").toLowerCase();
  const titleL = String(title || "").toLowerCase();
  if (/\blens\b|elpl[a-z]?\d|bx-cta\d|elpll\d|elplx\d|elplu\d/.test(titleL)) {
    return { category: "mount", productKind: "projector_lens", confidence: "confirmed", scores: {} };
  }
  if (/schuiflade|\blade\b|\bslide\b|trolley|projector\s*lift|ust[-\s]?meubel/.test(titleL)) {
    return { category: "mount", productKind: "furniture", confidence: "confirmed", scores: {} };
  }
  if (/\bverhuur\b|\brental\b|huurbeamer|\bte huur\b|\bpakket\b/.test(titleL)) {
    return { category: "accessory", productKind: "bundle", confidence: "confirmed", scores: {} };
  }
  if (/projectieverf|\bverf\b|mighty\s*brighty|\btas\b|\bcase\b/.test(titleL)) {
    return { category: "accessory", productKind: "accessory", confidence: "confirmed", scores: {} };
  }
  if (/\bbeugel\b|\bmount\b|plafondplaat|projectorsteun/.test(titleL) && !/\blumen\b/.test(titleL)) {
    return { category: "mount", productKind: "mount", confidence: "confirmed", scores: {} };
  }
  const brandL = String(brand || "").toLowerCase();

  let accessory = hits(text, ACCESSORY_STRONG) * 4;
  let screen = hits(text, SCREEN_STRONG) * 4;
  let projector = hits(text, PROJECTOR_STRONG) * 4;

  if (SCREEN_BRANDS.some((b) => brandL.includes(b) || text.includes(b))) screen += 6;
  if (PROJECTOR_BRANDS.some((b) => brandL.includes(b))) {
    if (/lumen|beamer|projector|throw/.test(titleL)) projector += 3;
    else projector += 1;
  }
  if (/\bhivilux\b/.test(brandL) || /\bhivilux\b/.test(text)) {
    if (/scherm|doek|clr|alr|screen/.test(text)) screen += 5;
    else if (/beamer|projector|lumen/.test(text)) projector += 3;
  }
  if (/\b\d{2,3}\s*inch\b/.test(text) && (screen >= 4 || /scherm|doek|screen/.test(text))) screen += 3;

  if (/standaard|floor stand|tripod stand|gimbal|draagtas|carry bag|\btas\b|\bstand\b/.test(titleL) && !/\blumen\b/.test(titleL)) {
    accessory += 16;
    projector = Math.max(0, projector - 8);
  }
  const accessoryTitle = /beugel|hdmi|kabel|cable|lamp|filter|bril|tas|bag|draagtas|standaard|gimbal|statief/.test(titleL);
  const projectorEvidence = /ansi|lumen|throw\s*ratio|ultra\s*short/.test(titleL) || hits(titleL, PROJECTOR_STRONG) >= 1;
  if (accessoryTitle && !projectorEvidence && !/projectiescherm/.test(titleL)) {
    accessory += 8;
    projector = Math.max(0, projector - 5);
  }
  if (/projectiescherm|projectiedoek/.test(titleL)) {
    screen += 10;
    projector = Math.max(0, projector - 4);
  }
  if (/\blumen\b/.test(titleL) && /beamer|projector|ultra\s*short|throw/.test(titleL) && !/scherm|doek/.test(titleL)) {
    projector += 8;
    screen = Math.max(0, screen - 6);
  }

  const scored = {
    cable: /hdmi|kabel|cable/.test(text) ? accessory + 1 : 0,
    mount: /beugel|mount|schuiflade|ust[-\s]?meubel/.test(text) ? accessory + 1 : 0,
    accessory,
    screen,
    projector,
  };
  const ranked = Object.entries(scored).sort((a, b) => b[1] - a[1]);
  const [bestCat, bestScore] = ranked[0];
  let category = "unknown";
  if (bestScore >= 3) {
    if (bestCat === "accessory") {
      if (scored.cable >= accessory && scored.cable >= 4) category = "cable";
      else if (scored.mount >= accessory && scored.mount >= 4) category = "mount";
      else category = "accessory";
    } else category = bestCat;
  }
  const confidence = bestScore >= 8 && bestScore - ranked[1][1] >= 2 ? "confirmed" : bestScore >= 3 ? "inferred" : "unknown";
  const productKind = category === "projector" ? "projector" : category === "screen" ? "projection_screen" : category === "cable" ? "cable" : category === "mount" ? "mount" : category === "accessory" ? "accessory" : "other";
  return { category, productKind, confidence, scores: scored };
}

function parseSpecs(sourceText) {
  const text = String(sourceText || "").toLowerCase();
  const confidence = {};
  const values = {};

  const ansi = text.match(/(\d{3,5})\s*(?:ansi|iso)\s*lumen/) || text.match(/(\d{3,5})\s*ansi/);
  const lumenLoose = text.match(/(\d{3,5})\s*(?:cvia|led)?[\s-]*lumen/);
  if (ansi) {
    values.brightnessAnsi = Number(ansi[1]);
    confidence.brightnessAnsi = "confirmed";
  } else if (lumenLoose) {
    values.brightnessAnsi = Number(lumenLoose[1]);
    confidence.brightnessAnsi = "inferred";
  } else confidence.brightnessAnsi = "unknown";

  if (/4k|uhd|2160/.test(text)) {
    values.resolution = "4K UHD";
    confidence.resolution = /4k uhd|2160/.test(text) ? "confirmed" : "inferred";
  } else if (/full\s*hd|1080p|1920\s*[x×]\s*1080/.test(text)) {
    values.resolution = "Full HD";
    confidence.resolution = "confirmed";
  } else if (/wuxga|1920\s*[x×]\s*1200/.test(text)) {
    values.resolution = "WUXGA";
    confidence.resolution = "confirmed";
  } else confidence.resolution = "unknown";

  const throwRange = text.match(/throw(?:\s*ratio)?[^0-9]{0,16}(\d+[.,]\d+)\s*[-–/]\s*(\d+[.,]\d+)/i);
  const throwSingle = text.match(/throw(?:\s*ratio)?[^0-9]{0,16}(\d+[.,]\d+)/i);
  if (throwRange) {
    values.throwRatioMin = Number(throwRange[1].replace(",", "."));
    values.throwRatioMax = Number(throwRange[2].replace(",", "."));
    confidence.throwRatio = "confirmed";
  } else if (throwSingle) {
    values.throwRatioMin = Number(throwSingle[1].replace(",", "."));
    values.throwRatioMax = values.throwRatioMin;
    confidence.throwRatio = "inferred";
  } else confidence.throwRatio = "unknown";

  if (/ultra\s*short\s*throw|\bust\b|laser\s*tv/.test(text)) {
    values.ust = true;
    confidence.ust = /ultra\s*short\s*throw|\bust\b/.test(text) ? "confirmed" : "inferred";
  } else if (values.throwRatioMax != null && values.throwRatioMax <= 0.4) {
    values.ust = true;
    confidence.ust = "inferred";
  } else {
    values.ust = false;
    confidence.ust = confidence.throwRatio === "unknown" ? "unknown" : "inferred";
  }

  if (!values.ust && /short\s*throw|korte\s*projectie/.test(text)) {
    values.shortThrow = true;
    confidence.shortThrow = "inferred";
  }

  if (/3lcd|lcd/.test(text) && !/dlp/.test(text)) values.technology = "3LCD";
  else if (/dlp/.test(text)) values.technology = "DLP";

  if (/laser/.test(text)) values.lightSource = "Laser";
  else if (/\bled\b/.test(text)) values.lightSource = "LED";
  else if (/lamp/.test(text)) values.lightSource = "Lamp";

  values.gaming = /\bgaming\b|input\s*lag|120\s*hz|144\s*hz|240\s*hz|game\s*mode/.test(text);
  confidence.gaming = values.gaming ? "inferred" : "unknown";
  const lag =
    text.match(/input\s*lag[^0-9]{0,24}(\d{1,3})/i) ||
    text.match(/(\d{1,3})\s*ms\s*(?:input\s*)?lag/i);
  if (lag) {
    const n = Number(lag[1] || lag[2]);
    if (Number.isFinite(n) && n > 0 && n <= 80) values.inputLag = n;
  }
  const hz = text.match(/(\d{2,3})\s*hz/);
  if (hz) values.refreshRate = Number(hz[1]);
  values.smart = /android\s*tv|google\s*tv|netflix|smart\s*os|appstore/.test(text);
  confidence.smart = values.smart ? "inferred" : "unknown";
  values.office = /presentatie|kantoor|zakelijk|meeting/.test(text);
  values.homeCinema = /home\s*cinema|thuisbioscoop|hdr|cinema/.test(text);
  values.livingRoom = values.smart || values.homeCinema || /woonkamer/.test(text);
  values.outdoor = /outdoor|buiten beamer|voor buiten|tuin|camping/.test(text);
  values.hdr = /\bhdr\b/.test(text);
  const noise = text.match(/(\d{2})\s*dba?/);
  if (noise) values.noiseLevel = Number(noise[1]);

  const inch = text.match(/(\d{2,3})\s*(?:inch|")/);
  if (inch) {
    values.sizeInches = Number(inch[1]);
    confidence.sizeInches = "inferred";
  } else confidence.sizeInches = "unknown";

  values.alr = /\balr\b/.test(text);
  values.clr = /\bclr\b/.test(text);
  values.ustCompatible = values.clr || (/\bust\b/.test(text) && /scherm|doek|screen/.test(text));
  confidence.ustCompatible = values.clr ? "confirmed" : values.ustCompatible ? "inferred" : "unknown";
  values.electric = /elektrisch|electric/.test(text);
  values.manual = /handmatig|\bmanual\b/.test(text);
  values.fixedFrame = /vast\s*frame|fixed\s*frame/.test(text);
  values.floorRising = /vloer|floor\s*rising|omhoogkomend/.test(text);
  values.mobile = /mobiel|statiefscherm|portable screen/.test(text);
  values.tensioned = /tensioned|gespannen/.test(text);
  const gain = text.match(/gain[^0-9]{0,10}(\d+[.,]\d+)/i);
  if (gain) values.gain = Number(gain[1].replace(",", "."));
  if (/16\s*[:x]\s*9/.test(text)) values.aspectRatio = "16:9";
  else if (/16\s*[:x]\s*10/.test(text)) values.aspectRatio = "16:10";

  if (values.ust && confidence.throwRatio === "unknown") {
    values.throwRatioMin = 0.18;
    values.throwRatioMax = 0.4;
    confidence.throwRatio = "inferred";
  } else if (values.shortThrow && confidence.throwRatio === "unknown") {
    values.throwRatioMin = 0.4;
    values.throwRatioMax = 1.0;
    confidence.throwRatio = "inferred";
  }

  const keys = ["brightnessAnsi", "resolution", "throwRatio", "ust"];
  const confirmed = keys.filter((k) => confidence[k] === "confirmed").length;
  const inferred = keys.filter((k) => confidence[k] === "inferred").length;
  const unknown = keys.filter((k) => !confidence[k] || confidence[k] === "unknown").length;
  let dataQuality = "partial";
  if (confirmed >= 2) dataQuality = "good";
  else if (confirmed + inferred >= 2) dataQuality = "partial";
  else if (unknown === keys.length) dataQuality = "sparse";

  return { values, confidence, dataQuality };
}

function collectSourceText(parts) {
  return [parts.title, parts.brand, parts.categoryTitle, stripHtml(parts.content), parts.data01, parts.data02, parts.data03]
    .filter(Boolean)
    .join(" \n ");
}

module.exports = {
  stripHtml,
  classifyFromText,
  parseSpecs,
  collectSourceText,
};
