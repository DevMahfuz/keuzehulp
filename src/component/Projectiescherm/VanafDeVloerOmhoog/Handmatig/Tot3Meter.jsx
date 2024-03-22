import React from "react";
import Products from "../../../products/products";

const ProjectieschermVanafDeVloerOmhoogHandmatigTot3Meter = () => {
  let products = [
    {
      id: 1,
      title: "Elite Screens F100NWH",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446030135/700x700x2/elite-screens-elite-screens-f80nwh-169-178-x-100-c.jpg",
      description: `<p class="prodect-description">
          ✔ 100 inch Floor Up<br>
	  ✔ 229 x 201 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Zwarte Behuizing<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-f100nwh.html",
    },
    {
      id: 2,
      title: "Elite Screens OMS100H2",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/361361555/700x700x2/elite-screens-elite-screens-oms100h2-223x125cm-pro.jpg",
      description: `<p class="prodect-description">
          ✔ 100 inch Scherm<br>
	  ✔ 223 x 125 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Makkelijk meenemen<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-oms100h2.html",
    },
    {
      id: 3,
      title: "Elite Screens F120NWH",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446030135/700x700x2/elite-screens-elite-screens-f80nwh-169-178-x-100-c.jpg",
      description: `<p class="prodect-description">
          ✔ 120 inch Floor Up<br>
	  ✔ 266 x 149 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Zwarte Behuizing<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-f120nwh.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een handmatig vloer scherm van 100 tot 135
        inch
      </h1>

      <Products products={products} />
    </div>
  );
};

export default ProjectieschermVanafDeVloerOmhoogHandmatigTot3Meter;
