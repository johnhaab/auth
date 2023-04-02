import React from "react";
import Navbar from "../../components/Navbar/Navbar";

import "./Profile.scss";

const Profile = ({ user }) => {
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
        <div className="user-profile-card"></div>
      </section>
    </div>
  );
};

export default Profile;
