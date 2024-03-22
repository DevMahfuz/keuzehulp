import React from 'react';
import Products from '../../../products/products';

const BeugelMuurWit = () => {
  let products = [
    {
      id: 1,
      title: 'MW Premium Muurbeugel',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/446062172/700x700x2/mw-mw-premium-muurbeugel-10-86-cm.jpg',
      description: `<p class="prodect-description">
          ✔ Muurbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ 10 tot 86 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/mw-premium-muurbeugel-10-86cm.html',
    },
    {
      id: 2,
      title: 'XGIMI X-wall Stand',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/437221647/700x700x2/xgimi-xgimi-x-wall-wall-stand-muurbeugel-voor-xgim.jpg',
      description: `<p class="prodect-description">
          ✔ Muurbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ Beamers met enkel VESA<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/xgimi-x-wall-wall-stand.html',
    },
    {
      id: 3,
      title: 'MW Premium Muurbeugel',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/446062172/700x700x2/mw-mw-premium-muurbeugel-10-86-cm.jpg',
      description: `<p class="prodect-description">
          ✔ Muurbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ 10 tot 86 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/mw-premium-muurbeugel-10-86cm.html',
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een zwarte muurbeugel</h1>
      <Products products={products} />
    </div>
  );
};

export default BeugelMuurWit;
