import React from 'react';
import Products from '../../../../products/products';

const PVanafHetEEenHDbeamerrTot3Meter = () => {
  let products = [
    {
      id: 1,
      title: 'Electro M-Series',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357499972/ivisions-electro-m-series-projectieschermen-meerde.jpg',
      description: `<p class="prodect-description">
          ✔ Full HD Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Hoge Kwaliteit<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-electro-m-series.html',
    },
    {
      id: 2,
      title: 'iVisions Electro ProHD',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357746311/700x700x2/ivisions-ivisions-electro-prohd-series-meerdere-ma.jpg',
      description: `<p class="prodect-description">
          ✔ Pro HD Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Mat Wit Projectiedoek<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-electro-prohd-series.html',
    },
    {
      id: 3,
      title: 'Elite Screens Electric100H',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/408233754/700x700x2/elite-screens-elite-screens-electric100h-169-221-x.jpg',
      description: `<p class="prodect-description">
          ✔ 100 inch HD scherm<br>
	  ✔ 221 x 124 cm<br>
	  ✔ Wit of Zwarte behuizing<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-electric100h.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een HD projectiescherm van 100 tot 135
        inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVanafHetEEenHDbeamerrTot3Meter;
