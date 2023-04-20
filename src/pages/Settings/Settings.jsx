import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Watermark from "../../components/Watermark/Watermark";
import NavDropDown from "../../components/NavDropDown/NavDropDown";
import PhotoUploadCard from "../../components/PhotoUploadCard/PhotoUploadCard";
import Backdrop from "@mui/material/Backdrop";
import { Link } from "react-router-dom";
import { BsFillCameraFill, BsChevronLeft } from "react-icons/bs";

import "./Settings.scss";

const Settings = ({
  userInfo,
  isNavDropDownOpen,
  checkIfNavDropDownIsOpen,
  signOutUser,
  closeNavDropDownOnFocus,
  isPhotoCardOpen,
  checkIfPhotoCardIsOpen,
  profilePicture,
  handleProfilePictureChange,
  previewProfilePicture,
  updateNewName,
  updateNewBio,
  updateNewPhone,
  updateNewEmail,
  updateNewPassword,
  submitUpdateInfo,
}) => {
  return (
    <>
      {isPhotoCardOpen === true ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={() => console.log("click")}
        >
          <PhotoUploadCard
            profilePicture={profilePicture}
            checkIfPhotoCardIsOpen={checkIfPhotoCardIsOpen}
            handleProfilePictureChange={handleProfilePictureChange}
            previewProfilePicture={previewProfilePicture}
          />
        </Backdrop>
      ) : null}
      <div className="container-settings">
        {userInfo ? (
          <>
            <section
              className="settings-navbar"
              onClick={checkIfNavDropDownIsOpen}
            >
              <Navbar user={userInfo} />
            </section>
            {isNavDropDownOpen === true ? (
              <div className="drop-down-settings">
                <NavDropDown
                  signOutUser={signOutUser}
                  closeNavDropDownOnFocus={closeNavDropDownOnFocus}
                />
              </div>
            ) : null}
            <section className="settings-body">
              <div className="user-settings-card">
                <Link to="/auth/profile" style={{ textDecoration: "none" }}>
                  <div className="settings-go-back">
                    <div className="arrow-left-back">
                      <BsChevronLeft />
                    </div>
                    <p>Back</p>
                  </div>
                </Link>
                <div className="user-settings-card-header">
                  <h1>Change Info</h1>
                  <p>Changes will be reflected to every services</p>
                </div>
                <div className="user-settings-card-body">
                  <section className="user-settings-card-photo">
                    <div
                      className="user-settings-card-photo-container"
                      onClick={() => checkIfPhotoCardIsOpen()}
                    >
                      <div className="user-settings-card-photo-container-wrapper">
                        <div className="camera-for-pic">
                          <BsFillCameraFill />
                        </div>
                        <img src={previewProfilePicture} alt={userInfo.name} />
                      </div>
                      <p>CHANGE PHOTO</p>
                    </div>
                  </section>

                  <section className="user-settings-card-name">
                    <p>Name</p>
                    <input
                      type="text"
                      name="name"
                      defaultValue={userInfo.name}
                      onChange={(e) => updateNewName(e.target.value)}
                    />
                  </section>

                  <section className="user-settings-card-bio">
                    <p>Bio</p>
                    <input
                      type="text"
                      name="bio"
                      defaultValue={userInfo.bio}
                      onChange={(e) => updateNewBio(e.target.value)}
                    />
                  </section>

                  <section className="user-settings-card-phone">
                    <p>Phone</p>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={userInfo.phone}
                      onChange={(e) => updateNewPhone(e.target.value)}
                    />
                  </section>

                  <section className="user-settings-card-email">
                    <p>Email</p>
                    <input
                      type="text"
                      name="email"
                      defaultValue={userInfo.email}
                      onChange={(e) => updateNewEmail(e.target.value)}
                    />
                  </section>

                  <section className="user-settings-card-pass">
                    <p>Password</p>
                    <input
                      type="password"
                      name="password"
                      placeholder="**********"
                      onChange={(e) => updateNewPassword(e.target.value)}
                    />
                  </section>

                  <div className="settings-submit-btn">
                    <button onClick={(e) => submitUpdateInfo(e)}>Save</button>
                  </div>
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
    </>
  );
};

export default Settings;
