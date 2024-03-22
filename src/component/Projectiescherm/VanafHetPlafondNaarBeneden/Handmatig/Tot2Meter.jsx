import React from 'react';
import Products from '../../../products/products';

const PVanHetPlaHandmatigTot2Meter = () => {
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
      title: 'Elite Screens M92UWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/408170658/700x700x2/elite-screens-elite-screens-m92uwh-169-203-x-114cm.jpg',
      description: `<p class="prodect-description">
          ✔ 92 inch Scherm<br>
	  ✔ Zwarte behuizing<br>
	  ✔ Full HD doek<br>
	  ✔ 203 x 114 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-m92uwh.html',
    },
    {
      id: 3,
      title: 'Elite Screens M84UWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/408170658/700x700x2/elite-screens-elite-screens-m92uwh-169-203-x-114cm.jpg',
      description: `<p class="prodect-description">
          ✔ 84 inch Scherm<br>
	  ✔ Zwarte behuizing<br>
	  ✔ Full HD doek<br>
	  ✔ 186 x 104 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-m84uwh.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een handmatig projectiescherm tot 100 inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVanHetPlaHandmatigTot2Meter;
