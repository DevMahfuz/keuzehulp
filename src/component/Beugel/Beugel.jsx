import React from "react";
import ItemLink from "../ItemLink/item-link";

const Beugel = () => {
  return (
    <div id="c" className="container">
      <h1>Ik zoek een Beugel voor de volgende opstelling</h1>

      <div>
        <ItemLink to="Plafond-montage" item="Plafond montage" />
        <ItemLink to="Muur-Montage" item="Muur Montage" />
        <ItemLink to="Een-projector-standaard" item="Een projector standaard" />
      </div>
    </div>
  );
};

export default Beugel;
