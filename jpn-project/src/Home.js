import React from "react";
import jpnLogo from './jpn_logo.png';
import './Home.css';

const Home = () => {
  return (
    <div className="center-content">
      <img src={jpnLogo} alt="JPN Todolist Logo" className="logo" />
      <h2 className="tagline">ควบคุมการจัดตารางเวลาง่ายๆโดยใช้</h2>
      <h2 className="app-title">JPN Todolist</h2>
      <p className="description">
        Become focused, organized, and calm with todo app. The World's #1 task manager app.
      </p>
      <div className="buttons">
        <button className="sign-in">Sign In</button>
        <button className="sign-up">Sign Up</button>
      </div>
    </div>
  );
};

export default Home;