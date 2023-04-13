import React from "react";
import logoDark from "../../assets/devchallenges.svg";

import Watermark from "../../components/Watermark/Watermark";
import Socials from "../../components/Socials/Socials";
import ErrorPopup from "../../components/ErrorPopup/ErrorPopup";

import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";

import { Link } from "react-router-dom";

import "./Register.scss";

const Register = ({
  updateEmail,
  updatePass,
  registerUserFunction,
  registerError,
  registerErrorMsg,
  twitterAuth,
}) => {
  return (
    <>
      {registerError === true ? (
        <div>
          {registerErrorMsg.map((errorMsg, index) => (
            <ErrorPopup key={index} message={errorMsg} />
          ))}
        </div>
      ) : null}
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
                  <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => updateEmail(e.target.value)}
                  />
                </div>
                <div className="register-password">
                  <IoMdLock />
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => updatePass(e.target.value)}
                  />
                </div>
              </div>
            </section>
            <section className="bottom-register">
              <button onClick={() => registerUserFunction()}>
                Start coding now
              </button>
              <h3>or continue with these social profiles</h3>
              <Socials twitterAuth={twitterAuth} />
              <p>
                Already a member?
                <Link to="/signin">
                  <span>Login</span>
                </Link>
              </p>
            </section>
          </div>
          <Watermark />
        </div>
      </div>
    </>
  );
};

export default Register;
