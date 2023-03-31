import React from "react";
import logoDark from "../../assets/devchallenges.svg";

import Watermark from "../../components/Watermark/Watermark";
import Socials from "../../components/Socials/Socials";

import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";

import "./Register.scss";

const Register = () => {
  return (
    <div className="container-register">
      <div className="wrapper-register">
        <div className="card-register">
          <img src={logoDark} alt="logo" />
          <section className="top-register">
            <h1>Join thousands of learners from around the world</h1>
            <p>
              Master web development by making real-life projects. There are
              multiple paths for you to choose
            </p>
          </section>
          <section className="middle-register">
            <div className="form-register">
              {/* TODO: Convert form types back to email & password instead of text */}
              <div className="register-email">
                <MdEmail />
                <input type="text" placeholder="Email" />
              </div>
              <div className="register-password">
                <IoMdLock />
                <input type="text" placeholder="Password" />
              </div>
            </div>
          </section>
          <section className="bottom-register">
            <button>Start coding now</button>
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

export default Register;
