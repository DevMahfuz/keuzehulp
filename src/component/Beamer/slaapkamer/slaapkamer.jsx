import React from "react";
import ItemLink from "../../ItemLink/item-link";

const Slaapkamer = () => {
  return (
    <div className="container">
      <h1>Ik wil de beamer plaatsen..</h1>

      <div>
        <ItemLink to="ust" item="UST (zeer dichtbij)" />
        <ItemLink to="dichtbij" item="Dichtbij (1 tot 2 meter)" />
        <ItemLink to="verderweg" item="Verderweg (2 tot 6 meter)" />
      </div>
    </div>
  );
};

export default Slaapkamer;
