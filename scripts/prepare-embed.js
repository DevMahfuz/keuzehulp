const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const jsDir = path.join(buildDir, "static", "js");
const cssDir = path.join(buildDir, "static", "css");
const embedDir = path.join(buildDir, "embed");

function findAsset(dir, pattern) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Missing build folder: ${dir}`);
  }
  const match = fs.readdirSync(dir).find((name) => pattern.test(name));
  if (!match) {
    throw new Error(`No file matching ${pattern} in ${dir}`);
  }
  return match;
}

function extraJsChunks(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => /^[0-9]+\.[a-f0-9]+\.chunk\.js$/.test(name));
}

function copyWithoutSourceMap(from, to) {
  const raw = fs.readFileSync(from, "utf8").replace(/\n?\/\/# sourceMappingURL=[^\n]+$/g, "").replace(/\n?\/\*# sourceMappingURL=[^*]+\*\//g, "");
  fs.writeFileSync(to, raw);
}

const chunks = extraJsChunks(jsDir);
if (chunks.length) {
  throw new Error(
    `Embed build must be a single JS file. Extra webpack chunks: ${chunks.join(", ")}. Remove dynamic import() calls.`
  );
}

const mainJs = findAsset(jsDir, /^main\.[a-f0-9]+\.js$/);
const mainCss = findAsset(cssDir, /^main\.[a-f0-9]+\.css$/);

fs.mkdirSync(embedDir, { recursive: true });
copyWithoutSourceMap(path.join(jsDir, mainJs), path.join(embedDir, "keuzehulp-embed.js"));
copyWithoutSourceMap(path.join(cssDir, mainCss), path.join(embedDir, "keuzehulp-app.css"));

console.log("Stable embed assets:");
console.log("  /embed/keuzehulp-embed.js  (from static/js/" + mainJs + ")");
console.log("  /embed/keuzehulp-app.css   (from static/css/" + mainCss + ")");
