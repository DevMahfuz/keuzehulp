import React from "react";
import ItemLink from "../../ItemLink/item-link";

const ProjectieschermVanafHetPlafondNaarBeneden = () => {
  return (
    <div className="container">
      <h1>Ik wil mijn hangende projectiescherm..</h1>

      <div>
        <ItemLink to="Elektrisch-bedienen" item="Elektrisch bedienen" />
        <ItemLink to="Handmatig-bedienen" item="Handmatig bedienen" />
      </div>
    </div>
  );
};

export default ProjectieschermVanafHetPlafondNaarBeneden;
