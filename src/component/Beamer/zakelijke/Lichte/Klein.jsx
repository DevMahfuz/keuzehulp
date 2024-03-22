import React from "react";
import Products from "../../../products/products";

const ZakelijkeLichteKlein = () => {
  let products = [
    {
      id: 1,
      title: "Epson EB-800F",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/426337686/700x700x2/epson-epson-eb-800f-digital-signage-installatie-be.jpg",
      description: `<p class="prodect-description">
          ✔ UST Laser Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 5000 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-800f.html",
    },
    {
      id: 2,
      title: "Optoma ZK430ST",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/438930859/700x700x2/optoma-optoma-zk430st-4k-uhd-laser-short-throw-pro.jpg",
      description: `<p class="prodect-description">
          ✔ Short Laser Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 3700 ANSI Lumen<br>
	  ✔ Extreme details<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-zk430st.html",
    },
    {
      id: 3,
      title: "Epson EB-805F",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/426339369/700x700x2/epson-epson-eb-805f-digital-signage-installatie-be.jpg",
      description: `<p class="prodect-description">
          ✔ UST Laser Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 5000 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-805f.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een klein project in een lichte omgeving
      </h1>

      <Products products={products} />
    </div>
  );
};

export default ZakelijkeLichteKlein;
