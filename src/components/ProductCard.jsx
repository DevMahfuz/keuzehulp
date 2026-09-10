import { formatPercent, formatPrice } from "../utils/format";
import { keySpecs, stockLabel } from "../utils/labels";
import {
  addToCart,
  assessProductAddability,
  getCartPageUrl,
  isProductSellable,
} from "../services/cartService";
import { analytics } from "../services/analytics";
import { useState } from "react";
import ProductImage from "./ProductImage";
import { debugSnapshot } from "../engine/recommend";

export default function ProductCard({ scored, badge, badgeTone = "green", debug = false, answers = {} }) {
  const { product, matchScore, pros, warnings, matchType, matchBand } = scored;
  const stock = stockLabel(product);
  const addability = assessProductAddability(product);
  const canAdd = addability.canAddDirectly && isProductSellable(product);
  const needsChoice = addability.debug?.reason === "multiple_variants_unselected" || addability.debug?.requiresConfiguration;
  const [notice, setNotice] = useState(needsChoice && !canAdd ? addability.reason : "");
  const [noticeOk, setNoticeOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartUrl, setCartUrl] = useState(getCartPageUrl());
  const heading = [product.brand, product.model].filter(Boolean).join(" ") || product.title;
  const alternative = matchType === "nearest" || matchType === "soft" || (matchScore != null && matchScore < 70);
  const concessionWarnings = (warnings || []).filter(Boolean);
  const topReasons = (pros || []).slice(0, 3);
  const extraReasons = (pros || []).slice(3);
  const extraSpecs = keySpecs(product, answers);

  async function onCart() {
    if (busy || !canAdd) return;
    setBusy(true);
    setNotice("");
    setNoticeOk(false);
    analytics.addToCartClicked({
      productId: product.productId || product.id,
      variantId: product.variantId,
      sku: product.sku,
      match_score: matchScore,
    });
    try {
      const result = await addToCart(product);
      if (result.ok) {
        analytics.addToCartSuccess({
          productId: product.productId || product.id,
          variantId: product.variantId,
          sku: product.sku,
        });
        setAdded(true);
        setNoticeOk(true);
        setNotice("Toegevoegd aan winkelwagen");
        if (result.cartUrl) setCartUrl(result.cartUrl);
      } else {
        analytics.addToCartFailed({
          productId: product.productId || product.id,
          variantId: product.variantId,
          sku: product.sku,
          status: result.status,
        });
        setNotice("Toevoegen aan de winkelwagen lukte niet.");
      }
    } catch {
      analytics.addToCartFailed({
        productId: product.productId || product.id,
        variantId: product.variantId,
        sku: product.sku,
      });
      setNotice("Toevoegen aan de winkelwagen lukte niet.");
    } finally {
      setBusy(false);
    }
  }

  function onView() {
    analytics.productClicked({ productId: product.id, match_score: matchScore });
  }

  return (
    <article className="kh-product">
      {badge ? <div className={`kh-badge ${badgeTone === "orange" ? "orange" : ""}`}>{badge}</div> : null}
      {alternative ? <p className="kh-alt-kicker">Beste alternatief voor jouw situatie</p> : null}
      <ProductImage src={product.imageUrl} alt={heading} />
      <div className="kh-product-body">
        <h3>{heading}</h3>
        <div className="kh-price">
          {formatPrice(product.price)}
          {product.oldPrice && product.oldPrice > product.price ? <s>{formatPrice(product.oldPrice)}</s> : null}
        </div>
        <div className={`kh-stock ${stock.out ? "out" : ""}`}>{stock.text}</div>
        <p className="kh-match">
          <strong>{formatPercent(matchScore)} match</strong>
          {matchBand?.label ? <span className="kh-muted"> · {matchBand.label}</span> : null}
        </p>
        <p>
          <strong>Waarom deze bij jou past</strong>
        </p>
        <ul className="kh-pros">
          {topReasons.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {extraReasons.length || extraSpecs.length ? (
          <details className="kh-more">
            <summary>Meer details</summary>
            {extraReasons.length ? (
              <ul className="kh-pros">
                {extraReasons.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
            {extraSpecs.length ? (
              <div className="kh-specs">
                {extraSpecs.map((s) => (
                  <span className="kh-spec" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            ) : null}
          </details>
        ) : null}
        {concessionWarnings.length ? (
          <div className="kh-warn">
            <strong>Let op</strong>
            {concessionWarnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        ) : null}
        <div className="kh-actions">
          {canAdd && !added ? (
            <button className="kh-btn kh-btn-accent" type="button" onClick={onCart} disabled={busy}>
              {busy ? "Bezig…" : "In winkelwagen"}
            </button>
          ) : null}
          {needsChoice && !canAdd && product.productUrl ? (
            <a className="kh-btn kh-btn-accent" href={product.productUrl} target="_blank" rel="noreferrer" onClick={onView}>
              Kies uitvoering
            </a>
          ) : null}
          {added ? (
            <a className="kh-btn kh-btn-accent" href={cartUrl} rel="noreferrer">
              Bekijk winkelwagen
            </a>
          ) : null}
          {product.productUrl ? (
            <a className="kh-btn kh-btn-ghost" href={product.productUrl} target="_blank" rel="noreferrer" onClick={onView}>
              Bekijk product
            </a>
          ) : null}
        </div>
        {notice ? <p className={noticeOk ? "kh-notice-ok" : "kh-warn"}>{notice}</p> : null}
        {debug ? <pre className="kh-debug">{JSON.stringify(debugSnapshot(scored), null, 2)}</pre> : null}
      </div>
    </article>
  );
}
