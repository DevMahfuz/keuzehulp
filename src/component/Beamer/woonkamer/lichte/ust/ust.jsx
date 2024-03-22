import React from "react";
import Products from "../../../../products/products";

const LichteUst = () => {
  let products = [
    {
      id: 1,
      title: "Epson EH-LS650B",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/439606281/epson-epson-eh-ls650b-4k-laser-ultra-short-throw.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K PRO-UHD<br>
	  ✔ 3600 ANSI Lumen<br>
	  ✔ Yamaha Soundbar<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eh-ls650b.html",
    },
    {
      id: 2,
      title: "Epson EH-LS650W",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/439607765/epson-epson-eh-ls650w-4k-laser-ultra-short-throw.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K PRO-UHD<br>
	  ✔ 3600 ANSI Lumen<br>
	  ✔ Yamaha Soundbar<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eh-ls650w.html",
    },
    {
      id: 3,
      title: "Formovie Theater",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446029553/formovie-formovie-theater-4k-triple-laser-projecto.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K PRO-UHD<br>
	  ✔ 2800 ANSI Lumen<br>
	  ✔ Bowers &amp; Wilkins Soundbar<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/formovie-theater.html",
    },
  ];
  return (
    <div id="a" className="container">
      <h1>
        Dit zijn de beste keuzes voor een Ultra Short Throw beamer in een lichte
        woonkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default LichteUst;
