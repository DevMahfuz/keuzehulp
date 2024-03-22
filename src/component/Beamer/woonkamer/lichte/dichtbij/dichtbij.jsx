import React from "react";
import Products from "../../../../products/products";

const LichteDichtbij = () => {
  let products = [
    {
      id: 1,
      title: "Optoma UHD35STx",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/415488376/700x700x2/optoma-optoma-uhd35stx-4k-short-throw-3d-home-cine.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Gamen<br>
	  ✔ 4K PRO-UHD<br>
	  ✔ 3600 ANSI Lumen<br>
	  ✔ Sport Modus<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-uhd35stx.html",
    },
    {
      id: 2,
      title: "Xgimi Horizon Ultra",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/437190101/700x700x2/xgimi-xgimi-horizon-ultra-dual-light-4k-projector.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Gamen<br>
	  ✔ 4K PRO-UHD<br>
	  ✔ 2800 ANSI Lumen<br>
	  ✔ Harman Kardon + App store<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-horizon-ultra.html",
    },
    {
      id: 3,
      title: "JVC NZ30b",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/425439267/700x700x2/jvc-jvc-lx-nz30-4k-laser-gaming-beamer-zwart.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Gamen<br>
	  ✔ 4K PRO-UHD<br>
	  ✔ 3300 ANSI Lumen<br>
	  ✔ Laser projector<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/jvc-lx-nz30.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een Short Throw beamer in een lichte
        woonkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default LichteDichtbij;
