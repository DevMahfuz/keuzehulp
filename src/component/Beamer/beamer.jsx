import React from "react";
import ItemLink from "../ItemLink/item-link";

const Beamer = () => {
  return (
    <div className="container">
      <h1>Beamer</h1>

      <div>
        <ItemLink to="Voor-in-de-woonkamer" item="Voor in de woonkamer" />
        <ItemLink to="Voor-in-de-slaapkamer" item="Voor in de slaapkamer" />
        <ItemLink to="Voor-op-kantoor" item="Voor op kantoor" />
        <ItemLink
          to="Voor-mijn-zakelijke-project"
          item="Voor mijn zakelijke project"
        />
      </div>
    </div>
  );
};

export default Beamer;
