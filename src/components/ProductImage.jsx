import { useState } from "react";
import { PRODUCT_IMAGE_FALLBACK } from "../utils/mediaUrl";

export default function ProductImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? PRODUCT_IMAGE_FALLBACK : src;
  return (
    <img
      className={className}
      src={url}
      alt={alt || "Product"}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
