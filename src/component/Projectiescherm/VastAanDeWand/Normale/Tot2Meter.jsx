import React from 'react';
import Products from '../../../products/products';

const PVastAanDeWandNormaleTot2Meter = () => {
  let products = [
    {
      id: 1,
      title: 'iVisions Frame 4K',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/367721309/700x700x2/ivisions-ivisions-frame-4k-series-fixed-frame.jpg',
      description: `<p class="prodect-description">
          ✔ 4K Fixed Frame<br>
	  ✔ Meerdere Maten<br>
	  ✔ 8cm Border<br>
	  ✔ Voor alle type beamers<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-frame-4k-series-alle-maten.html',
    },
    {
      id: 2,
      title: 'Elite Screens Sable Frame',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/446037123/700x700x2/elite-screens-elite-screens-sable-frame-13-gain-me.jpg',
      description: `<p class="prodect-description">
          ✔ 4K Fixed Frame<br>
	  ✔ Meerdere Maten<br>
	  ✔ Aluminium Border<br>
	  ✔ Voor alle type beamers<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-sable-frame-meerdere-maten.html',
    },
    {
      id: 3,
      title: 'Adeo Plano Velvet 4K',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/368633360/700x700x2/adeo-adeo-plano-velvet-4k-meerdere-maten-fixed-fra.jpg',
      description: `<p class="prodect-description">
          ✔ 4K Fixed Frame<br>
	  ✔ Meerdere Maten<br>
	  ✔ Aluminium Border<br>
	  ✔ Voor alle type beamers<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/adeo-plano-velvet-4k.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een normaal vast projectiescherm tot 100
        inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVastAanDeWandNormaleTot2Meter;
