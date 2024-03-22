import React from 'react';
import Products from '../products/products';

const AccessoiresHDMIKabel = () => {
  let products = [
    {
      id: 1,
      title: 'Vivolink Pro 4K HDMI Kabel',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/451795183/700x700x2/vivolink-vivolink-pro-4k-hdmi-kabel-meerdere-lengt.jpg',
      description: `<p class="prodect-description">
          ✔ 4K UHD Kabel<br>
	  ✔ Meerdere lengtes<br>
	  ✔ Metal Head<br>
	  ✔ Meest Verkocht<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/vivolink-pro-4k-hdmi-kabel.html',
    },
    {
      id: 2,
      title: 'Vivolink Pro 4K HDMI Kabel',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/451795183/700x700x2/vivolink-vivolink-pro-4k-hdmi-kabel-meerdere-lengt.jpg',
      description: `<p class="prodect-description">
          ✔ 4K UHD Kabel<br>
	  ✔ Meerdere lengtes<br>
	  ✔ Metal Head<br>
	  ✔ Meest Verkocht<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/vivolink-pro-4k-hdmi-kabel.html',
    },
    {
      id: 3,
      title: 'Vivolink Pro 4K HDMI Kabel',
      imgURL:
        'https://ls.codetech.nl/shops/299003/files/451795183/700x700x2/vivolink-vivolink-pro-4k-hdmi-kabel-meerdere-lengt.jpg',
      description: `<p class="prodect-description">
          ✔ 4K UHD Kabel<br>
	  ✔ Meerdere lengtes<br>
	  ✔ Metal Head<br>
	  ✔ Meest Verkocht<br>
        </p>`,
      link: 'https://www.beamer-winkel.nl/vivolink-pro-4k-hdmi-kabel.html',
    },
  ];
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een HDMI Kabel</h1>

      <Products products={products} />
    </div>
  );
};

export default AccessoiresHDMIKabel;
