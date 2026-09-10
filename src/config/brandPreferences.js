/**
 * Commerciële merkvoorkeuren voor de keuzehulp.
 * Alleen van toepassing op technisch geschikte producten.
 * Consumenten zien deze scores nooit.
 */
export const brandPreferences = {
  /** Maximale commerciële bijstelling op de eindscore (punten). */
  maxAdjustment: 15,

  /** Normale projectieschermen (geen UST/CLR-eis). */
  screens: {
    "Elite Screens": 10,
  },

  /** Alleen als het scherm UST/CLR-compatible is én de beamer UST is. */
  ustScreens: {
    Hivilux: 15,
    HiViLux: 15,
  },

  projectors: {
    Optoma: 4,
    Epson: 4,
    Hivilux: 3,
    HiViLux: 3,
    BenQ: -6,
  },
};
