import { useEffect, useMemo, useRef } from "react";
import { CATEGORY_OPTIONS } from "../data/questions";
import { summaryChips } from "../utils/labels";
import ProductCard from "../components/ProductCard";
import CompareTable from "../components/CompareTable";
import SetResults from "../components/SetResults";
import { recommend, recommendSet, debugSnapshot, isAdvisorDebugEnabled } from "../engine";
import { analytics } from "../services/analytics";

export function Intro({ onStart, onStartProjector, onStartScreens, onStartSet, compact = false }) {
  return (
    <section className={`kh-hero ${compact ? "kh-hero-compact" : ""}`}>
      <p className="kh-kicker">Beamer-Winkel.nl</p>
      <h1>Welke beamer past bij jou?</h1>
      <p className="kh-lead">
        Beantwoord een paar eenvoudige vragen en krijg direct advies uit ons actuele assortiment.
      </p>
      <div className="kh-hero-actions">
        <button className="kh-btn kh-btn-primary" type="button" onClick={onStart}>
          Start de keuzehulp
        </button>
        {onStartProjector ? (
          <button className="kh-btn kh-btn-ghost" type="button" onClick={onStartProjector}>
            Ik zoek een beamer
          </button>
        ) : null}
        {onStartScreens ? (
          <button className="kh-btn kh-btn-ghost" type="button" onClick={onStartScreens}>
            Ik zoek een projectiescherm
          </button>
        ) : null}
        {onStartSet ? (
          <button className="kh-btn kh-btn-ghost" type="button" onClick={onStartSet}>
            Ik wil een complete set
          </button>
        ) : null}
      </div>
      <div className="kh-trust">
        <span>Binnen 1 minuut advies</span>
        <span>Geen technische kennis nodig</span>
        <span>Producten uit ons actuele assortiment</span>
      </div>
    </section>
  );
}

export function CatalogStatus({ catalog }) {
  if (catalog?.loading) {
    return (
      <div className="kh-loading" role="status">
        <div className="kh-skeleton" />
        <p>Even het actuele assortiment bekijken…</p>
      </div>
    );
  }
  if (catalog?.error) {
    return (
      <div className="kh-banner error" role="alert">
        Het assortiment is nu even niet bereikbaar. Probeer het zo opnieuw — we tonen geen voorbeeldproducten.
      </div>
    );
  }
  return null;
}

