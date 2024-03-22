import React from "react";
import Products from "../../../../products/products";

const LichteVerderweg = () => {
  let products = [
    {
      id: 1,
      title: "Epson EH-TW7100",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/356765615/epson-epson-eh-tw7100-4k-pro-home-cinema-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Gamen<br>
	  ✔ 4K UHD<br>
	  ✔ 3000 ANSI Lumen<br>
	  ✔ 3LCD Technologie<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/epson-eh-tw7100.html",
    },
    {
      id: 2,
      title: "Optoma UHD38x",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/356781701/optoma-optoma-uhd38x-4k-home-cinema-en-game-beamer.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Gamen<br>
	  ✔ 4K UHD<br>
	  ✔ 4000 ANSI Lumen<br>
	  ✔ Sport en Game Modus<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-uhd38.html",
    },
    {
      id: 3,
      title: "Optoma ZK450",
      imgURL:
        "https://ls.codetech.nl/shops/299003/files/446049066/700x700x2/optoma-optoma-zk450-4k-uhd-laser-projector.jpg",
      description: `<p class="prodect-description">
          ✔ Home Cinema &amp; Gamen<br>
	  ✔ 4K UHD<br>
	  ✔ 4200 ANSI Lumen<br>
	  ✔ Laser Beamer<br>
        </p>`,
      link: "https://www.beamer-winkel.nl/optoma-zk450.html",
    },
  ];

  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een Normal Throw beamer in een lichte
        woonkamer
      </h1>
      <Products products={products} />
    </div>
  );
};

export default LichteVerderweg;
