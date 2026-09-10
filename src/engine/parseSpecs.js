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

function num(v) {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function mark(confidence, value) {
  if (value == null || value === false || value === "") return { value: value ?? null, confidence: "unknown" };
  return { value, confidence };
}

export function collectSourceText(raw = {}) {
  return [
    raw.fulltitle,
    raw.title,
    raw.model,
    raw.brand?.title || raw.brand,
    raw.description,
    stripHtml(raw.content),
    raw.data01,
    raw.data02,
    raw.data03,
    raw.categoryTitle,
  ]
    .filter(Boolean)
    .join(" \n ");
}

export function parseProductSpecs(sourceText, extras = {}) {
  const text = String(sourceText || "").toLowerCase();
  const conf = {};
  const values = {};

  const ansi = text.match(/(\d{3,5})\s*(?:ansi|iso)\s*lumen/) || text.match(/(\d{3,5})\s*ansi/);
  const lumenLoose = text.match(/(\d{3,5})\s*(?:cvia|led)?[\s-]*lumen/);
  if (ansi) {
    values.brightnessAnsi = Number(ansi[1]);
    conf.brightnessAnsi = "confirmed";
  } else if (lumenLoose) {
    values.brightnessAnsi = Number(lumenLoose[1]);
    conf.brightnessAnsi = "inferred";
  } else conf.brightnessAnsi = "unknown";

  if (/4k|uhd|2160/.test(text)) {
    values.resolution = "4K UHD";
    conf.resolution = /4k uhd|2160/.test(text) ? "confirmed" : "inferred";
  } else if (/full\s*hd|1080p|1920\s*[x×]\s*1080/.test(text)) {
    values.resolution = "Full HD";
    conf.resolution = "confirmed";
  } else if (/wuxga|1920\s*[x×]\s*1200/.test(text)) {
    values.resolution = "WUXGA";
    conf.resolution = "confirmed";
  } else conf.resolution = "unknown";

  const throwRange = text.match(/throw(?:\s*ratio)?[^0-9]{0,16}(\d+[.,]\d+)\s*[-–/]\s*(\d+[.,]\d+)/i);
  const throwSingle = text.match(/throw(?:\s*ratio)?[^0-9]{0,16}(\d+[.,]\d+)/i);
  if (throwRange) {
    values.throwRatioMin = Number(throwRange[1].replace(",", "."));
    values.throwRatioMax = Number(throwRange[2].replace(",", "."));
    conf.throwRatio = "confirmed";
  } else if (throwSingle) {
    values.throwRatioMin = Number(throwSingle[1].replace(",", "."));
    values.throwRatioMax = values.throwRatioMin;
    conf.throwRatio = "inferred";
  } else conf.throwRatio = "unknown";

  if (/ultra\s*short\s*throw|\bust\b|laser\s*tv/.test(text)) {
    values.ust = true;
    conf.ust = /ultra\s*short\s*throw|\bust\b/.test(text) ? "confirmed" : "inferred";
  } else if (values.throwRatioMax != null && values.throwRatioMax <= 0.5) {
    values.ust = true;
    conf.ust = "inferred";
  } else {
    values.ust = false;
    conf.ust = conf.throwRatio === "unknown" ? "unknown" : "inferred";
  }

  if (!values.ust && /short\s*throw|korte\s*projectie/.test(text)) {
    values.shortThrow = true;
    conf.shortThrow = "inferred";
  }

  if (/3lcd|lcd/.test(text) && !/dlp/.test(text)) values.technology = "3LCD";
  else if (/dlp/.test(text)) values.technology = "DLP";
  conf.technology = values.technology ? "inferred" : "unknown";

  if (/laser/.test(text)) values.lightSource = "Laser";
  else if (/\bled\b/.test(text)) values.lightSource = "LED";
  else if (/lamp/.test(text)) values.lightSource = "Lamp";
  conf.lightSource = values.lightSource ? (/laser|led lamp|uho/.test(text) ? "inferred" : "inferred") : "unknown";

  values.gaming = /\bgaming\b|input\s*lag|120\s*hz|144\s*hz|240\s*hz|game\s*mode/.test(text);
  conf.gaming = values.gaming ? "inferred" : "unknown";
  const lag =
    text.match(/input\s*lag[^0-9]{0,24}(\d{1,3})/i) ||
    text.match(/(\d{1,3})\s*ms\s*(?:input\s*)?lag/i);
  if (lag) {
    const n = Number(lag[1] || lag[2]);
    if (Number.isFinite(n) && n > 0 && n <= 80) {
      values.inputLag = n;
      conf.inputLag = "inferred";
    } else conf.inputLag = "unknown";
  } else conf.inputLag = "unknown";
  const hz = text.match(/(\d{2,3})\s*hz/);
  if (hz) values.refreshRate = Number(hz[1]);

  values.smart = /android\s*tv|google\s*tv|netflix|smart\s*os|appstore/.test(text);
  conf.smart = values.smart ? "inferred" : "unknown";
  values.office = /presentatie|kantoor|zakelijk|meeting/.test(text);
  values.homeCinema = /home\s*cinema|thuisbioscoop|hdr|cinema/.test(text);
  values.livingRoom = values.smart || values.homeCinema || /woonkamer/.test(text);
  values.outdoor = /outdoor|buiten beamer|voor buiten|tuin|camping/.test(text);
  values.hdr = /\bhdr\b/.test(text);

  const noise = text.match(/(\d{2})\s*dba?/);
  if (noise) {
    values.noiseLevel = Number(noise[1]);
    conf.noiseLevel = "inferred";
  } else conf.noiseLevel = "unknown";

  const inch = text.match(/(\d{2,3})\s*(?:inch|")/);
  if (inch) {
    values.sizeInches = Number(inch[1]);
    conf.sizeInches = "inferred";
  } else conf.sizeInches = "unknown";

  values.alr = /\balr\b/.test(text);
  values.clr = /\bclr\b/.test(text);
  values.ustCompatible = values.clr || (/\bust\b/.test(text) && /scherm|doek|screen/.test(text));
  conf.ustCompatible = values.clr ? "confirmed" : values.ustCompatible ? "inferred" : "unknown";
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

  if (values.ust && conf.throwRatio === "unknown") {
    values.throwRatioMin = 0.18;
    values.throwRatioMax = 0.4;
    conf.throwRatio = "inferred";
  } else if (values.shortThrow && conf.throwRatio === "unknown") {
    values.throwRatioMin = 0.4;
    values.throwRatioMax = 1.0;
    conf.throwRatio = "inferred";
  }

  Object.assign(values, extras);
  return { values, confidence: conf, sourceLength: text.length };
}

export function dataQualityFromConfidence(confidence = {}) {
  const keys = ["brightnessAnsi", "resolution", "throwRatio", "ust"];
  const confirmed = keys.filter((k) => confidence[k] === "confirmed").length;
  const inferred = keys.filter((k) => confidence[k] === "inferred").length;
  const unknown = keys.filter((k) => !confidence[k] || confidence[k] === "unknown").length;
  if (confirmed >= 2) return "good";
  if (confirmed + inferred >= 2) return "partial";
  if (unknown === keys.length) return "sparse";
  return "partial";
}

export { stripHtml, mark, num };
