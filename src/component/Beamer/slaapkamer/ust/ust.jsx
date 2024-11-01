import React from "react";
import Products from "../../../products/products";

const SlaapkamerUst = () => {
  let products = [
    {
      id: 1,
      title: "XGIMI AURA 2",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/465098364/700x700x2/xgimi-xgimi-aura-2-dolby-vision-hdr-en-imax-enhanc.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 2400 ANSI Lumen<br>
	  ✔ Dolby Atmos & Dolby Vision<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/xgimi-aura-2.html",
    },
    {
      id: 2,
      title: "Samsung LPU7D",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/465339105/700x700x2/samsung-samsung-premiere-lpu7d-4k-tizen-os-project.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Laser TV<br>
	  ✔ 4K UHD Laser<br>
	  ✔ 2800 ANSI Lumen<br>
	  ✔ Smart Apps &amp; TV<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/samsung-premiere-lpu7d-2024.html",
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
