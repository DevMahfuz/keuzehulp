import React from "react";
import Products from "../../../products/products";

const SlaapkamerDichtbij = () => {
  let products = [
    {
      id: 1,
      title: "Stobe Beamer",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/465337388/xgimi-xgimi-mogo-3-pro-draagbare-smart-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Mini Beamer<br>
	  ✔ Full HD<br>
	  ✔ 450 ANSI Lumen<br>
	  ✔ Apps &amp; Harman Kardon<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-mogo-3-pro.html",
    },
    {
      id: 2,
      title: "Epson EF-22B",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/466024393/700x700x2/epson-epson-ef-22b-metallic-zwart-smart-mini-beame.jpg",
      description: `<p class="prodect-description">
          ✔ Mini Beamer<br>
	  ✔ Full HD<br>
	  ✔ 1000 ANSI Lumen<br>
	  ✔ Apps &amp; Harman Kardon<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-ef-22b-metallic-zwart.html",
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

export default SlaapkamerDichtbij;
