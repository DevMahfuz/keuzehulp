import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>Keuzehulp Beamers en Projectieschermen</h1>
      <h2>Ik zoek een...</h2>

      <Link to="/beamer" className="item-link">
        Beamer
      </Link>

      <Link to="/projectiescherm" className="item-link">
        Projectiescherm
      </Link>

      <Link to="/beugel" className="item-link">
        beugel
      </Link>

      <Link to="/accessoires" className="item-link">
        Accessoires
      </Link>
    </>
  );
};

export default Home;
