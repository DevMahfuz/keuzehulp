import React from "react";
import Products from "../../../products/products";

const KantoorDonkerMiddelgroot = () => {
  let products = [
    {
      id: 1,
      title: "Epson CO-FH02",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/413086619/700x700x2/epson-epson-co-fh02-mobiele-kantoor-en-home-cinema.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 3000 ANSI Lumen<br>
	  ✔ Veel Tekst Details<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-co-fh02.html",
    },
    {
      id: 2,
      title: "Epson EH-TW7000",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/322497149/700x700x2/epson-epson-eh-tw7000-home-cinema-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Beamer<br>
	  ✔ 4K Resolutie<br>
	  ✔ 3000 ANSI Lumen<br>
	  ✔ Helder tot 500 inch<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eh-tw7000.html",
    },
    {
      id: 3,
      title: "Epson EB-1780W",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/329200910/700x700x2/epson-epson-eb-1780w-draadloze-wxga-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 3200 ANSI Lumen<br>
	  ✔ Laptop formaat<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eb-1780w.html",
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een middelgroot donker kantoor</h1>

      <Products products={products} />
    </div>
  );
};

export default KantoorDonkerMiddelgroot;
