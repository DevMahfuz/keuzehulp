import React from "react";
import Products from "../../../products/products";

const KantoorLichtKlein = () => {
  let products = [
    {
      id: 1,
      title: "Epson EB-1780W",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/329200910/700x700x2/epson-epson-eb-1780w-draadloze-wxga-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Kantoor Beamer<br>
	  ✔ WXGA Resolutie<br>
	  ✔ 3200 ANSI Lumen<br>
	  ✔ Laptop Formaat<br>    
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-1780w.html",
    },
    {
      id: 2,
      title: "Epson EB-805f",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/426339369/700x700x2/epson-epson-eb-805f-digital-signage-installatie-be.jpg",
      description: `<p class="prodect-description">
          ✔ Ultra Short Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 5000 ANSI Lumen<br>
	  ✔ Direct voor de muur te plaatsen<br>   
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-805f.html",
    },
    {
      id: 3,
      title: "Optoma UHD35STx",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/415488376/700x700x2/optoma-optoma-uhd35stx-4k-short-throw-3d-home-cine.jpg",
      description: `<p class="prodect-description">
          ✔ Short Throw Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 3600 ANSI Lumen<br>
	  ✔ Snelle beeldverversing<br>  
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-uhd35stx.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een Ultra Short Throw beamer in de
        slaapkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default KantoorLichtKlein;