export function CategorySelect({ onSelect, onBack }) {
  return (
    <section>
      <button className="kh-icon-btn" type="button" onClick={onBack}>
        ← Terug
      </button>
      <h1>Waar kunnen we je mee helpen?</h1>
      <p className="kh-muted">Kies wat je zoekt. We stellen daarna alleen relevante vragen.</p>
      <div className="kh-grid kh-grid-3" style={{ marginTop: 20 }}>
        {CATEGORY_OPTIONS.map((c) => (
          <button key={c.value} className="kh-option" type="button" onClick={() => onSelect(c.value)}>
            <span className="emoji" aria-hidden>
              {c.emoji}
            </span>
            <strong>{c.title}</strong>
            <div className="hint">{c.text}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Questionnaire({ question, index, total, onAnswer, onBack, selected }) {
  const pct = Math.round(((index + 1) / total) * 100);
  return (
    <section>
      <div className="kh-progress-wrap">
        <div className="kh-progress-meta">
          <span>
            Vraag {index + 1} van {total}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="kh-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
      <h1>{question.title}</h1>
      {question.why ? (
        <p className="kh-why">
          <strong>Waarom we dit vragen. </strong>
          {question.why}
        </p>
      ) : null}
      <div className="kh-grid">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            className={`kh-option ${selected === opt.value ? "is-selected" : ""}`}
            type="button"
            onClick={() => onAnswer(question.id, opt.value)}
          >
            <strong>{opt.label}</strong>
            {opt.hint ? <div className="hint">{opt.hint}</div> : null}
          </button>
        ))}
      </div>
      <div className="kh-nav">
        <button className="kh-btn kh-btn-ghost" type="button" onClick={onBack}>
          Terug
        </button>
      </div>
    </section>
  );
}

export function Results({ category, answers, catalog, onEdit, onRestart }) {
  const { products, loading, usingMock, error } = catalog;
  const debug = isAdvisorDebugEnabled();
  const tracked = useRef("");
  const { highlights, set } = useMemo(() => {
    if (loading || !products.length) {
      return { highlights: { items: [], labels: [], fallbackLevel: 0, matchLevel: "none" }, set: null };
    }
    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
    let result;
    if (category === "screen") {
      result = { highlights: recommend(products, answers, "screen"), set: null };
    } else if (category === "set") {
      result = { highlights: { items: [], labels: [], fallbackLevel: 0, matchLevel: "none" }, set: recommendSet(products, answers) };
    } else {
      result = { highlights: recommend(products, answers, "projector"), set: null };
    }
    result.hydrateMs = (typeof performance !== "undefined" ? performance.now() : Date.now()) - t0;
    return result;
  }, [products, answers, category, loading]);

  useEffect(() => {
    if (loading || !products.length) return;
    const top = highlights.items[0] || set?.projector;
    const key = `${category}:${top?.product?.id || "none"}:${highlights.fallbackLevel || set?.fallbackLevel}`;
    if (tracked.current === key) return;
    tracked.current = key;
    const fallback = (highlights.fallbackLevel || set?.fallbackLevel || 0) > 1;
    analytics.recommendationViewed({
      category,
      scenario: answers.usage || answers.placement || category,
      top_product_id: top?.product?.id,
      match_score: top?.matchScore,
      fallback: fallback ? "yes" : "no",
    });
    analytics.completed({
      category,
      scenario: answers.usage || answers.placement || category,
      top_product_id: top?.product?.id,
      match_score: top?.matchScore,
      fallback: fallback ? "yes" : "no",
    });
    if (fallback) {
      analytics.fallbackShown({
        category,
        fallback_level: highlights.fallbackLevel || set?.fallbackLevel,
      });
    }
  }, [loading, products.length, category, answers, highlights, set]);

  if (loading) {
    return <CatalogStatus catalog={catalog} />;
  }

  if (!products.length) {
    return (
      <div className="kh-empty kh-card">
        <h2>{error ? "Assortiment tijdelijk niet bereikbaar" : "Het assortiment is even niet geladen"}</h2>
        <p>
          {error
            ? "We konden het actuele assortiment nu niet ophalen. Probeer het later opnieuw. Je antwoorden blijven bewaard."
            : "Er is nu geen actueel assortiment geladen. Probeer het later opnieuw. Je antwoorden blijven bewaard."}
        </p>
        <button className="kh-btn kh-btn-ghost" type="button" onClick={onEdit}>
          Antwoorden aanpassen
        </button>
      </div>
    );
  }

  if (debug && typeof console !== "undefined") {
    console.info("[keuzehulp debug]", {
      category,
      fallbackLevel: highlights.fallbackLevel || set?.fallbackLevel,
      top: (highlights.ranked || []).slice(0, 5).map(debugSnapshot),
    });
  }

  return (
    <section>
      {usingMock ? (
        <div className="kh-banner" role="status">
          Je ziet nu ontwikkeldata. Live webshopvoorraad is niet geladen.
        </div>
      ) : null}
      {error ? (
        <div className="kh-banner error" role="status">
          Het actuele assortiment is even niet bereikbaar. Probeer het zo opnieuw — we tonen geen voorbeeldproducten
          als echte voorraad.
        </div>
      ) : null}

      <div className="kh-results-head">
        <p className="kh-kicker">Persoonlijk advies</p>
        <h1>
          {highlights.fallbackLevel > 1 || set?.fallbackLevel > 1
            ? "Dit komt het dichtst bij jouw wensen"
            : "Dit zijn jouw beste matches"}
        </h1>
        <p className="kh-lead" style={{ marginLeft: 0 }}>
          {highlights.fallbackLevel > 1
            ? "Er is geen model dat exact aan al jouw keuzes voldoet. Hieronder het beste beschikbare advies uit het actuele assortiment."
            : "Op basis van jouw ruimte en wensen hebben we deze modellen geselecteerd."}
        </p>
        <h2>Jouw keuzes</h2>
        <div className="kh-choices">
          {summaryChips(answers).map((c) => (
            <span className="kh-chip" key={c}>
              {c}
            </span>
          ))}
        </div>
        <div className="kh-actions">
          <button className="kh-btn kh-btn-ghost" type="button" onClick={onEdit}>
            Antwoorden aanpassen
          </button>
          <button className="kh-btn kh-btn-ghost" type="button" onClick={onRestart}>
            Opnieuw beginnen
          </button>
        </div>
      </div>

      {category === "set" ? (
        <SetResults set={set} debug={debug} answers={answers} />
      ) : highlights.items.length ? (
        highlights.items.map((item, i) => (
          <ProductCard
            key={item.product.id}
            scored={item}
            badge={highlights.labels[i] || (i === 0 ? "Beste match" : "Alternatief")}
            badgeTone={item.matchScore < 80 || i === 2 ? "orange" : "green"}
            debug={debug}
            answers={answers}
          />
        ))
      ) : (
        <div className="kh-empty kh-card">
          <h2>Dit komt het dichtst bij jouw wensen</h2>
          <p>
            We vonden geen exacte match in deze categorie. Pas je antwoorden aan, of kies een andere categorie — we
            zoeken dan opnieuw het beste beschikbare advies.
          </p>
        </div>
      )}

      {category !== "set" ? <CompareTable items={highlights.items} /> : null}
      {debug && highlights.ranked?.length ? (
        <pre className="kh-debug">
          {JSON.stringify(highlights.ranked.slice(0, 5).map(debugSnapshot), null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
