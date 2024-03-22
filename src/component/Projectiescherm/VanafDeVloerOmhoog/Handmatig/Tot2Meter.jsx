import React from "react";
import Products from "../../../products/products";

const ProjectieschermVanafDeVloerOmhoogHandmatigTot2Meter = () => {
  let products = [
    {
      id: 1,
      title: "Elite Screens F80NWH",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446030135/700x700x2/elite-screens-elite-screens-f80nwh-169-178-x-100-c.jpg",
      description: `<p class="prodect-description">
          ✔ 80 inch Floor Up<br>
	  ✔ 179 x 100 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Zwarte Behuizing<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-f80nwh.html",
    },
    {
      id: 2,
      title: "Elite Screens F84NWH",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446030135/700x700x2/elite-screens-elite-screens-f80nwh-169-178-x-100-c.jpg",
      description: `<p class="prodect-description">
          ✔ 84 inch Floor Up<br>
	  ✔ 186 x 105 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Zwarte Behuizing<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-f84nwh.html",
    },
    {
      id: 3,
      title: "Elite Screens T92UWH",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/322489704/700x700x2/elite-screens-elite-screens-t92uwh-169-210x127cm-m.jpg",
      description: `<p class="prodect-description">
          ✔ 92 inch Floor Up<br>
	  ✔ 210 x 127 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ HD+ Projectiedoek<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-t92uwh-169-210x127.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een handmatig vloer scherm van 80 tot 100
        inch
      </h1>
      <p>
        Hier kunnen producten worden weergegeven met links naar de
        desbetreffende producten.
      </p>

      <Products products={products} />
    </div>
  );
};

export default ProjectieschermVanafDeVloerOmhoogHandmatigTot2Meter;
