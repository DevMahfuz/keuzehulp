import React from "react";
import { Link } from "react-router-dom";

const ItemLink = ({ to, item, img }) => {
  return (
    <Link to={to} className="item-link">
      <div className="name">{item}</div>
    </Link>
  );
};

export default ItemLink;
