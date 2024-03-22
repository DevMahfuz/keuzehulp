import React from "react";
import ItemLink from "../../../ItemLink/item-link";

const PVastAanDeWandNormale = () => {
  return (
    <div className="container">
      <h1>
        Ik zoek een vast projectiescherm voor een standaard beamer in de
        volgende maat
      </h1>

      <div>
        <ItemLink
          to="1-tot-2-meter-breed"
          item="1 tot 2 meter breed (80 tot 100 inch)"
        />
        <ItemLink
          to="2-tot-3-meter-breed"
          item="2 tot 3 meter breed (100 tot 135 inch)"
        />
        <ItemLink
          to="3-tot-4-meter-breed"
          item="3 tot 4 meter breed (135 tot 150 inch)"
        />
      </div>
    </div>
  );
};

export default PVastAanDeWandNormale;
