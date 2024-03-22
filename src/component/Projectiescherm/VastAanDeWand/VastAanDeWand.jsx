import React from "react";
import ItemLink from "../../ItemLink/item-link";

const ProjectieschermVastAanDeWand = () => {
  return (
    <div className="container">
      <h1>Ik zoek een vast projectiescherm voor een</h1>

      <div>
        <ItemLink to="UST-Beamer" item="UST Beamer(zeer dichtbij)" />
        <ItemLink to="Normale-Beamer" item="Normale Beamer (1 tot 2 meter)n" />
      </div>
    </div>
  );
};

export default ProjectieschermVastAanDeWand;
