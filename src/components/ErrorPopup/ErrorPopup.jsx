import React from "react";

import "./ErrorPopup.scss";

const ErrorPopup = ({ message, closeErrMsg }) => {
  return (
    <div className="container-error-popup">
      <div className="error-popup-card">
        <h1>{message}</h1>
        <p onClick={() => closeErrMsg()}>X</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
