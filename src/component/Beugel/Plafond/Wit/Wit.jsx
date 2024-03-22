import React from 'react';
import Products from '../../../products/products';

const BeugelPlafondWit = () => {
  let products = [
    {
      id: 1,
      title: 'Peerless PRG-UNV',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/446060562/700x700x2/peerless-prg-unv-prg-precisie-projector-beugel.jpg',
      description: `<p class="prodect-description">
          ✔ Plafondbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 22 KG<br>
	  ✔ Precies in te stellen<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/peerless-prg-unv.html',
    },
    {
      id: 2,
      title: 'iVisions EPB1 Zwart',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/355132923/700x700x2/ivisions-ivisions-beamerbeugel-epb1-zwart.jpg',
      description: `<p class="prodect-description">
          ✔ Plafondbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ Incl. Benodigdheden<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-beamerbeugel-zwart.html',
    },
    {
      id: 3,
      title: 'iVisions IVB16L',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357317787/700x700x2/ivisions-ivisions-beamerbeugel-ivb16l-zwart.jpg',
      description: `<p class="prodect-description">
          ✔ Plafondbeugel<br>
	  ✔ Universeel<br>
	  ✔ Tot 15 KG<br>
	  ✔ 80 tot 100 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-beamerbeugel-ivb16l-zwart.html',
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een zwarte plafondbeugel</h1>

      <Products products={products} />
    </div>
  );
};

export default BeugelPlafondWit;
