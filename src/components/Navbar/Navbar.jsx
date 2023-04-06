import React from "react";

import LogoDark from "../../assets/devchallenges.svg";

import { MdArrowDropDown } from "react-icons/md";

import "./Navbar.scss";

const Navbar = ({ user }) => {
  return (
    <div className="container-navbar">
      <img src={LogoDark} alt="logo" />
      <div className="user-dropdown">
        <img src={user.profilePicture} alt={user.name + "'s profile picture"} />
        <h1>{user.name}</h1>
        <div className="navbar-arrow">
          <MdArrowDropDown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
