import React from 'react';
import Products from '../../products/products';

const PMobielTot3Meter = () => {
  let products = [
    {
      id: 1,
      title: 'Elite Screens F100NWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/446030135/700x700x2/elite-screens-elite-screens-f80nwh-169-178-x-100-c.jpg',
      description: `<p class="prodect-description">
          ✔ 100 inch Scherm<br>
	  ✔ Floor Up<br>
	  ✔ Full HD doek<br>
	  ✔ 229 x 201 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-f100nwh.html',
    },
    {
      id: 2,
      title: 'Elite Screens OMS120H2',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/415490277/700x700x2/elite-screens-elite-screens-oms120h2-263x148cm-pro.jpg',
      description: `<p class="prodect-description">
          ✔ 120 inch Scherm<br>
	  ✔ Op statief<br>
	  ✔ Snel opzetten<br>
	  ✔ 263 x 148 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-oms120h2.html',
    },
    {
      id: 3,
      title: 'Elite Screens T120UWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/322489704/700x700x2/elite-screens-elite-screens-t92uwh-169-210x127cm-m.jpg',
      description: `<p class="prodect-description">
          ✔ 120 inch Scherm<br>
	  ✔ Snel opzetten<br>
	  ✔ Full HD doek<br>
	  ✔ 266 x 149 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-t120uwh.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een mobiel projectiescherm van 100 tot 135
        inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PMobielTot3Meter;
