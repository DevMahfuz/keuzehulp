import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="logo">
      <Link to="/">
        <img src="./logo.jpg" width="200" alt="logo" />
      </Link>
    </header>
  );
};

export default Header;
