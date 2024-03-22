import React from "react";
import ItemLink from "../../ItemLink/item-link";

const ProjectieschermVanafDeVloerOmhoog = () => {
  return (
    <div className="container">
      <h1>Vanaf de vloer wil ik mijn projectiescherm..</h1>

      <div>
        <ItemLink to="Elektrisch-bedienen" item="Elektrisch bedienen" />
        <ItemLink to="Handmatig-bedienen" item="Handmatig bedienen" />
      </div>
    </div>
  );
};

export default ProjectieschermVanafDeVloerOmhoog;
