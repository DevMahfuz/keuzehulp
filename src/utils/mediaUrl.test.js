import { absoluteAssetUrl, pickLightspeedImage, PRODUCT_IMAGE_FALLBACK } from "./mediaUrl";

test("absoluteAssetUrl maakt protocol-relative en http URLs https", () => {
  expect(absoluteAssetUrl("//cdn.webshopapp.com/shops/1/files/2.jpg")).toBe(
    "https://cdn.webshopapp.com/shops/1/files/2.jpg"
  );
  expect(absoluteAssetUrl("http://ls.codetech.nl/shops/1/files/2.jpg")).toBe(
    "https://ls.codetech.nl/shops/1/files/2.jpg"
  );
});

test("absoluteAssetUrl zet relatieve paden op de shop-origin", () => {
  expect(absoluteAssetUrl("/files/photo.jpg", "https://www.beamer-winkel.nl")).toBe(
    "https://www.beamer-winkel.nl/files/photo.jpg"
  );
});

test("product-placeholder is inline (geen /static of extra asset)", () => {
  expect(PRODUCT_IMAGE_FALLBACK.startsWith("data:image/svg+xml")).toBe(true);
});

test("pickLightspeedImage leest image.src en images[0]", () => {
  expect(pickLightspeedImage({ image: { src: "//cdn.example/a.jpg" } })).toBe("https://cdn.example/a.jpg");
  expect(pickLightspeedImage({ images: [{ src: "https://cdn.example/b.jpg" }] })).toBe("https://cdn.example/b.jpg");
});
