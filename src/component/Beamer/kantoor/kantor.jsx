import React from "react";
import ItemLink from "../../ItemLink/item-link";
import { Route, Routes } from "react-router-dom";

const Kantor = () => {
  return (
    <div className="container">
      <h1>Wij hebben een..</h1>

      <div>
        <ItemLink to="licht" item="Licht Kantoor" />
        <ItemLink to="donker" item="Redelijk donker Kantoor" />
      </div>

      <Routes>
        <Route path="/Voor-in-de-woonkamer" />
        <Route path="/Voor-in-de-slaapkamer" />
        <Route path="/Voor-op-kantoor" />
        <Route path="/Voor-mijn-zakelijke-project" />
      </Routes>
    </div>
  );
};

export default Kantor;
