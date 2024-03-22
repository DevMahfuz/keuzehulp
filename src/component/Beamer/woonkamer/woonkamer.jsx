import React from "react";
import ItemLink from "../../ItemLink/item-link";

const Woonkamer = () => {
  return (
    <div className="container">
      <h1>Voor in de woonkamer</h1>

      <div>
        <ItemLink
          to="ik-heb-een-donkere-woonkamer"
          item="Ik heb een donkere woonkamer"
        />
        <ItemLink
          to="ik-heb-een-lichte-woonkamer"
          item="Ik heb een lichte woonkamer"
        />
      </div>
    </div>
  );
};

export default Woonkamer;
