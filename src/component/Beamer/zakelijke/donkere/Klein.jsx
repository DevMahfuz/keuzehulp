import React from "react";
import Products from "../../../products/products";

const ZakelijkeDonkereKlein = () => {
  let products = [
    {
      id: 1,
      title: "Epson EB-FH06",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/424554401/700x700x2/epson-epson-eb-fh06-full-hd-home-cinema-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 3500 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-fh06.html",
    },
    {
      id: 2,
      title: "Epson EB-FH52",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/450410324/700x700x2/epson-epson-eb-fh52-zakelijke-full-hd-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-fh52.html",
    },
    {
      id: 3,
      title: "Optoma HD29X",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446040402/700x700x2/optoma-optoma-hd29x-4000-lumen-full-hd-projector.jpg",
      description: `<p class="prodect-description">
          ✔ DLP Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Hoog Contrast<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-hd29x.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een klein project in een donkere omgeving
      </h1>
      <Products products={products} />
    </div>
  );
};

export default ZakelijkeDonkereKlein;
