/**
 * Configurable stock ranking for recommendations.
 * Inactive/hidden products are excluded before scoring.
 */
export const STOCK_RANKING = {
  inStockScore: 100,
  limitedScore: 88,
  limitedStockMax: 3,
  outOfStockScore: 12,
  outOfStockScoreCap: 52,
  outOfStockRankPenalty: 18,
  /** Prefer an in-stock candidate when ranking scores are this close. */
  nearEqualWindow: 12,
};

export function stockStatus(product) {
  if (!product) return "unknown";
  if (product.sellable === false || product.isVisible === false) return "inactive";
  if (product.available === false || product.stock === 0) return "out_of_stock";
  if (product.stock != null && product.stock > 0 && product.stock <= STOCK_RANKING.limitedStockMax) {
    return "limited";
  }
  if (product.stock == null) return "unknown";
  return "in_stock";
}

export function isSellableProduct(product) {
  if (!product) return false;
  if (product.sellable === false || product.isVisible === false) return false;
  return true;
}
