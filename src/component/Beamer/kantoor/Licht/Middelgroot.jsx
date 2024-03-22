import React from "react";
import Products from "../../../products/products";

const KantoorLichtMiddelgroot = () => {
  let products = [
    {
      id: 1,
      title: "XGIMI Mogo 2 Pro",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/429904708/700x700x2/xgimi-xgimi-mogo-2-pro-full-hd-mini-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Mini Beamer<br>
	  ✔ Full HD<br>
	  ✔ 500 ANSI Lumen<br>
	  ✔ Apps &amp; Harman Kardon<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-mogo-2-pro.htmll",
    },
    {
      id: 2,
      title: "XGIMI Elfin",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/429911216/700x700x2/xgimi-xgimi-elfin-full-hd-smart-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Mini Beamer<br>
	  ✔ Full HD<br>
	  ✔ 800 ANSI Lumen<br>
	  ✔ Apps &amp; Harman Kardon<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-elfin.html",
    },
    {
      id: 3,
      title: "Viewsonic M10e",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/449514685/700x700x2/viewsonic-viewsonic-m10e-full-hd-smart-laser-proje.jpg",
      description: `<p class="prodect-description">
          ✔ Mini Beamer<br>
	  ✔ Full HD Laser<br>
	  ✔ 2200 ANSI Lumen<br>
	  ✔ Apps &amp; Harman Kardon<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/viewsonic-m10e.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een Short Throw beamer in de slaapkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default KantoorLichtMiddelgroot;
