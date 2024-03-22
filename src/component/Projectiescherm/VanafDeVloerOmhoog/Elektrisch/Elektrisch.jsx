import React from "react";
import ItemLink from "../../../ItemLink/item-link";

const ProjectieschermVanafDeVloerOmhoogElektrisch = () => {
  return (
    <div className="container">
      <h1>Zo groot ik ik mijn elektrische vloer scherm..</h1>

      <div>
        <ItemLink
          to="tot-2-meter-breed"
          item="1 tot 2 meter breed (80 tot 100 inch)"
        />
        <ItemLink
          to="tot-3-meter-breed"
          item="2 tot 3 meter breed (100 tot 135 inch)"
        />
        <ItemLink
          to="tot-4-meter-breed"
          item="3 tot 4 meter breed (135 tot 150 inch)"
        />
      </div>
    </div>
  );
};

export default ProjectieschermVanafDeVloerOmhoogElektrisch;
