import React from "react";
import Products from "../../../products/products";

const ProjectieschermVanafDeVloerOmhoogHandmatigTot4Meter = () => {
  let products = [
    {
      id: 1,
      title: "Elite Screens OMS135H2",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/361361555/700x700x2/elite-screens-elite-screens-oms100h2-223x125cm-pro.jpg",
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ 299 x 168 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Makkelijk meenemen<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-f120nwh.html",
    },
    {
      id: 2,
      title: "Elite Screens OMS135H2",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/361361555/700x700x2/elite-screens-elite-screens-oms100h2-223x125cm-pro.jpg",
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ 299 x 168 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Makkelijk meenemen<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-f120nwh.html",
    },
    {
      id: 3,
      title: "Elite Screens OMS135H2",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/361361555/700x700x2/elite-screens-elite-screens-oms100h2-223x125cm-pro.jpg",
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ 299 x 168 cm<br>
	  ✔ Snel opzetten<br>
	  ✔ Makkelijk meenemen<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/elite-screens-f120nwh.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een handmatig vloer scherm van 135 tot 150
        inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default ProjectieschermVanafDeVloerOmhoogHandmatigTot4Meter;
