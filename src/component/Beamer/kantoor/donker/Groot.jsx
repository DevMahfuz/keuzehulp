import React from "react";
import Products from "../../../products/products";

const KantoorDonkerGroot = () => {
  let products = [
    {
      id: 1,
      title: "Optoma HD29X",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446040402/700x700x2/optoma-optoma-hd29x-4000-lumen-full-hd-projector.jpg",
      description: `<p class="prodect-description">
          ✔ DLP Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Scherpe details<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-hd29x.html",
    },
    {
      id: 2,
      title: "Optoma 4K400STx",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/419525808/700x700x2/optoma-optoma-4k400stx-4k-short-throw-business-pro.jpg",
      description: `<p class="prodect-description">
          ✔ DLP Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Short throw<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-4k400stx.html",
    },
    {
      id: 3,
      title: "Optoma ZH462",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/440790396/700x700x2/optoma-optoma-zh462-full-hd-laser-hoog-lumen-beame.jpg",
      description: `<p class="prodect-description">
          ✔ Laser Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 5000 ANSI Lumen<br>
	  ✔ Onderhoudsvrij<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-zh462.html",
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een groot donker kantoor</h1>

      <Products products={products} />
    </div>
  );
};

export default KantoorDonkerGroot;
