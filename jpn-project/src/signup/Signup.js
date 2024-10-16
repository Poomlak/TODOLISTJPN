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
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Re-password" />
          <input type="date" placeholder="Birthday" />
          <input type="email" placeholder="E-mail" />
          <input type="tel" placeholder="Telephone" />
          <button className="sign-up">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
