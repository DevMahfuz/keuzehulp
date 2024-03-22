import React from "react";
import Products from "../../../products/products";

const SlaapkamerVerderweg = () => {
  let products = [
    {
      id: 1,
      title: "Epson EF-12",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/352749436/700x700x2/epson-epson-epiqvision-ef-12-mini-smart-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Smart Beamer<br>
	  ✔ Full HD Laser<br>
	  ✔ 1000 ANSI Lumen<br>
	  ✔ Yamaha Geluid<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-ef-12.html",
    },
    {
      id: 2,
      title: "XGIMI Halo+",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/436989396/700x700x2/xgimi-xgimi-halo-plus-mobiele-full-hd-beamer-met-a.jpg",
      description: `<p class="prodect-description">
          ✔ Smart Beamer<br>
	  ✔ Full HD Laser<br>
	  ✔ 900 ANSI Lumen<br>
	  ✔ Harman Kardon Geluid<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-halo-plus.html",
    },
    {
      id: 3,
      title: "Viewsonic M2e",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/368408802/700x700x2/viewsonic-viewsonic-m2e-full-hd-wifi-mini-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Smart Beamer<br>
	  ✔ Full HD Laser<br>
	  ✔ 1000 ANSI Lumen<br>
	  ✔ Harman Kardon Geluid<br>       
        </p>`,
      link: "https://www.beamer-winkel.nl/viewsonic-m2e.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een Normal Throw beamer in een slaapkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default SlaapkamerVerderweg;
