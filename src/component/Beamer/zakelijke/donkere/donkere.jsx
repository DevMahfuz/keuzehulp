import React from "react";
import ItemLink from "../../../ItemLink/item-link";

const ZakelijkeDonkere = () => {
  return (
    <div className="container">
      <h1>Dit zijn de beste keuzes voor een klein licht project</h1>
      <div>
        <ItemLink to="Klein" item="Klein (1 tot 20 personen)" />
        <ItemLink to="Middelgroot" item="Middelgroot (20 tot 50 personen)" />
        <ItemLink to="Groot" item="Groot (50 of meer personen)" />
      </div>
    </div>
  );
};

export default ZakelijkeDonkere;
