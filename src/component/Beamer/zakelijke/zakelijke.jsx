import React from "react";
import ItemLink from "../../ItemLink/item-link";

const Zakelijke = () => {
  return (
    <div className="container">
      <h1>Wij hebben een zakelijk project in een..</h1>

      <div>
        <ItemLink to="Lichte-Omgeving" item="Lichte Omgeving" />
        <ItemLink
          to="redelijk-donkere-omgeving"
          item="Redelijk Donkere Omgeving"
        />
      </div>
    </div>
  );
};

export default Zakelijke;
