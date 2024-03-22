import React from "react";
import ItemLink from "../../ItemLink/item-link";

const BeugelPlafond = () => {
  return (
    <div className="container">
      <h1>Ik zoek een plafondbeugel in de kleur..</h1>

      <div>
        <ItemLink to="Zwart" item="Zwart" />
        <ItemLink to="Wit" item="Wit" />
      </div>
    </div>
  );
};

export default BeugelPlafond;
