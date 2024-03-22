import React from 'react';
import Products from '../../../products/products';

const BeugelMuurZwart = () => {
  let products = [
    {
      id: 1,
      title: 'NewStar BEAMER-W100',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/326704504/700x700x2/newstar-beamer-w100-zilver-muurbeugel.jpg',
      description: `<p class="prodect-description">
          ✔ Muurbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 12 KG<br>
	  ✔ 73 tot 123 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/newstar-beamer-w100.html',
    },
    {
      id: 2,
      title: 'iVisions Beamerbeugel B2G',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/452985558/700x700x2/ivisions-ivisions-beamerbeugel-b2g-43-65-cm.jpg',
      description: `<p class="prodect-description">
          ✔ Muurbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ 35 tot 65 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-beamerbeugel-b2g.html',
    },
    {
      id: 3,
      title: 'iVisions Beamerbeugel B2G',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/452985558/700x700x2/ivisions-ivisions-beamerbeugel-b2g-43-65-cm.jpg',
      description: `<p class="prodect-description">
          ✔ Muurbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ 35 tot 65 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-beamerbeugel-b2g.html',
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een normaal witte muurbeugel</h1>
      <Products products={products} />
    </div>
  );
};

export default BeugelMuurZwart;
