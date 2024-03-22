import React from 'react';
import Products from '../products/products';

const AccessoiresMediaspeler = () => {
  let products = [
    {
      id: 1,
      title: 'Google Chromecast 4K',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/356536021/700x700x2/google-chromecast-4k-ultra-met-google-tv.jpg',
      description: `<p class="prodect-description">
          ✔ 4K UHD Speler<br>
	  ✔ Met APP store<br>
	  ✔ Met afstandsbediening<br>
	  ✔ Meest gebruikt<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/google-chromecast-ultra.html',
    },
    {
      id: 2,
      title: 'Xiaomi Mi Box S',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/326540865/700x700x2/xiaomi-mi-box-s-8gb-wifi-4k.jpg',
      description: `<p class="prodect-description">
          ✔ 4K UHD Speler<br>
	  ✔ Met APP store<br>
	  ✔ Met afstandsbediening<br>
	  ✔ NA Chromecast de beste<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/xiaomi-mi-box-s.html',
    },
    {
      id: 3,
      title: 'Google Chromecast HD',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/356536021/700x700x2/google-chromecast-4k-ultra-met-google-tv.jpg',
      description: `<p class="prodect-description">
          ✔ Full HD Speler<br>
	  ✔ Met APP store<br>
	  ✔ Met afstandsbediening<br>
	  ✔ Meest gebruikt<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/google-chromecast-hd.html',
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een Mediaspeler voor de Beamer</h1>

      <Products products={products} />
    </div>
  );
};

export default AccessoiresMediaspeler;
