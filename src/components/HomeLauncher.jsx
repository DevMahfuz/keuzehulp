export function ProjectorArt() {
  return (
    <svg viewBox="0 0 220 160" role="img" aria-hidden="true" focusable="false">
      <rect x="8" y="18" width="204" height="124" rx="18" fill="#d8f0e4" />
      <rect x="28" y="42" width="128" height="78" rx="14" fill="#1f9d63" />
      <circle cx="78" cy="81" r="26" fill="#0b1f33" />
      <circle cx="78" cy="81" r="16" fill="#9ad7bb" />
      <circle cx="78" cy="81" r="7" fill="#fff" />
      <rect x="148" y="58" width="36" height="46" rx="8" fill="#167a4c" />
      <rect x="156" y="68" width="20" height="10" rx="3" fill="#ef8a2c" />
      <rect x="44" y="128" width="28" height="8" rx="4" fill="#0b1f33" />
      <rect x="108" y="128" width="28" height="8" rx="4" fill="#0b1f33" />
    </svg>
  );
}

export default function HomeLauncher({ onStartBeamer, onStartScreen, onStartSet }) {
  return (
    <section className="bw-keuzehulp-launcher" data-testid="bw-keuzehulp-launcher" aria-label="Keuzehulp">
      <div className="bw-keuzehulp-launcher-visual">
        <ProjectorArt />
      </div>
      <div className="bw-keuzehulp-launcher-copy">
        <h2 className="bw-keuzehulp-launcher-title">Welke beamer past bij jou?</h2>
        <p className="bw-keuzehulp-launcher-lead">
          Beantwoord een paar eenvoudige vragen en krijg direct advies uit ons actuele assortiment.
        </p>
        <div className="bw-keuzehulp-launcher-actions">
          <button className="bw-keuzehulp-launcher-btn" type="button" onClick={onStartBeamer}>
            Ik zoek een beamer
          </button>
          <button className="bw-keuzehulp-launcher-btn" type="button" onClick={onStartScreen}>
            Ik zoek een projectiescherm
          </button>
          <button className="bw-keuzehulp-launcher-btn bw-keuzehulp-launcher-btn-accent" type="button" onClick={onStartSet}>
            Ik wil een complete set
          </button>
        </div>
      </div>
      <aside className="bw-keuzehulp-launcher-aside">
        <p>
          Snel gevonden en persoonlijk advies
          <br />
          in 1 minuut en zonder voorkennis
        </p>
      </aside>
    </section>
  );
}
