import React from "react";
import Products from "../../../products/products";

const ProjectieschermVanafDeVloerOmhoogElektrischTot4Meter = () => {
  let products = [
    {
      id: 1,
      title: "iVisions Electro FloorUp 4K",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/452761099/700x700x2/ivisions-ivisions-electro-floorup-4k-series-meerde.jpg",
      description: `<p class="prodect-description">
          ✔ Elektrisch Floor Up<br>
	  ✔ Meerdere Maten<br>
	  ✔ 4K Wit Scherm<br>
	  ✔ Short en Normal beamers<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/ivisions-electro-floorup-4k-meerdere-maten.html",
    },
    {
      id: 2,
      title: "HiViLux Floor Up ALR UST",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/422336824/700x700x2/hivilux-hivilux-floor-up-alr-ust-tab-tension-100-2.jpg",
      description: `<p class="prodect-description">
          ✔ 100 inch Floor Up<br>
	  ✔ 221 x 124 cm<br>
	  ✔ ALR Scherm<br>
	  ✔ Voor UST beamers<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/hivilux-floor-up-alr-ust-100-221x124cm.html",
    },
    {
      id: 3,
      title: "HiViLux Floor Up ALR UST",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/422336824/700x700x2/hivilux-hivilux-floor-up-alr-ust-tab-tension-100-2.jpg",
      description: `<p class="prodect-description">
          ✔ 120 inch Floor Up<br>
	  ✔ 280 x 158 cm<br>
	  ✔ ALR Scherm<br>
	  ✔ Voor UST beamers<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/hivilux-alr-ust-tab-tension-130.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een elektrisch vloer scherm van 135 tot
        150 inch
      </h1>
      <p>
        Hier kunnen producten worden weergegeven met links naar de
        desbetreffende producten.
      </p>
      <Products products={products} />
    </div>
  );
};

export default ProjectieschermVanafDeVloerOmhoogElektrischTot4Meter;
