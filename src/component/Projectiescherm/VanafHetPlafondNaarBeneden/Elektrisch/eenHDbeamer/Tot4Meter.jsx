import React from 'react';
import Products from '../../../../products/products';

const PVanafHetEEenHDbeamerrTot4Meter = () => {
  let products = [
    {
      id: 1,
      title: 'iVisions Electro L',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357664742/700x700x2/ivisions-ivisions-electro-l-series-projectiescherm.jpg',
      description: `<p class="prodect-description">
          ✔ Large Full HD Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Hoge Kwaliteit<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-electro-l-series.html',
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
      title: 'iVisions Electro ProXL',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357752389/700x700x2/ivisions-electro-proxl-series-projectieschermen-me.jpg',
      description: `<p class="prodect-description">
          ✔ Pro XL Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Mat Wit Projectiedoek<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-electro-proxl-series.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een HD projectiescherm van 135 tot 150
        inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVanafHetEEenHDbeamerrTot4Meter;
