import React from "react";
import "./Loading.css";
import logo from "../assets/unipal_logo.png"; // Ensure this path is correct

const Loader = ({ setIsLoading }) => {
  const handleGetStarted = () => {
    setIsLoading(false);
  };

  return (
    <div className="loader">
      <div className="svg-wrapper">
        <img src={logo} alt="UniPal Logo" className="loading-logo" />
        <button className="get-started-button" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
};

export default Loader;
