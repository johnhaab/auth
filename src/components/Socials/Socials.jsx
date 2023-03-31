import React from "react";

import { BsTwitter, BsFacebook, BsGithub, BsGoogle } from "react-icons/bs";

import "./Socials.scss";

const Socials = () => {
  return (
    <div className="container-socials">
      <div className="google">
        <BsGoogle />
      </div>
      <div className="facebook">
        <BsFacebook />
      </div>
      <div className="twitter">
        <BsTwitter />
      </div>
      <div className="github">
        <BsGithub />
      </div>
    </div>
  );
};

export default Socials;
