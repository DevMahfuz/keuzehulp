import React from "react";
import Products from "../../../../products/products";

const DonkereDichtbij = () => {
  let products = [
    {
      id: 1,
      title: "XGIMI Horizon Ultra",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/437190101/700x700x2/xgimi-xgimi-horizon-ultra-dual-light-4k-projector.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 2800 ANSI Lumen<br>
	  ✔ Appstore &amp; Harman Kardon Sound<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-horizon-ultra.html",
    },
    {
      id: 2,
      title: "Viewsonic X11-4K",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/414481266/700x700x2/viewsonic-viewsonic-x11-4k-hdr-smart-led-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 2400 LED Lumen<br>
	  ✔ Apps &amp; Harman Kardon Sound<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/viewsonic-x11.html",
    },
    {
      id: 3,
      title: "Formovie X5",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/451770204/700x700x2/formovie-formovie-x5-laser-smart-4k-uhd-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 2450 CVIA Lumen<br>
	  ✔ Apps &amp; Denon Sound<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/formovie-x5.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een Short Throw beamer in een Donkere
        Woonkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default DonkereDichtbij;
