import React, { useState } from "react";
import jpnLogo from "../navbars/jpn_logo.png";
import "./Signin.css";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <div className="logo-container">
          <img src={jpnLogo} alt="JPN Logo" className="jpn-logo" />
        </div>
        <h2 className="signin-title">Sign in to your account</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" placeholder="" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=""
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
              >
                <img
                  src={
                    showPassword
                      ? "https://cdn.discordapp.com/attachments/861532175925116928/1296001688376709130/image.png?ex=6710b321&is=670f61a1&hm=535724526a15ce2bbfea95b3f1785a3044f4336224c942bbe641957bede828c1&"
                      : "https://cdn.discordapp.com/attachments/861532175925116928/1296001359476166726/image.png?ex=6710b2d2&is=670f6152&hm=18d411368535db5cc89775501579453130649b5b4fbfc6d94298b5496aef480d&"
                  }
                  alt="Toggle Password Visibility"
                  className="password-toggle-icon"
                />
              </button>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="signin-button">
              Sign in
            </button>
            <button type="submit" className="sign_up"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
