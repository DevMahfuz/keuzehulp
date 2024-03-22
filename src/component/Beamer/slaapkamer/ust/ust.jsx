import React from "react";
import Products from "../../../products/products";

const SlaapkamerUst = () => {
  let products = [
    {
      id: 1,
      title: "XGIMI AURA",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/429899866/700x700x2/xgimi-xgimi-aura-4k-ust-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 2400 ANSI Lumen<br>
	  ✔ Harman Kardon Soundbar<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-aura.html",
    },
    {
      id: 2,
      title: "Samsung LSP7T",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/365781589/700x700x2/samsung-samsung-lsp7t-4k-ust-smart-laser-projector.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Laser TV<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 2200 ANSI Lumen<br>
	  ✔ Smart Apps &amp; TV<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/samsung-lsp7t.html",
    },
    {
      id: 3,
      title: "Epson EH-LS650b",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/439606281/700x700x2/epson-epson-eh-ls650b-4k-laser-ultra-short-throw.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Laser TV<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 3600 ANSI Lumen<br>
	  ✔ Apps &amp; Yamaha Soundbar<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eh-ls650b.html",
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

export default SlaapkamerUst;
