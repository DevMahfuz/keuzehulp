import { formatPrice } from "../utils/format";

const UNKNOWN = "Niet opgegeven";

function flagLabel(value, confidence) {
  if (confidence === "unknown" || value == null) return UNKNOWN;
  return value ? "Ja" : "Nee";
}

function specOrUnknown(value, suffix = "") {
  if (value == null || value === "") return UNKNOWN;
  return `${value}${suffix}`;
}

function compareRows(items) {
  return [
    { label: "Prijs", fn: (s) => formatPrice(s.product.price) },
    { label: "Matchscore", fn: (s) => `${Math.round(s.matchScore)}%` },
    { label: "Resolutie", fn: (s) => specOrUnknown(s.product.resolution) },
    {
      label: "Helderheid",
      fn: (s) =>
        s.product.category === "screen"
          ? specOrUnknown(s.product.sizeInches, " inch")
          : specOrUnknown(s.product.brightnessAnsi, " lumen"),
    },
    {
      label: "Lichtbron / type",
      fn: (s) => specOrUnknown(s.product.lightSource || s.product.screenType),
    },
    {
      label: "Projectieafstand / formaat",
      fn: (s) => {
        if (s.product.throwRatioMin != null) {
          const same = s.product.throwRatioMin === s.product.throwRatioMax;
          return same
            ? `Projectie ${String(s.product.throwRatioMin).replace(".", ",")}:1`
            : `Projectie ${s.product.throwRatioMin}–${s.product.throwRatioMax}:1`;
        }
        if (s.product.sizeInches) return `${s.product.sizeInches} inch`;
        return UNKNOWN;
      },
    },
    {
      label: "Gaming",
      fn: (s) => flagLabel(s.product.gaming, s.product.fieldConfidence?.gaming),
    },
    {
      label: "Smart",
      fn: (s) => flagLabel(s.product.smart, s.product.fieldConfidence?.smart),
    },
    {
      label: "Geluid",
      fn: (s) => specOrUnknown(s.product.noiseLevel, " dB"),
    },
  ].map((row) => ({
    ...row,
    values: items.map((s) => row.fn(s)),
  }));
}

export default function CompareTable({ items }) {
  if (!items?.length) return null;
  const rows = compareRows(items);

  return (
    <section className="kh-compare" aria-label="Vergelijk jouw beste matches">
      <h2>Vergelijk jouw beste matches</h2>
      <div className="kh-compare-desktop">
        <table>
          <thead>
            <tr>
              <th>Eigenschap</th>
              {items.map((s) => (
                <th key={s.product.id}>
                  {s.product.brand} {s.product.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {items.map((s, i) => (
                  <td key={s.product.id}>{row.values[i]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="kh-compare-mobile" data-testid="compare-mobile">
        {items.map((s, index) => (
          <article className="kh-compare-card" key={s.product.id}>
            <h3>
              {s.product.brand} {s.product.model}
            </h3>
            {rows.map((row) => (
              <p key={row.label}>
                <span>{row.label}</span>
                <strong>{row.values[index]}</strong>
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
