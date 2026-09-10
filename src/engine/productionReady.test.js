import { createProduct, CATEGORIES } from "./productModel";
import {
  catalogStats,
  assertProjectorCountConsistency,
  isLiveProjector,
  isReliableProjector,
} from "./catalogStats";
import { rankProjectors, preferAvailableCandidate } from "./projectorScoring";
import { STOCK_RANKING } from "../config/stockRanking";
import { getEmbedConfig } from "../config/embed";
import { loadCatalog } from "../services/productService";
import { addToCart, lightspeedCartAddUrl } from "../services/cartService";
import { analytics } from "../services/analytics";
import { render, screen } from "@testing-library/react";
import CompareTable from "../components/CompareTable";
import ProductCard from "../components/ProductCard";

function projector(partial) {
  return createProduct({
    category: CATEGORIES.PROJECTOR,
    productKind: "projector",
    available: true,
    stock: 8,
    sellable: true,
    isVisible: true,
    resolution: "4K UHD",
    brightnessAnsi: 3000,
    throwRatioMin: 1.3,
    throwRatioMax: 2.0,
    price: 1400,
    brand: "Optoma",
    model: "A",
    ...partial,
  });
}

test("lens met category projector telt niet als live projector (225/224 regressie)", () => {
  const products = [
    projector({ id: "p1" }),
    createProduct({
      id: "lens",
      category: CATEGORIES.PROJECTOR,
      productKind: "projector_lens",
      brightnessAnsi: 20000,
      resolution: "4K UHD",
      throwRatioMin: 0.3,
      throwRatioMax: 0.4,
      title: "Epson ELPLU03S",
    }),
  ];
  const stats = catalogStats(products);
  expect(isLiveProjector(products[1])).toBe(false);
  expect(stats.liveProjector).toBe(1);
  expect(stats.counts.projector).toBe(1);
  expect(stats.specCoverage.total).toBe(1);
  expect(stats.specCoverage.reliableTech).toBe(1);
  expect(stats.reliableProjector + stats.sparseProjector).toBe(stats.liveProjector);
  expect(assertProjectorCountConsistency(stats)).toBe(true);
  expect(isReliableProjector(products[0])).toBe(true);
});

test("niet-verkoopbaar product komt nooit in ranking", () => {
  const ranked = rankProjectors(
    [
      projector({ id: "hidden", sellable: false, isVisible: false, brightnessAnsi: 5000 }),
      projector({ id: "ok", brightnessAnsi: 2800 }),
    ],
    { usage: "movies", throwDistance: "3_4", budget: "flex", ambientLight: "dark", screenSize: "100_120" }
  );
  expect(ranked.every((r) => r.product.id !== "hidden")).toBe(true);
  expect(ranked[0].product.id).toBe("ok");
});

test("bijna gelijkwaardige voorraad wint van niet-op-voorraad", () => {
  const oos = projector({
    id: "oos",
    stock: 0,
    available: false,
    brightnessAnsi: 3200,
    homeCinema: true,
    rankingHint: true,
  });
  const stocked = projector({
    id: "stock",
    stock: 4,
    available: true,
    brightnessAnsi: 3100,
    homeCinema: true,
  });
  const ranked = rankProjectors([oos, stocked], {
    usage: "movies",
    throwDistance: "3_4",
    budget: "flex",
    ambientLight: "dark",
    screenSize: "100_120",
    priority: "picture",
  });
  expect(ranked[0].product.id).toBe("stock");
  expect(ranked.find((r) => r.product.id === "oos")).toBeTruthy();
  expect(STOCK_RANKING.nearEqualWindow).toBeGreaterThan(0);
});

test("preferAvailableCandidate ruilt OOS-top in voor nabije voorraad", () => {
  const ranked = preferAvailableCandidate([
    { infeasible: false, rankingScore: 80, product: { id: "a" }, breakdown: { availability: { available: false } } },
    { infeasible: false, rankingScore: 74, product: { id: "b" }, breakdown: { availability: { available: true } } },
  ]);
  expect(ranked[0].product.id).toBe("b");
  expect(ranked[1].product.id).toBe("a");
});

test("embed query herkent section en modal", () => {
  const prev = window.location.search;
  window.history.pushState({}, "", "/?embed=section");
  expect(getEmbedConfig().mode).toBe("section");
  window.history.pushState({}, "", "/?embed=modal");
  expect(getEmbedConfig().mode).toBe("modal");
  window.history.pushState({}, "", `/${prev || ""}`);
});

test("loadCatalog toont geen mock bij API-fout", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: "catalog_unavailable" }),
  });
  const result = await loadCatalog();
  expect(result.products).toEqual([]);
  expect(result.usingMock).toBe(false);
  expect(result.error).toBe("catalog_unavailable");
});

test("winkelwagen URL volgt C-Series theme /cart/add/{id}/?quantity=", () => {
  expect(lightspeedCartAddUrl({ variantId: "99", id: "1" }, 2)).toBe(
    "https://www.beamer-winkel.nl/cart/add/99/?quantity=2"
  );
});

test("analytics events zonder measurement id", () => {
  window.dataLayer = [];
  analytics.started({ entry: "start" });
  analytics.categorySelected("projector");
  expect(window.dataLayer[0].event).toBe("keuzehulp_started");
  expect(window.dataLayer[1].event).toBe("category_selected");
});

test("vergelijking toont mobiele kaarten", () => {
  render(
    <CompareTable
      items={[
        {
          product: { id: "1", brand: "Optoma", model: "HZ", price: 999, resolution: "1080p" },
          matchScore: 88,
        },
      ]}
    />
  );
  expect(screen.getByTestId("compare-mobile")).toBeInTheDocument();
  expect(screen.getAllByText("Optoma HZ").length).toBeGreaterThan(0);
});

test("resultaatkaart toont max 3 redenen tot inklappen", () => {
  render(
    <ProductCard
      scored={{
        product: {
          id: "1",
          brand: "JVC",
          model: "NZ500",
          price: 4999,
          available: true,
          stock: 2,
          productUrl: "https://example.com",
        },
        matchScore: 91,
        pros: ["a", "b", "c", "d", "e"],
        warnings: ["Let op throw"],
        matchType: "exact",
        matchBand: { label: "Uitstekende match" },
      }}
      badge="Beste match"
    />
  );
  expect(screen.getByText("Beste match")).toBeInTheDocument();
  expect(screen.getByText("a")).toBeInTheDocument();
  expect(screen.getByText("d").closest("details")).toBeTruthy();
  expect(screen.getByText("Meer details")).toBeInTheDocument();
});
