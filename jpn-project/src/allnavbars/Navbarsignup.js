// Navbarsignup.js
import React from "react";
import "../navbars/Navbar.css";
import jpnLogo from "./jpn_logo.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Navbarsignup = () => {
  const navigate = useNavigate();

  const goSignin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบก่อนเข้าใช้งานเมนู",
        confirmButtonText: "เข้าสู่ระบบ",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    } else {
      navigate("/menutodo");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src={jpnLogo} alt="JPN Logo" className="navbar-logo" />
          <div className="brand-text">
            <div className="brand-text-main">โปรแกรมรายการสิ่งที่ต้องทำ</div>
            <div className="brand-text-sub">(JPN Todolist)</div>
          </div>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/aboutus">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleMenuClick}>
                Menu
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-nav">
          <button className="btn btn-sign-in" onClick={goSignin}>
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbarsignup;