import React from 'react';
import Products from '../../../products/products';

const PVanHetPlaHandmatigTot4Meter = () => {
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
      title: 'Elite Screens M135XWH2',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/420893640/700x700x2/elite-screens-elite-screens-m135xwh2-169-300-x-168.jpg',
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ Witte behuizing<br>
	  ✔ Full HD doek<br>
	  ✔ 300 x 169 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-m135xwh2.html',
    },
    {
      id: 3,
      title: 'Elite Screens M135XWH2',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/420893640/700x700x2/elite-screens-elite-screens-m135xwh2-169-300-x-168.jpg',
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ Witte behuizing<br>
	  ✔ Full HD doek<br>
	  ✔ 300 x 169 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-m135xwh2.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een handmatig projectiescherm tot 150 inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVanHetPlaHandmatigTot4Meter;
