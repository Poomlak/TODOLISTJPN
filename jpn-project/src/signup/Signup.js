import React from "react";
import jpnLogo from "../navbars/jpn_logo.png";
import "./Signup.css";

const Signup = () => {
  return (
    <div className="container-signup">
      <div className="logo-and-title">
        <img src={jpnLogo} alt="JPN Todolist Logo" className="logo" />
        <h1 className="app-title">Create an account</h1>
      </div>

      <div className="form-container">
        <form className="signup-form">
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="input-group">
            <label htmlFor="repassword">Re-password:</label>
            <input
              type="password"
              id="repassword"
              placeholder="Re-enter your password"
            />
          </div>

          <div className="input-group">
            <label htmlFor="birthday">Birthday:</label>
            <input type="date" id="birthday" />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label htmlFor="telephone">Telephone:</label>
            <input
              type="tel"
              id="telephone"
              placeholder="Enter your phone number"
            />
          </div>

          <button className="sign-up">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
