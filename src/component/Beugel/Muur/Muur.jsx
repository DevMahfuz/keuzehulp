import React from "react";
import ItemLink from "../../ItemLink/item-link";

const BeugelMuur = () => {
  return (
    <div className="container">
      <h1>In de volgende kleur</h1>

      <div>
        <ItemLink to="Zwart" item="Zwart" />
        <ItemLink to="Wit" item="Wit" />
      </div>
    </div>
  );
};

export default BeugelMuur;
