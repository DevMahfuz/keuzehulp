/**
 * CRA chunks resolve against webpack publicPath.
 * On Lightspeed the page URL is "/", so we set publicPath to the folder that
 * contains this bundle (and the static/ directory from the same build).
 */
(function setKeuzehulpPublicPath() {
  if (typeof window === "undefined") return;
  let base = window.__BW_KEUZEHULP_BASE__;
  if (!base) {
    const scripts = document.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i -= 1) {
      const src = scripts[i].src || "";
      if (!src) continue;
      if (src.indexOf("keuzehulp-app") !== -1 || src.indexOf("keuzehulp-embed") !== -1) {
        base = src.replace(/\/[^/?#]+(?:[?#].*)?$/, "/");
        break;
      }
    }
  }
  if (!base) return;
  try {
    // eslint-disable-next-line camelcase, no-undef
    __webpack_public_path__ = base;
  } catch {
    /* not a webpack runtime (tests) */
  }
})();
