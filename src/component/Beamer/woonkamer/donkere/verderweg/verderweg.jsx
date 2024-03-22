import React from "react";
import Products from "../../../../products/products";

const DonkereVerderweg = () => {
  let products = [
    {
      id: 1,
      title: "Sony XW5000b",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/421332221/700x700x2/sony-sony-vpl-xw5000b-native-4k-sxrd-home-cinema-p.jpg",
      description: `<p class="prodect-description">
          ✔ High End Home Cinema<br>
	  ✔ Native 4K UHD<br>
	  ✔ 2000 ANSI Lumen<br>
	  ✔ SXRD Technologie<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/sony-vpl-xw5000.html",
    },
    {
      id: 2,
      title: "JVC LX-NZ30b",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/425439267/700x700x2/jvc-jvc-lx-nz30-4k-laser-gaming-beamer-zwart.jpg",
      description: `<p class="prodect-description">
          ✔ High End Home Cinema<br>
	  ✔ Native 4K UHD<br>
	  ✔ 2000 ANSI Lumen<br>
	  ✔ SXRD Technologie<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/jvc-lx-nz30.html",
    },
    {
      id: 3,
      title: "Epson EH-LS12000b",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/397769395/700x700x2/epson-epson-eh-ls12000b-high-end-home-cinema-beame.jpg",
      description: `<p class="prodect-description">
          ✔ High End Home Cinema<br>
	  ✔ Native 4K UHD<br>
	  ✔ 2700 ANSI Lumen<br>
	  ✔ Frame Interpolatie<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eh-ls12000b.html",
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een Normal Throw beamer in een Donkere
        woonkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default DonkereVerderweg;
