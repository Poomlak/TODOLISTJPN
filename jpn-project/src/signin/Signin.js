import React from "react";
import jpnLogo from "../navbars/jpn_logo.png";
import "./Signin.css";

const Signin = () => {
  return (
    <div className="center-content">
      <img src={jpnLogo} alt="JPN Todolist Logo" className="logo" />
      <h2 className="tagline">ควบคุมการจัดตารางเวลาง่ายๆโดยใช้</h2>
      <h2 className="app-title">JPN Todolist</h2>
      <p className="description">
        Become focused, organized, and calm with todo app. The World's #1 task
        manager app.
      </p>
    </div>
  );
};

export default Signin;
