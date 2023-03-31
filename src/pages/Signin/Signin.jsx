import React from "react";

import logoDark from "../../assets/devchallenges.svg";

import Watermark from "../../components/Watermark/Watermark";
import Socials from "../../components/Socials/Socials";

import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";

import "./Signin.scss";

const Signin = () => {
  return (
    <div className="container-sign-in">
      <div className="wrapper-sign-in">
        <div className="card-sign-in">
          <img src={logoDark} alt="logo" />
          <section className="top-sign-in">
            <h1>Login</h1>
          </section>
          <section className="middle-sign-in">
            <div className="form-sign-in">
              {/* TODO: Convert form types back to email & password instead of text */}
              <div className="sign-in-email">
                <MdEmail />
                <input type="text" placeholder="Email" />
              </div>
              <div className="sign-in-password">
                <IoMdLock />
                <input type="text" placeholder="Password" />
              </div>
            </div>
          </section>
          <section className="bottom-sign-in">
            <button>Login</button>
            <h3>or continue with these social profiles</h3>
            <Socials />
            <p>
              Already a member?
              <span>Login</span>
            </p>
          </section>
        </div>
        <Watermark />
      </div>
    </div>
  );
};

export default Signin;
