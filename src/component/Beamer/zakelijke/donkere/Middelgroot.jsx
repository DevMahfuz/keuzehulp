import React from "react";
import Products from "../../../products/products";

const ZakelijkeDonkereMiddelgroot = () => {
  let products = [
    {
      id: 1,
      title: "Optoma 4K400x",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/419525677/700x700x2/optoma-optoma-4k400x-4k-uhd-business-projector.jpg",
      description: `<p class="prodect-description">
          ✔ DLP Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Netwerk Integratie<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-4k400x.html",
    },
    {
      id: 2,
      title: "Optoma 4K400STx",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/419525808/700x700x2/optoma-optoma-4k400stx-4k-short-throw-business-pro.jpg",
      description: `<p class="prodect-description">
          ✔ Short Throw 4K Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Netwerk Integratie<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-4k400stx.html",
    },
    {
      id: 3,
      title: "Optoma zw350e",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/424867101/700x700x2/optoma-optoma-zw350e-ultra-compacte-laserprojector.jpg",
      description: `<p class="prodect-description">
          ✔ Full HD Laser Beamer<br>
	  ✔ Veel Installatie Mogelijkheden<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Netwerk Integratie<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-zw350e.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een middelgroot project in het donker
      </h1>
      <Products products={products} />
    </div>
  );
};

export default ZakelijkeDonkereMiddelgroot;
