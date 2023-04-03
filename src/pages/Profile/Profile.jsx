import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Watermark from "../../components/Watermark/Watermark";

import "./Profile.scss";

const Profile = ({ user }) => {
  const formatBio = () => {
    const str = user.bio;
    const maxLength = 46;
    let formattedString = str.charAt(0).toUpperCase() + str.slice(1);
    if (formattedString.length > maxLength) {
      formattedString = formattedString.slice(0, maxLength) + "...";
    }
    return formattedString;
  };

  return (
    <div className="container-profile">
      <section className="profile-navbar">
        <Navbar user={user} />
      </section>

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
            <div className="group-two">
              <p>Edit</p>
            </div>
          </div>
          <div className="user-profile-card-body">
            <section className="user-profile-card-photo">
              <div className="wrapper-photo">
                <div className="wrapper-photo-two">
                  <p>PHOTO</p>
                </div>
                <img src={user.profile_picture} alt={user.name} />
              </div>
            </section>

            <section className="user-profile-card-name">
              <div className="wrapper-name">
                <div className="wrapper-name-two">
                  <p>NAME</p>
                </div>
                <h1>{user.name}</h1>
              </div>
            </section>

            <section className="user-profile-card-bio">
              <div className="wrapper-bio">
                <div className="wrapper-bio-two">
                  <p>BIO</p>
                </div>
                <h1>{formatBio()}</h1>
              </div>
            </section>

            <section className="user-profile-card-phone">
              <div className="wrapper-phone">
                <div className="wrapper-phone-two">
                  <p>PHONE</p>
                </div>
                <h1>{user.phone}</h1>
              </div>
            </section>

            <section className="user-profile-card-email">
              <div className="wrapper-email">
                <div className="wrapper-email-two">
                  <p>EMAIL</p>
                </div>
                <h1>{user.email}</h1>
              </div>
            </section>

            <section className="user-profile-card-pass">
              <div className="wrapper-pass">
                <div className="wrapper-pass-two">
                  <p>PASSWORD</p>
                </div>
                <h1>{user.password}</h1>
              </div>
            </section>
          </div>
        </div>
        <div className="fix">
          <Watermark />
        </div>
      </section>
    </div>
  );
};

export default Profile;
