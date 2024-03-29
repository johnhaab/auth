import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Watermark from "../../components/Watermark/Watermark";
import NavDropDown from "../../components/NavDropDown/NavDropDown";
import { Link } from "react-router-dom";

import "./Profile.scss";

const Profile = ({
  userInfo,
  isNavDropDownOpen,
  checkIfNavDropDownIsOpen,
  signOutUser,
  closeNavDropDownOnFocus,
}) => {
  const formatPass = (pass) => {
    const maxLength = 20;
    let formattedString = pass.charAt(0).toUpperCase() + pass.slice(1);
    if (formattedString.length > maxLength) {
      formattedString = formattedString.slice(0, maxLength) + "...";
    }
    var hiddenString = "";
    for (var i = 0; i < formattedString.length; i++) {
      hiddenString += "*";
    }
    return hiddenString;
  };

  return (
    <div className="container-profile">
      {userInfo ? (
        <>
          <section
            className="profile-navbar"
            onClick={checkIfNavDropDownIsOpen}
          >
            <Navbar user={userInfo} />
          </section>
          {isNavDropDownOpen === true ? (
            <div className="drop-down-profile">
              <NavDropDown
                signOutUser={signOutUser}
                closeNavDropDownOnFocus={closeNavDropDownOnFocus}
              />
            </div>
          ) : null}

          <section className="profile-heading">
            <h1>Personal info</h1>
            <p>Basic info, like your name and photo</p>
          </section>

          <section className="profile-body">
            <div className="user-profile-card">
              <div className="user-profile-card-header">
                <div className="group-one">
                  <h1>Profile</h1>
                  <p>Some info may be visible to other people</p>
                </div>
                <Link to="/settings" style={{ textDecoration: "none" }}>
                  <div className="group-two">
                    <p>Edit</p>
                  </div>
                </Link>
              </div>
              <div className="user-profile-card-body">
                <section className="user-profile-card-photo">
                  <div className="wrapper-photo">
                    <div className="wrapper-photo-two">
                      <p>PHOTO</p>
                    </div>
                    <img src={userInfo.profilePicture} alt={userInfo.name} />
                  </div>
                </section>

                <section className="user-profile-card-name">
                  <div className="wrapper-name">
                    <div className="wrapper-name-two">
                      <p>NAME</p>
                    </div>
                    <h1>{userInfo.name}</h1>
                  </div>
                </section>

                <section className="user-profile-card-bio">
                  <div className="wrapper-bio">
                    <div className="wrapper-bio-two">
                      <p>BIO</p>
                    </div>
                    <h1>
                      {userInfo.bio === null ? "No bio yet..." : userInfo.bio}
                    </h1>
                  </div>
                </section>

                <section className="user-profile-card-phone">
                  <div className="wrapper-phone">
                    <div className="wrapper-phone-two">
                      <p>PHONE</p>
                    </div>
                    <h1>
                      {userInfo.phone === null
                        ? "No phone number added yet..."
                        : userInfo.phone}
                    </h1>
                  </div>
                </section>

                <section className="user-profile-card-email">
                  <div className="wrapper-email">
                    <div className="wrapper-email-two">
                      <p>EMAIL</p>
                    </div>
                    <h1>{userInfo.email}</h1>
                  </div>
                </section>

                <section className="user-profile-card-pass">
                  <div className="wrapper-pass">
                    <div className="wrapper-pass-two">
                      <p>PASSWORD</p>
                    </div>
                    <h1>{formatPass(userInfo.password)}</h1>
                  </div>
                </section>
              </div>
            </div>
            <div className="fix">
              <Watermark />
            </div>
          </section>
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Profile;
