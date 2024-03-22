import React from 'react';
import Products from '../../../products/products';

const PVanHetPlaHandmatigTot3Meter = () => {
  let products = [
    {
      id: 1,
      title: 'iVisions Manual M',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/363956984/700x700x2/ivisions-ivisions-manual-m-series-meerdere-maten.jpg',
      description: `<p class="prodect-description">
          ✔ Handmatig Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Full HD doek<br>
	  ✔ Prijs/Kwaliteit<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-m-series.html',
    },
    {
      id: 2,
      title: 'Elite Screens M120XWH2',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/420893438/700x700x2/elite-screens-elite-screens-m120xwh2-169-265-x-149.jpg',
      description: `<p class="prodect-description">
          ✔ 120 inch Scherm<br>
	  ✔ Witte behuizing<br>
	  ✔ Full HD doek<br>
	  ✔ 265 x 149 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-m120xwh2.html',
    },
    {
      id: 3,
      title: 'Elite Screens M100XWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/394701940/700x700x2/elite-screens-elite-screens-m100xwh-169-221-x-124c.jpg',
      description: `<p class="prodect-description">
          ✔ 100 inch Scherm<br>
	  ✔ Witte behuizing<br>
	  ✔ Full HD doek<br>
	  ✔ 221 x 124 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-m100xwh.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een handmatig projectiescherm van 100 tot
        135 inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVanHetPlaHandmatigTot3Meter;
