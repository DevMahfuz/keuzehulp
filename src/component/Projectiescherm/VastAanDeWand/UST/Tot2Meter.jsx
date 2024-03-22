import React from 'react';
import Products from '../../../products/products';

const PVastAanDeWandUSTTot2Meter = () => {
  let products = [
    {
      id: 1,
      title: 'iVisions Edge 4K',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/364108505/700x700x2/ivisions-ivisions-edge-4k-169-vast-projectiescherm.jpg',
      description: `<p class="prodect-description">
          ✔ 4K ALR UST Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Speciaal voor UST<br>
	  ✔ Fixed Frame 4K<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivision-edge-4k-alr.html',
    },
    {
      id: 2,
      title: 'HiViLux Edge 4K',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/422340674/700x700x2/hivilux-hivilux-edge-4k-alr-ust-fixed-frame-meerde.jpg',
      description: `<p class="prodect-description">
          ✔ 8K ALR UST Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Speciaal voor UST<br>
	  ✔ Fixed Frame 8K<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/hivilux-fixed-frame-4k-alr-ust.html',
    },
    {
      id: 3,
      title: 'Optoma ALR101',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/384040484/700x700x2/optoma-optoma-alr101-projectiescherm-voor-ust-proj.jpg',
      description: `<p class="prodect-description">
          ✔ 4K ALR UST Scherm<br>
	  ✔ 100 inch<br>
	  ✔ Speciaal voor UST<br>
	  ✔ Fixed Frame<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/optoma-alr101.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een vast ust projectiescherm tot 100 inch
      </h1>
      <Products products={products} />
    </div>
  );
};

export default PVastAanDeWandUSTTot2Meter;
