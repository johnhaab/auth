import React from "react";
import Navbar from "../../components/Navbar/Navbar";

import "./Profile.scss";

const Profile = ({ user }) => {
  return (
    <div className="container-profile">
      <section className="profile-navbar">
        <Navbar user={user} />
      </section>
      {/* <img src={user.profile_picture} alt={user.name} width="250px" />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <p>{user.phone}</p>
      <p>{user.email}</p> */}
    </div>
  );
};

export default Profile;
