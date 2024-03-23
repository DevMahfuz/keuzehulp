import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationButtons = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const [isForwoard, setIsForword] = useState(false);

  let path = location.pathname;

  return (
    <div className="naviget">
      {path !== "/" && (
        <button
          onClick={() => {
            Navigate(-1);
            setIsForword(true);
          }}
        >
          &#8592; Terug
        </button>
      )}

      {isForwoard && (
        <button onClick={() => Navigate(1)}>Volgende &#8594;</button>
      )}
    </div>
  );
};

export default NavigationButtons;
