import React from "react";
import Products from "../../../products/products";

const ZakelijkeLichteGroot = () => {
  let products = [
    {
      id: 1,
      title: "Epson EB-L635SU",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/426776493/700x700x2/epson-epson-eb-l635su-wuxga-installatie-projector.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Short Beamer<br>
	  ✔ WUXGA Resolutie<br>
	  ✔ 6000 ANSI Lumen<br>
	  ✔ Korte Afstand tot Scherm<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-l635su.html",
    },
    {
      id: 2,
      title: "Epson EB-PU2120W",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/427389139/700x700x2/epson-epson-eb-pu2120w-evenementen-projector.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD WUXGA Beamer<br>
	  ✔ Verwisselbare lenzen<br>
	  ✔ 20.000 ANSI Lumen<br>
	  ✔ Stacking en Blending<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-pu2120w.html",
    },
    {
      id: 3,
      title: "Panasonic PT-VMZ71B",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/450435141/700x700x2/panasonic-panasonic-pt-vmz71b-7000-lumen-laser-pro.jpg",
      description: `<p class="prodect-description">
          ✔ Laser Beamer<br>
	  ✔ WUXGA Resolutie<br>
	  ✔ 7000 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/panasonic-pt-vmz71b.html",
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een Groot licht project</h1>

      <Products products={products} />
    </div>
  );
};

export default ZakelijkeLichteGroot;
