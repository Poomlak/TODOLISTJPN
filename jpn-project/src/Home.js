import React from "react";
import jpnLogo from "./navbars/jpn_logo.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbars/Navbar";
const Home = () => {
  const navigate = useNavigate(); // useNavigate ต้องทำงานภายใน <Router>

  const goSignIn = () => {
    navigate("/signin");
  };
  const goSignup = () => {
    navigate("/signup");
  };
  return (
    <>
      <Navbar />
      <div className="center-content">
        <img src={jpnLogo} alt="JPN Todolist Logo" className="logo" />
        <h2 className="tagline">ควบคุมการจัดตารางเวลาง่ายๆโดยใช้</h2>
        <h2 className="app-title">JPN Todolist</h2>
        <p className="description">
          Become focused, organized, and calm with todo app. The World's #1 task
          manager app.
        </p>
        <div className="buttons">
          <button className="sign-in" onClick={goSignIn}>
            Sign In
          </button>
          <button className="sign-up" onClick={goSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
