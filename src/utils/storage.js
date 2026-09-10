const KEY = "keuzehulp:v1";

export function loadWizardState() {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveWizardState(state) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode / quota */
  }
}

export function clearWizardState() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
