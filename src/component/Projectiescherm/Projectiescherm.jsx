import React from "react";
import ItemLink from "../ItemLink/item-link";

const Projectiescherm = () => {
  return (
    <div id="b" className="container">
      <h1>Ik wil mijn projectiescherm..</h1>

      <div>
        <ItemLink to="Vanaf-de-vloer-omhoog" item="Vanaf de vloer omhoog" />
        <ItemLink
          to="Vanaf-het-plafond-naar-beneden"
          item="Vanaf het plafond naar beneden"
        />
        <ItemLink to="Mobiel-om-mee-te-nemen" item="Mobiel om mee te nemen" />
        <ItemLink to="Vast-aan-de-wand" item="Vast aan de wand (Fixed Frame)" />
      </div>
    </div>
  );
};

export default Projectiescherm;
