import React from "react";
import jpnLogoo from "./navbars/jpn_logo.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbars/Navbar";
import Navbarprofile from "./allnavbars/Navbarprofile"; // Import Navbarprofile

const Home = () => {
  const navigate = useNavigate(); // useNavigate must work within <Router>

  // Check if user is logged in by verifying if a token or username exists in localStorage
  const isLoggedIn = localStorage.getItem("username") || localStorage.getItem("token");

  const goSignIn = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  const goSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      {/* Conditionally render Navbar or Navbarprofile based on login status */}
      {isLoggedIn ? <Navbarprofile /> : <Navbar />}
      
      <div className="center-content">
        <img src={jpnLogoo} alt="JPN Todolist Logo" className="logoo" />
        <h2 className="tagline">ควบคุมการจัดตารางเวลาง่ายๆโดยใช้</h2>
        <h2 className="app-titlee">JPN Todolist</h2>
        <p className="descriptionn">
          Become focused, organized, and calm with todo app. The World's #1 task
          manager app.
        </p>
        {!isLoggedIn && ( // Show sign-in and sign-up buttons only if the user is not logged in
          <div className="buttons">
            <button className="sign-inn" onClick={goSignIn}>
              Sign In
            </button>
            <button className="sign-upp" onClick={goSignup}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;