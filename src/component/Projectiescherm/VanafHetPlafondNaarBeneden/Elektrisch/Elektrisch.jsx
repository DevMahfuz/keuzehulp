import React from "react";
import ItemLink from "../../../ItemLink/item-link";

const ProjectVanHetElektrisch = () => {
  return (
    <div className="container">
      <h1>ik zoek een hangend projectiescherm voor ..</h1>

      <div>
        <ItemLink to="een-4K-Beamer" item="een 4K Beamer" />
        <ItemLink to="een-HD-beamer" item="een HD beamer" />
        <ItemLink to="een-hele-lichte-ruimte" item="een hele lichte ruimte" />
      </div>
    </div>
  );
};

export default ProjectVanHetElektrisch;
