import React from "react";
import jpnLogoo from "./navbars/jpn_logo.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbars/Navbar";
import Navbarprofile from "./allnavbars/Navbarprofile";
import Swal from 'sweetalert2'; // ต้องติดตั้ง sweetalert2 ก่อน

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("username") || localStorage.getItem("token");

  const goSignIn = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  const goSignup = () => {
    navigate("/signup");
  };

  const goMenutodo = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Access Denied!',
        text: 'Please login to access the todo list',
        icon: 'warning',
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signin');
        }
      });
      return;
    }
    navigate("/menutodo");
  };

  return (
    <>
      {isLoggedIn ? <Navbarprofile /> : <Navbar />}
      
      <div className="center-content">
        <img src={jpnLogoo} alt="JPN Todolist Logo" className="logoo" />
        <h2 className="tagline">ควบคุมการจัดตารางเวลาง่ายๆโดยใช้</h2>
        <h2 className="app-titlee">JPN Todolist</h2>
        <p className="descriptionn">
          Become focused, organized, and calm with todo app. The World's #1 task
          manager app.
        </p>
        {isLoggedIn ? (
          <button className="start-button" onClick={goMenutodo}>
            Start Now
          </button>
        ) : (
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