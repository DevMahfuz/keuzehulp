import React from 'react';
import Products from '../../products/products';

const PMobielTot4Meter = () => {
  let products = [
    {
      id: 1,
      title: 'Elite Screens OMS135HR2',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/400710476/700x700x2/elite-screens-elite-screens-oms135hr2-299x168cm-pr.jpg',
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ Op Statief<br>
	  ✔ Full HD doek<br>
	  ✔ 299 x 168 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-oms135hr2.html',
    },
    {
      id: 2,
      title: 'Elite Screens OMS135HR2',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/400710476/700x700x2/elite-screens-elite-screens-oms135hr2-299x168cm-pr.jpg',
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ Op Statief<br>
	  ✔ Full HD doek<br>
	  ✔ 299 x 168 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-oms135hr2.html',
    },
    {
      id: 3,
      title: 'Elite Screens OMS135HR2',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/400710476/700x700x2/elite-screens-elite-screens-oms135hr2-299x168cm-pr.jpg',
      description: `<p class="prodect-description">
          ✔ 135 inch Scherm<br>
	  ✔ Op Statief<br>
	  ✔ Full HD doek<br>
	  ✔ 299 x 168 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-oms135hr2.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een mobiel projectiescherm van 135 tot 150
        inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PMobielTot4Meter;
