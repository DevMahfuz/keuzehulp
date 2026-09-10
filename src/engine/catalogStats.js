import { PRODUCT_KINDS, classificationCounts, isProjector } from "./classify";
import { coverageSnapshot } from "./specifications";

/**
 * Single source of truth for projector counts.
 *
 * live projector: productKind === projector (after hydrate/classify). Not mock.
 * enriched projector: live projector with CSV specEnriched.
 * reliable projector: live projector with ANSI + resolution + (throw ratio or UST).
 * sparse projector: live projector that is not reliable.
 */
export function isLiveProjector(product) {
  if (!product || product.isMock) return false;
  return isProjector(product);
}

export function isEnrichedProjector(product) {
  return isLiveProjector(product) && Boolean(product.specEnriched);
}

export function hasReliableProjectorTech(product) {
  return (
    product?.brightnessAnsi != null &&
    Boolean(product.resolution) &&
    (product.throwRatioMin != null || product.ust === true)
  );
}

export function isReliableProjector(product) {
  return isLiveProjector(product) && hasReliableProjectorTech(product);
}

export function isSparseProjector(product) {
  return isLiveProjector(product) && !hasReliableProjectorTech(product);
}

export function catalogStats(products = []) {
  const list = Array.isArray(products) ? products : [];
  const counts = classificationCounts(list);
  const liveProjectors = list.filter(isLiveProjector);
  const enriched = liveProjectors.filter((p) => p.specEnriched);
  const reliable = liveProjectors.filter(hasReliableProjectorTech);
  const sparse = liveProjectors.filter((p) => !hasReliableProjectorTech(p));
  const coverage = coverageSnapshot(list);
  return {
    total: list.length,
    counts,
    liveProjector: liveProjectors.length,
    enrichedProjector: enriched.length,
    reliableProjector: reliable.length,
    sparseProjector: sparse.length,
    kinds: counts.kinds,
    specCoverage: coverage,
  };
}

export function assertProjectorCountConsistency(stats) {
  const live = stats.liveProjector;
  if (stats.counts.projector !== live) {
    throw new Error(`counts.projector (${stats.counts.projector}) !== liveProjector (${live})`);
  }
  if (stats.reliableProjector + stats.sparseProjector !== live) {
    throw new Error("reliable + sparse must equal live projectors");
  }
  if (stats.specCoverage.total !== live) {
    throw new Error(`coverage.total (${stats.specCoverage.total}) !== liveProjector (${live})`);
  }
  if (stats.specCoverage.reliableTech !== stats.reliableProjector) {
    throw new Error("coverage.reliableTech must match reliableProjector");
  }
  if (stats.kinds[PRODUCT_KINDS.PROJECTOR] !== live) {
    throw new Error("kinds.projector must match liveProjector");
  }
  return true;
}
