export function parseLaunchType(search = typeof window !== "undefined" ? window.location.search : "") {
  const q = new URLSearchParams(search);
  const raw = (q.get("keuzehulp") || q.get("type") || "").toLowerCase();
  if (raw === "beamer" || raw === "projector") return "beamer";
  if (raw === "screen" || raw === "scherm" || raw === "projectiescherm") return "screen";
  if (raw === "set") return "set";
  return null;
}

export function getEmbedConfig() {
  if (typeof window === "undefined") {
    return { mode: "standalone", compactEntry: false, hideChrome: false };
  }
  const q = new URLSearchParams(window.location.search);
  const embed = (q.get("embed") || q.get("mode") || "").toLowerCase();
  const mode = embed === "modal" ? "modal" : embed === "section" || embed === "1" ? "section" : "standalone";
  const compactEntry = mode !== "standalone" || q.get("entry") === "home";
  return {
    mode,
    compactEntry,
    hideChrome: mode === "section" || mode === "modal",
  };
}
