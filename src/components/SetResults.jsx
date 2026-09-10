import { formatPrice } from "../utils/format";
import ProductCard from "./ProductCard";
import ProductImage from "./ProductImage";

export default function SetResults({ set, debug = false, answers = {} }) {
  if (!set?.projector) {
    return (
      <div className="kh-empty">
        <h2>We kunnen nog geen complete set samenstellen</h2>
        <p>Pas je antwoorden aan of kies eerst alleen een beamer.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Jouw complete thuisbioscoop</h2>
      <p className="kh-muted">Beamer + technisch passend scherm. Accessoires zijn optioneel.</p>
      <ProductCard scored={set.projector} badge="Beamer · beste match" debug={debug} answers={answers} />
      {set.screen ? (
        <ProductCard
          scored={set.screen}
          badge={set.screen.infeasible || set.screen.nearest ? "Beste schermalternatief" : "Passend scherm"}
          badgeTone="orange"
          debug={debug}
          answers={answers}
        />
      ) : null}
      <div className="kh-set-row">
        {set.accessories.map((item) => (
          <div className="kh-card kh-set-item" key={item.product.id}>
            <ProductImage src={item.product.imageUrl} alt={item.product.title} />
            <div>
              <strong>{item.product.title}</strong>
              <p className="kh-muted">{item.reason}</p>
            </div>
            <div className="kh-price">{formatPrice(item.product.price)}</div>
          </div>
        ))}
      </div>
      <div className="kh-card kh-total">
        <span>Totaalprijs (incl. accessoires)</span>
        <span>{formatPrice(set.total)}</span>
      </div>
    </div>
  );
}
