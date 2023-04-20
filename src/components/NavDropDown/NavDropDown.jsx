import React from "react";

import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { Link } from "react-router-dom";

import "./NavDropDown.scss";

const NavDropDown = ({ signOutUser, closeNavDropDownOnFocus }) => {
  return (
    <div
      className="container-nav-drop-down"
      onMouseLeave={() => closeNavDropDownOnFocus()}
    >
      <div className="wrapper-nav-drop-down">
        <div className="card-nav-drop-down">
          <div className="nav-drop-down-one">
            <Link
              to="/auth/profile"
              style={{ textDecoration: "none", color: "#4F4F4F" }}
            >
              <div className="content-dd-one">
                <FaUserCircle />
                <p>My Profile</p>
              </div>
            </Link>
          </div>
          <div className="nav-drop-down-two">
            <FaUserFriends />
            <p>Group Chat</p>
          </div>
          <div className="nav-drop-down-line"></div>
          <div className="nav-drop-down-three" onClick={signOutUser}>
            <ImExit />
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavDropDown;
