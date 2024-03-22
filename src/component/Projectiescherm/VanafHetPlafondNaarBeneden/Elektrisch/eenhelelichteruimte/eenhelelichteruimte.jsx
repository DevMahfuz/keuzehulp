import React from 'react';
import Products from '../../../../products/products';

const PVanDeVloerOmhoogEEenhelelichteruimte = () => {
  let products = [
    {
      id: 1,
      title: 'Cinema 4K HighContrast',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357364856/700x700x2/ivisions-ivisions-cinema-4k-highcontrast-alr-proje.jpg',
      description: `<p class="prodect-description">
          ✔ High Contrast Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ ALR CLR Projectiedoek<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-cinema-4k-highcontrast-alr.html',
    },
    {
      id: 2,
      title: 'Cinema 4K HighContrast',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/357364856/700x700x2/ivisions-ivisions-cinema-4k-highcontrast-alr-proje.jpg',
      description: `<p class="prodect-description">
          ✔ High Contrast Scherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ ALR CLR Projectiedoek<br>
	  ✔ Met afstandsbediening<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/ivisions-cinema-4k-highcontrast-alr.html',
    },
    {
      id: 3,
      title: 'Adeo Rugby Pro',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/379215215/700x700x2/adeo-adeo-rugby-pro-tension-4k-alr-meerdere-maten.jpg',
      description: `<p class="prodect-description">
          ✔ Custom Projectiescherm<br>
	  ✔ Meerdere Maten<br>
	  ✔ Volledig naar wens<br>
	  ✔ Meerdere doeksoorten<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/adeo-rugby-pro-tension-4k-alr-meerdere-maten.html',
    },
  ];
  return (
    <div className="container">
      <h1>
        Dit zijn de beste keuzes voor een projectiescherm in hele lichte ruimte
      </h1>
      <p>
        Hier kunnen producten worden weergegeven met links naar de
        desbetreffende producten.
      </p>
      <Products products={products} />
    </div>
  );
};

export default PVanDeVloerOmhoogEEenhelelichteruimte;
