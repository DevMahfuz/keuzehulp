const fs = require("fs");
const path = require("path");

function parseEnv(text) {
  const out = {};
  for (const line of String(text || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function applyEnvFile(filePath, { onlyKeys } = {}) {
  if (!fs.existsSync(filePath)) return false;
  const parsed = parseEnv(fs.readFileSync(filePath, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (onlyKeys && !onlyKeys.includes(key)) continue;
    if (process.env[key] == null || process.env[key] === "") {
      process.env[key] = value;
    }
  }
  return true;
}

const LIGHTSPEED_KEYS = [
  "LIGHTSPEED_CLUSTER_ID",
  "LIGHTSPEED_API_KEY",
  "LIGHTSPEED_API_SECRET",
  "LIGHTSPEED_LANGUAGE",
];

function loadLightspeedEnv() {
  const root = path.join(__dirname, "..");
  applyEnvFile(path.join(root, ".env"));
  applyEnvFile(path.join(root, ".env.local"), { onlyKeys: LIGHTSPEED_KEYS });
  applyEnvFile(
    path.join(root, "..", "beamer-winkel-management-dashboard", ".env.local"),
    { onlyKeys: LIGHTSPEED_KEYS }
  );
}

loadLightspeedEnv();

module.exports = { loadLightspeedEnv, isConfigured: () => LIGHTSPEED_KEYS.slice(0, 3).every((k) => process.env[k]?.trim()) };
