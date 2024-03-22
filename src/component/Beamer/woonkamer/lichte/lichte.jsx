import React from "react";
import ItemLink from "../../../ItemLink/item-link";
import { Route, Routes } from "react-router-dom";
import Ust from "./ust/ust";
import Dichtbij from "./dichtbij/dichtbij";
import Verderweg from "./verderweg/verderweg";

const Lichte = () => {
  return (
    <div className="container">
      <h1>Ik wil de beamer plaatsen..</h1>

      <div>
        <ItemLink to="ust" item="UST (zeer dichtbij)" />
        <ItemLink to="dichtbij" item="Dichtbij (1 tot 2 meter)" />
        <ItemLink to="verderweg" item="Verderweg (2 tot 6 meter)" />
      </div>

      <Routes>
        <Route path="/ust" element={<Ust />} />
        <Route path="/dichtbij" element={<Dichtbij />} />
        <Route path="/verderweg" element={<Verderweg />} />
      </Routes>
    </div>
  );
};

export default Lichte;
