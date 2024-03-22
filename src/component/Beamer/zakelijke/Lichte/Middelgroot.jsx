import React from "react";
import Products from "../../../products/products";

const ZakelijkeLichteMiddelgroot = () => {
  let products = [
    {
      id: 1,
      title: "Panasonic PT-VMZ61B",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/451116962/700x700x2/panasonic-panasonic-pt-vmz61b-6200-lumen-laser-pro.jpg",
      description: `<p class="prodect-description">
          ✔ Laser Beamer<br>
	  ✔ WUXGA Resolutie<br>
	  ✔ 6200 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/panasonic-pt-vmz61b.html",
    },
    {
      id: 2,
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
    {
      id: 3,
      title: "Epson EB-L520U",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/426455559/700x700x2/epson-epson-eb-l520u-5200-lumen-laser-projector.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Beamer<br>
	  ✔ WUXGA Resolutie<br>
	  ✔ 5000 ANSI Lumen<br>
	  ✔ Tot 500 inch haarscherp<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-l520u.html",
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een middelgroot licht project</h1>

      <Products products={products} />
    </div>
  );
};

export default ZakelijkeLichteMiddelgroot;
