import React from "react";
import Products from "../products/products";

const Accessoires3DBril = () => {
  let products = [
    {
      id: 1,
      title: "iVisions 3D Bril 1",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/367750930/700x700x2/ivisions-ivisions-3d-bril-benq-optoma-viewsonic-en.jpg",
      description: `<p class="prodect-description">
          ✔ Actieve 3D Bril<br>
	  ✔ Epson, Sony<br>
	  ✔ Bewaartasje<br>
	  ✔ incl. Laadkabel<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/ivisions-3d-bril-optoma.html",
    },
    {
      id: 2,
      title: "iVisions 3D Bril 2",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/367750930/700x700x2/ivisions-ivisions-3d-bril-benq-optoma-viewsonic-en.jpg",
      description: `<p class="prodect-description">
          ✔ Actieve 3D Bril<br>
	  ✔ BenQ, Optoma, Viewsonic<br>
	  ✔ Bewaartasje<br>
	  ✔ incl. Laadkabel<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/ivisions-3d-bril-optoma.html",
    },
    {
      id: 3,
      title: "Xgimi 3D Bril",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/437076784/700x700x2/xgimi-xgimi-3d-bril-3d-bril-voor-xgimi-beamers.jpg",
      description: `<p class="prodect-description">
          ✔ Actieve 3D Bril<br>
	  ✔ XGIMI Beamers<br>
	  ✔ Lichtgewicht<br>
	  ✔ incl. Laadkabel<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/ivisions-3d-bril-optoma.html",
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een 3D Bril</h1>
      <p>
        Hier kunnen producten worden weergegeven met links naar de
        desbetreffende producten.
      </p>

      <Products products={products} />
    </div>
  );
};

export default Accessoires3DBril;
