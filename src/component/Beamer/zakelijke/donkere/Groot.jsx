import React from "react";
import Products from "../../../products/products";

const ZakelijkeDonkereGroot = () => {
  let products = [
    {
      id: 1,
      title: "Optoma ZH461",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/408163320/700x700x2/optoma-optoma-zh461-full-hd-laser-hoog-lumen-beame.jpg",
      description: `<p class="prodect-description">
          ✔ Full HD Laser Beamer<br>
	  ✔ Veel Installatie Mogelijkheden<br>
	  ✔ 5000 ANSI Lumen<br>
	  ✔ Creston en RS232<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-zh461.html",
    },
    {
      id: 2,
      title: "Optoma ZK430ST",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/438930859/700x700x2/optoma-optoma-zk430st-4k-uhd-laser-short-throw-pro.jpg",
      description: `<p class="prodect-description">
          ✔ Short Throw Laser Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 3700 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-zk430st.html",
    },
    {
      id: 3,
      title: "Epson EB-L530U",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/426513526/700x700x2/epson-epson-eb-l530u-5200-lumen-wifi-laser-project.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Laser Beamer<br>
	  ✔ 20.000 uur onderhoudsvrij<br>
	  ✔ 5000 ANSI Lumen<br>
	  ✔ Edge Blending en Stacking<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-l530u.html",
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een groot project in het donker</h1>

      <Products products={products} />
    </div>
  );
};

export default ZakelijkeDonkereGroot;
