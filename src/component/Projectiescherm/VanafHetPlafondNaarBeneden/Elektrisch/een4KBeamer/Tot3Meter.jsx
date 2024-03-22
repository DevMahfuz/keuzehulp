import React from 'react';
import Products from '../../../../products/products';

const PVanafHetETot3Meter = () => {
  let products = [
    {
      id: 1,
      title: 'iVisions Cinema 4K',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357372852/700x700x2/ivisions-ivisions-cinema-4k-series-elektrisch-proj.jpg',
      description: `<p class="prodect-description">
          ✔ 4K Tab Tension Scherm<br>
	  ✔ Meerdere maten<br>
	  ✔ Mat Wit Projectiedoek<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-cinema-4k-series.html',
    },
    {
      id: 2,
      title: 'Elite Screens SKT100XHW',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/400771339/700x700x2/elite-screens-elite-screens-skt100xhw-100-inch-tab.jpg',
      description: `<p class="prodect-description">
          ✔ 4K Tab Tension Scherm<br>
	  ✔ 100 inch<br>
	  ✔ Wit of zwarte behuizing<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-skt100xhw.html',
    },
    {
      id: 3,
      title: 'Elite Screens SKT120XHW',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/400771339/700x700x2/elite-screens-elite-screens-skt100xhw-100-inch-tab.jpg',
      description: `<p class="prodect-description">
          ✔ 4K Tab Tension Scherm<br>
	  ✔ 120 inch<br>
	  ✔ Wit of zwarte behuizing<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-skt120xhw.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een 4K projectiescherm van 100 tot 135
        inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVanafHetETot3Meter;
