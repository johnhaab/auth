import React from "react";

import "./ErrorPopup.scss";

const ErrorPopup = ({ message }) => {
  return (
    <div className="container-error-popup">
      <div className="error-popup-card">
        <h1>{message}</h1>
      </div>
    </div>
  );
};

export default ErrorPopup;
