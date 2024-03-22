import React from 'react';
import Products from '../../products/products';

const BeugelEen = () => {
  let products = [
    {
      id: 1,
      title: 'Beamer Statief Zwart',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/362414956/700x700x2/beamer-statief-zwart.jpg',
      description: `<p class="prodect-description">
          ✔ Standaard<br>
	  ✔ Universeel<br>
	  ✔ Verstelbaar<br>
	  ✔ Kantelbaar<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/beamer-statief-zwart.html',
    },
    {
      id: 2,
      title: 'Xgimi Portable x stand',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/436990697/700x700x2/xgimi-xgimi-portable-x-stand.jpg',
      description: `<p class="prodect-description">
          ✔ Standaard<br>
	  ✔ Voor VESA Beamers<br>
	  ✔ Verstelbaar<br>
	  ✔ Kantelbaar<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/xgimi-portable-stand.html',
    },
    {
      id: 3,
      title: 'Visual Projectortrolley',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/340628688/700x700x2/visual-projectortrolley-zwart-15-graden.jpg',
      description: `<p class="prodect-description">
          ✔ Beamer Trolley<br>
	  ✔ Universeel<br>
	  ✔ Verstelbaar<br>
	  ✔ Op Wielen<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/visual-projectortrolley-zwart.html',
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een beamer standaard</h1>
      <Products products={products} />
    </div>
  );
};

export default BeugelEen;
