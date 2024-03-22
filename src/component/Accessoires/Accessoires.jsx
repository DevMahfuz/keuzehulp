import React from "react";
import ItemLink from "../ItemLink/item-link";

const Accessoires = () => {
  return (
    <div id="d" className="container">
      <h1>Ik zoek een..</h1>

      <div>
        <ItemLink to="Mediaspeler" item="Mediaspeler/streaming optie" />
        <ItemLink to="HDMI-Kabel" item="HDMI Kabel" />
        <ItemLink to="3D-Bril" item="3D Bril" />
      </div>
    </div>
  );
};

export default Accessoires;
