import React from "react";
import ItemLink from "../../../ItemLink/item-link";

const KantorDonker = () => {
  return (
    <div className="container">
      <h1>Grootte van het kantoor..</h1>

      <div>
        <ItemLink to="Klein" item="Klein (1 tot 10 personen)" />
        <ItemLink to="Middelgroot" item="Middelgroot (10 tot 15 personen)" />
        <ItemLink to="Groot" item="Groot (15 of meer personen)" />
      </div>
    </div>
  );
};

export default KantorDonker;
