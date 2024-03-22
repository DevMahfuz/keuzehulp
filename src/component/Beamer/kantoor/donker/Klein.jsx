import React from "react";
import Products from "../../../products/products";

const KantoorDonkerKlein = () => {
  let products = [
    {
      id: 1,
      title: "Viewsonic X11-4K",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/414481266/700x700x2/viewsonic-viewsonic-x11-4k-hdr-smart-led-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ LED Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 2400 ANSI Lumen<br>
	  ✔ Harman Kardon Geluid<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/viewsonic-x11.html",
    },
    {
      id: 2,
      title: "Epson CO-FH01",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/441166146/700x700x2/epson-epson-co-fh01-full-hd-bioscoop-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ 3LCD Beamer<br>
	  ✔ Full HD Resolutie<br>
	  ✔ 3000 ANSI Lumen<br>
	  ✔ Goede Prijs/Kwaliteit<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-co-fh01.html",
    },
    {
      id: 3,
      title: "XGIMI Horizon Ultra",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/437190101/700x700x2/xgimi-xgimi-horizon-ultra-dual-light-4k-projector.jpg",
      description: `<p class="prodect-description">
          ✔ Laser Beamer<br>
	  ✔ 4K UHD Resolutie<br>
	  ✔ 2800 ANSI Lumen<br>
	  ✔ Harman Kardon Geluid<br> 
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-horizon-ultra.html",
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een klein donker kantoor</h1>

      <Products products={products} />
    </div>
  );
};

export default KantoorDonkerKlein;
