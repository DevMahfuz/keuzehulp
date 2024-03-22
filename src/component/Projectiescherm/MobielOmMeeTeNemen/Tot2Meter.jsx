import React from 'react';
import Products from '../../products/products';

const PMobielTot2Meter = () => {
  let products = [
    {
      id: 1,
      title: 'Elite Screens T92UWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/322489704/700x700x2/elite-screens-elite-screens-t92uwh-169-210x127cm-m.jpg',
      description: `<p class="prodect-description">
          ✔ 92 inch Scherm<br>
	  ✔ Snel opzetten<br>
	  ✔ Full HD doek<br>
	  ✔ 210 x 127 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-t92uwh-169-210x127.html',
    },
    {
      id: 2,
      title: 'Elite Screens T84UWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/322489704/700x700x2/elite-screens-elite-screens-t92uwh-169-210x127cm-m.jpg',
      description: `<p class="prodect-description">
          ✔ 84 inch Scherm<br>
	  ✔ Snel opzetten<br>
	  ✔ Full HD doek<br>
	  ✔ 185 x 104 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-t84uwh.html',
    },
    {
      id: 3,
      title: 'Elite Screens F80NWH',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/446030135/700x700x2/elite-screens-elite-screens-f80nwh-169-178-x-100-c.jpg',
      description: `<p class="prodect-description">
          ✔ 80 inch Scherm<br>
	  ✔ Floor Up<br>
	  ✔ Full HD doek<br>
	  ✔ 178 x 100 cm<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/elite-screens-f80nwh.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een mobiel projectiescherm tot 100 inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PMobielTot2Meter;
