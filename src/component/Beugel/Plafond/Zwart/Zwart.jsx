import React from 'react';
import Products from '../../../products/products';

const BeugelPlafondZwart = () => {
  let products = [
    {
      id: 1,
      title: 'MW Beamer Beugel 10,9 cm',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/446056272/700x700x2/mw-mw-premium-beamer-beugel-109-cm.jpg',
      description: `<p class="prodect-description">
          ✔ Plafondbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ Strak tegen plafond<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/mw-premium-beamer-beugel-109-cm.html',
    },
    {
      id: 2,
      title: 'Optoma OCM818W',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/324099396/700x700x2/optoma-optoma-ocm818w-ru-plafond-beugel.jpg',
      description: `<p class="prodect-description">
          ✔ Plafondbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ Strak tegen plafond<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/optoma-ocm818w-ru.html',
    },
    {
      id: 3,
      title: 'iVisions Beamerbeugel EPB1',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/367720141/700x700x2/ivisions-universele-beamerbeugel-epb1-wit.jpg',
      description: `<p class="prodect-description">
          ✔ Plafondbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ 15 cm hoogte<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-beamerbeugel-wit.html',
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een normaal witte plafondbeugel</h1>

      <Products products={products} />
    </div>
  );
};

export default BeugelPlafondZwart;
